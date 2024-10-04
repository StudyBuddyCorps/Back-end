import { Request, Response } from "express";
import { userService } from "../service";
import { validationResult } from "express-validator";
import { SignupLocalRequest } from "../interface/DTO/user/SignupDTO";
import { LoginResponse } from "../interface/DTO/auth/LoginDTO";

const signUp = async (req: Request, res: Response) => {
  const signupDTO: SignupLocalRequest = req.body;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const newUser: LoginResponse = await userService.createUser(signupDTO);

    res.cookie("refreshToken", newUser.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // secure: true,
    });
    return res.status(200).json({ accessToken: newUser.accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
};

export default {
  signUp,
};
