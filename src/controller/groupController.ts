import { Request, Response } from "express";
import groupService from '../service/groupService';
import { userService } from "../service";

const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, goalStudyTime, creatorId } = req.body;
    if (!creatorId) {
      return res.status(400).json({ error: 'Creator ID is required' });
    }
    const group = await groupService.createGroup({
      name,
      description,
      goalStudyTime,
      members: [{ userId: creatorId, role: 'admin' }]
    });
    
    await userService.addGroupToUser(creatorId, group._id.toString());

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: "Error Creating Group" });
  }
};

const getMyGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

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
      return res.status(400).json({ error: 'Group name is required for search' });
    }
    const groups = await groupService.searchGroupsByName(name as string);
    return res.status(200).json(groups);
  } catch (error) {
    return res.status(500).json({ message: "Error 500" });
  }
};

const addMemberToGroup = async (req: Request, res: Response) => {
  try {
    const { groupId, userId, role } = req.body;
    const updatedGroup = await groupService.addMemberToGroup(groupId, userId, role);
    
    await userService.addGroupToUser(userId, groupId.toString());
    
    return res.status(200).json(updatedGroup);
  } catch (error) {
    return res.status(500).json({ message: "Error 500" });
  }
};

export default {
  createGroup,
  getMyGroups,
  searchGroups,
  addMemberToGroup
};