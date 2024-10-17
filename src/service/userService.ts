import mongoose from "mongoose";
import User from "../model/User";
import { SignupLocalRequest } from "../interface/DTO/user/SignupDTO";
import bcrypt from "bcrypt";
import jwt from "../util/jwt";

const createUser = async (signupUser: SignupLocalRequest) => {
  try {
    const existUser = await User.findOne({ email: signupUser.email });
    if (existUser) {
      throw new Error("User already exists");
    }

    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(signupUser.password, saltRounds);

    const user = new User({
      email: signupUser.email,
      provider: "local",
      nickname: signupUser.nickname,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    const accessToken = jwt.sign(savedUser._id.toString(), savedUser.nickname);
    const refreshToken = jwt.refresh();

    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user");
  }
};

const getUserByID = async (userID: string) => {
  try {
    const user = await User.findById({ userID });
    if (!user) {
      throw new Error("User not Found");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to find user by ID");
  }
};

const deleteUser = async (email: string) => {
  try {
    const deleteResult = await User.deleteOne({ email });
    if (deleteResult.deletedCount == 0) {
      throw new Error("User not Found or already deleted.");
    }

    return { message: "User successfully deleted" };
  } catch (error) {
    console.error(error);
    throw error;
  }
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
  addGroupToUser,
  getUserByID,
  deleteUser,
};
