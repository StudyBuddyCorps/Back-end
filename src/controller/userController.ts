import { Request, Response } from "express";
import { userService } from "../service";
import { validationResult } from "express-validator";
import { SignupLocalRequest } from "../interface/DTO/user/SignupDTO";
import { LoginResponse } from "../interface/DTO/auth/LoginDTO";

const signUp = async (req: Request, res: Response) => {
  const signupDTO: SignupLocalRequest = req.body;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  try {
    const newUser: LoginResponse = await userService.createUser(signupDTO);

    res.cookie("refreshToken", newUser.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newUser.accessToken, {
      httpOnly: false,
      //secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserByID(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      name: user.nickname,
      imgUrl: user.profileUrl,
      goal: user.goal,
      defaultSettings: user.defaultSettings,
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Error retrieving user" });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

const checkNicknameDuplicate = async (req: Request, res: Response) => {
  const { nickname, userId } = req.body;
  try {
    const isDuplicate = await userService.checkNicknameDuplicate(nickname, userId);
    if (isDuplicate) {
      return res.status(409).json({ success: false, message: "Nickname is already in use" });
    }

    return res.status(200).json({ isDuplicate });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to check nickname duplicate" });
  }
};

const updateNickname = async (req: Request, res: Response) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ success: false, message: "Missing id or name" });
  }

  try {
    await userService.updateNickname(id, name);
    return res.status(200).json({ success: true, message: "Nickname updated successfully" });
  } catch (error) {
    console.error("Error updating nickname:", error);
    return res.status(500).json({ success: false, message: "Failed to update nickname" });
  }
};

const updatePhrase = async (req: Request, res: Response) => {
  const { userId, phrase } = req.body;
  try {
    await userService.updatePhrase(userId, phrase);
    return res.status(200).json({ success: true, message: "Phrase updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update phrase" });
  }
};

const updateGoal = async (req: Request, res: Response) => {
  const { userId, goal } = req.body;
  try {
    await userService.updateGoal(userId, goal);
    return res.status(200).json({ success: true, message: "Goal updated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Failed to update goal" });
  }
};

export default {
  signUp,
  getUserById,
  getAllUsers,
  checkNicknameDuplicate,
  updateNickname,
  updatePhrase,
  updateGoal,
};
