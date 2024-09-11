import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interface/DTO/user/IUser";
import { userService } from "../service";
import config from "../config";

const signUp = async (req: Request, res: Response) => {
  const { email, password, nickname }: IUser = req.body;
  try {
    // Check If the Input Fields are valid
    if (!email || !password || !nickname) {
      return res.status(400).json({
        message: "Please Fill All Fields.",
        email: email,
        password: password,
        nickname: nickname,
      });
    }

    // Find User Exist in DB
    const exist = await userService.findUser(email);
    if (exist) return res.status(409).json({ message: "User Already Exists" });

    // Hash the Password
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save User to DB
    const newUser = await userService.createUser({
      email,
      password: hashedPassword,
      nickname,
    });

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

const getUser = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    // Check If the Input Fields are valid
    if (!email || !password) {
      return res.status(400).json({
        message: "Please Fill All Fields.",
      });
    }

    // Check If User Exist in DB
    const user = await userService.findUser(email);
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    // Compare Password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, nickname: user.nickname },
      config.jwtSecret || "1234!@#%<{*&)",
      { expiresIn: 36000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

    return res
      .status(201)
      .json({ message: "Login Successful", data: token, token: token });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user" });
  }
};

export default {
  signUp,
  getUser,
};
