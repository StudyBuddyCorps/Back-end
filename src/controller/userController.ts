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
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newUser.accessToken, {
      httpOnly: false,
      //secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error });
  }
};

export default {
  signUp,
};
