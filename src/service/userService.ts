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

    const refreshToken = jwt.refresh();

    const user = new User({
      email: signupUser.email,
      provider: "local",
      nickname: signupUser.nickname,
      password: hashedPassword,
      refreshToken: refreshToken,
    });
    const savedUser = await user.save();

    const accessToken = jwt.sign(savedUser._id.toString(), savedUser.nickname);

    return { accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user");
  }
};

const getUserByID = async (userId: mongoose.Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not Found");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to find user by ID");
  }
};

const getUserByRefresh = async (refreshToken: string) => {
  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user) {
      throw new Error("User not Found");
    }
    return user;
  } catch (error) {
    console.error(error);
  }
};

// 유저 삭제
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

// 유저에게 그룹 추가
const addGroupToUser = async (userId: string, groupId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const groupObjectId = new mongoose.Types.ObjectId(groupId);

  if (!user.myGroups.includes(groupObjectId)) {
    user.myGroups.push(groupObjectId);
    await user.save();
  }
};

// 모든 유저
const getAllUsers = async () => {
  return await User.find({}, "nickname profileUrl");
};

// 닉네임 중복 확인
const checkNicknameDuplicate = async (nickname: string, userId?: string) => {
  const user = await User.findOne({
    nickname: { $regex: `^${nickname}$` },
    ...(userId ? { _id: { $ne: userId } } : {}),
  });
  return !!user;
};

// 닉네임 변경
const updateNickname = async (userId: string, nickname: string) => {
  const isDuplicate = await checkNicknameDuplicate(nickname, userId);
  if (isDuplicate) {
    throw new Error("Nickname is already in use");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.nickname = nickname;
  await user.save();
};

// 명언 변경
const updatePhrase = async (userId: string, phrase: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.phrase) {
    user.phrase.content = phrase;
  } else {
    user.phrase = { isRandom: true, content: phrase };
  }

  await user.save();
};

// 목표 변경
const updateGoal = async (userId: string, goal: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.goal = goal;
  await user.save();
};

export default {
  createUser,
  addGroupToUser,
  getUserByID,
  getUserByRefresh,
  deleteUser,
  getAllUsers,
  checkNicknameDuplicate,
  updateNickname,
  updatePhrase,
  updateGoal,
};
