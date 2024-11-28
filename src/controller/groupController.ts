import { Request, Response } from "express";
import groupService from "../service/groupService";
import { userService } from "../service";

const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, goalStudyTime } = req.body;
    const creatorId = req.userId;
    if (!creatorId) {
      return res.status(400).json({ error: "Creator ID is required" });
    }
    const group = await groupService.createGroup({
      name,
      description,
      goalStudyTime,
      members: [{ userId: creatorId, role: "admin" }],
    });

    await userService.addGroupToUser(creatorId, group._id.toString());

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: "Error Creating Group" });
  }
};

const getMyGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const groups = await groupService.getMyGroups(userId);
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: "Error in getMyGroups" });
  }
};

const searchGroups = async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Group name is required for search" });
    }
    const groups = await groupService.searchGroupsByName(name as string);
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: "Error 500" });
  }
};

const addMemberToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, role, memberId } = req.body;

    const updatedGroup = await groupService.addMemberToGroup(
      groupId,
      memberId,
      role
    );

    await userService.addGroupToUser(memberId, groupId.toString());

    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ message: "Error 500" });
  }
};

const getGroupById = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const group = await groupService.getGroupById(groupId);
    return res.status(200).json(group);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving group data" });
  }
};

const searchMemberInGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const members = await groupService.searchMembersInGroup(
      groupId,
      searchTerm as string
    );
    return res.status(200).json(members);
  } catch (error) {
    console.error("Error searching member in group:", error);
    return res.status(500).json({ message: "Error searching member in group" });
  }
};

const getGroupMembers = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = await groupService.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Fetch member details
    const memberDetails = await Promise.all(
      group.members.map(async (member: any) => {
        const user = await userService.getUserByID(member.userId);
        return {
          userId: user._id.toString(),
          nickname: user.nickname,
          email: user.email,
          role: member.role,
        };
      })
    );

    return res.status(200).json(memberDetails);
  } catch (error) {
    console.error("Error fetching group members:", error);
    return res.status(500).json({ message: "Error fetching group members" });
  }
};

export default {
  createGroup,
  getMyGroups,
  searchGroups,
  addMemberToGroup,
  getGroupById,
  searchMemberInGroup,
  getGroupMembers,
};
