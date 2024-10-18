import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { authService, userService } from "../service";
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
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // secure: true, https 환경에서 사용하도록
    });

    res.cookie("accessToken", loginResult.accessToken, {
      httpOnly: false,
      //secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    // return Access Token
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error });
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
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // secure: true, https 환경에서 사용하도록
    });

    res.cookie("accessToken", kakaoLogin.accessToken, {
      httpOnly: false,
      //secure: true,
      sameSite: "strict",
      maxAge: 1 * 60 * 1000,
    });

    // return Access Token
    return res.redirect("http://localhost:3000/home");
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const { code } = req.query;
  try {
    const googleLogin: LoginResponse = await authService.googleLogin(
      code as string
    );

    // set refresh Token as HttpOnly Cookies
    res.cookie("refreshToken", googleLogin.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60 * 1000,
      // secure: true, https 환경에서 사용하도록
    });

    res.cookie("accessToken", googleLogin.accessToken, {
      httpOnly: false,
      //secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    // return Access Token
    return res.redirect("http://localhost:3000/home");
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const getNewToken = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  const accessToken = req.headers.authorization?.split("Bearer ")[1];
  const refreshToken = req.cookies.refreshToken;

  try {
    const decodedAccessToken = jwt.verify(accessToken as string);
    const decodedRefreshToken = jwt.verify(refreshToken as string);

    if (decodedAccessToken?.type == -2 || decodedRefreshToken?.type == -2)
      // 유효하지 않은 토큰 처리
      return res
        .status(401)
        .json({ status: 401, message: "유효하지 않은 토큰입니다." });

    if (decodedAccessToken?.type == -1)
      // 만료된 refresh 토큰 시 -> 재로그인 유도
      return res.status(401).json({ status: 401, message: "재로그인 하세요" });

    // Access Token만 만료 된 경우(refresh는 유효) -> 재발급
    const user = await userService.getUserByRefresh(refreshToken as string);
    if (!user)
      return res
        .status(401)
        .json({ status: 401, message: "유저가 존재하지 않습니다" });

    const newAccessToken = jwt.sign(user._id.toString(), user.nickname);
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const logout = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // HTTPS에서만 작동
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
export default {
  login,
  kakaoLogin,
  googleLogin,
  getNewToken,
  logout,
};
