import { GroupData } from "../interface/DTO/group/IGroup";
import Group from "../model/Group";
import User from "../model/User";
import mongoose from "mongoose";

const createGroup = async (groupData: GroupData) => {
  const group = new Group(groupData);
  return await group.save();
};

const searchGroupsByName = async (name: string) => {
  const groups = await Group.find({
    name: { $regex: name, $options: "i" },
  }).select("_id name createdAt members");
};

const addMemberToGroup = async (
  groupId: string,
  userId: string,
  role: "member"
) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw new Error("Group not found");
  }

  const objectIdUserId = new mongoose.Types.ObjectId(userId);

  const memberExists = group.members.some(
    (member: any) => member.userId.toString() === userId
  );
  if (memberExists) {
    throw new Error("User is already a member of this group");
  }

  group.members.push({ userId: objectIdUserId, role: role });
  await group.save();

  await User.findByIdAndUpdate(userId, { $addToSet: { myGroups: groupId } });

  return group;
};

const getMyGroups = async (userId: string) => {
  const user = await User.findById(userId).populate("myGroups").exec();
  if (!user || !user.myGroups) {
    throw new Error("User not found or has no groups");
  }

  return user.myGroups.map((group: any) => ({
    groupId: group._id,
    name: group.name,
    createdAt: group.createdAt,
    role:
      group.members.find((member: any) => member.userId.toString() === userId)
        ?.role || "member",
    memberCount: group.members.length,
  }));
};

const getGroupById = async (groupId: string) => {
  const group = await Group.findById(groupId).populate(
    "members.userId",
    "name"
  );

  if (!group) {
    throw new Error("Group not found");
  }

  return {
    groupId: group._id,
    name: group.name,
    description: group.description,
    goalStudyTime: group.goalStudyTime,
    createdAt: group.createdAt,
    members: group.members.map((member: any) => ({
      userId: member.userId._id,
      name: member.userId.name,
      role: member.role,
    })),
  };
};

const searchMembersInGroup = async (groupId: string, searchTerm: string) => {
  const group = await Group.findById(groupId).populate(
    "members.userId",
    "nickname profileUrl"
  );
  if (!group) {
    throw new Error("Group not found");
  }

  return group.members
    .filter((member: any) =>
      member.userId.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((member: any) => ({
      userId: member.userId._id,
      name: member.userId.nickname,
      imgUrl: member.userId.profileUrl,
      role: member.role,
    }));
};

const groupService = {
  createGroup,
  searchGroupsByName,
  addMemberToGroup,
  getMyGroups,
  getGroupById,
  searchMembersInGroup,
};

export default groupService;
