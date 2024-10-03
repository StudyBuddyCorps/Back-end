import { GroupData } from "../interface/DTO/group/IGroup";
import Group from '../model/Group';
import User from '../model/User';

const createGroup = async (groupData: GroupData) => {
  const group = new Group(groupData);
  await group.save();
  return group;;
};

const getGroupsByUserId = async (userId: string) => {
  const user = await User.findById(userId).populate('myGroups').exec();
  if (!user) {
    throw new Error('User not found');
  }
  return user.myGroups;
};

const searchGroupsByName = async (name: string) => {
  const groups = await Group.find({ name: { $regex: name, $options: 'i' } });
    return groups.map((group: any) => ({
      groupId: group._id,
      name: group.name,
      createdAt: group.createdAt,
      memberCount: group.members.length,
    }));
};

const addMemberToGroup = async (groupId: string, userId: string, role: 'member') => {
  const updatedGroup = await Group.findByIdAndUpdate(
    groupId,
    { $push: { members: { userId, role } } },
    { new: true }
  );

  if (updatedGroup) {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { myGroups: groupId } }
    );
  }

  return updatedGroup;
};

const getMyGroups = async (userId: string) => {
  const user = await User.findById(userId);
    
  if (!user || !user.myGroups || user.myGroups.length === 0) {
    throw new Error('User not found');
  }

  const groups = await Group.find({ _id: { $in: user.myGroups } });

  const groupsDetails = groups.map((group: any) => {
      const member = group.members.find((member: any) => member.userId.toString() === userId);
      const role = member ? member.role : 'Member';

      return {
        groupId: group._id,
        name: group.name,
        createdAt: group.createdAt,
        role: role,
        memberCount: group.members.length,
      };
  });

  return groupsDetails;
}


const groupService = {
  createGroup,
  getGroupsByUserId,
  searchGroupsByName,
  addMemberToGroup,
  getMyGroups
};

export default groupService;