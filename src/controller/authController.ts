import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { authService } from "../service";
import {
  LoginLocalRequest,
  LoginResponse,
} from "../interface/DTO/auth/LoginDTO";
import jwt from "../util/jwt";

const login = async (req: Request, res: Response) => {
  const loginLocal: LoginLocalRequest = req.body;

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    const loginResult: LoginResponse = await authService.localLogin(loginLocal);

    // set refresh Token as HttpOnly Cookies
    res.cookie("refreshToken", loginResult.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // secure: true, https 환경에서 사용하도록
    });

    return res.status(200).json({ accessToken: loginResult.accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const kakaoLogin = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { code } = req.query;
  try {
    const kakaoLogin: LoginResponse = await authService.kakaoLogin(
      code as string
    );

    // set refresh Token as HttpOnly Cookies
    res.cookie("refreshToken", kakaoLogin.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      // secure: true, https 환경에서 사용하도록
    });

    // return Access Token
    return res.status(200).json({ accessToken: kakaoLogin.accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const googleLogin = async (req: Request, res: Response) => {};

const refresh = async (req: Request, res: Response) => {
  try {
    const accessToken = req.headers.authorization?.split("Bearer ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "No access token or refresh token provided",
      });
    }

    const result = await authService.refreshToken({
      accessToken,
      refreshToken,
    });
    if (result.status === 200) {
      return res.status(200).json({
        accessToken: result.accessToken,
      });
    } else {
      return res.status(result.status).json({
        message: result.message,
      });
    }
  } catch (error) {
    return res.status(403).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export default {
  login,
  kakaoLogin,
  googleLogin,
  refresh,
};
