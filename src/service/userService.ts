import mongoose from "mongoose";
import User from "../model/User";
import { IUser } from "../interface/DTO/user/IUser";

const createUser = (data: IUser) => {
  const user = new User(data);
  return user.save();
};

const findUser = (email: string) => {
  return User.findOne({ email });
};

const addGroupToUser = async (userId: string, groupId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const groupObjectId = new mongoose.Types.ObjectId(groupId)

  if (!user.myGroups.includes(groupObjectId)) {
    user.myGroups.push(groupObjectId);
    await user.save();
  }
};

export default {
  createUser,
  findUser,
  addGroupToUser
};
