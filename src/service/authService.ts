import User from "../model/User";
import { LoginLocalRequest } from "../interface/DTO/auth/LoginDTO";
import bcrypt from "bcrypt";
import axios from "axios";
import qs from "qs";
import config from "../config";
import { getKakaoUserInfo } from "../util/social";
import jwt from "../util/jwt";
import { refreshTokenRequest } from "../interface/DTO/auth/RefreshTokenDTO";

const localLogin = async (loginLocal: LoginLocalRequest) => {
  try {
    const user = await User.findOne({ email: loginLocal.email });
    if (!user) {
      throw new Error("User not Found");
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(loginLocal.password, user.password);
      if (!isMatch) {
        throw new Error("Invalid User Password");
      }
    }

    // create Token
    const accessToken = jwt.sign(user._id.toString(), user.nickname);
    const refreshToken = jwt.refresh();

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const kakaoLogin = async (code: string) => {
  // get AccessToken using code
  const tokenResponse = await axios({
    method: "POST",
    url: "https://kauth.kakao.com/oauth/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: qs.stringify({
      grant_type: "authorization_code",
      client_id: config.kakao_ID,
      client_secret: config.kakao_password,
      redirect_uri: config.kakao_uri,
      code: code,
    }),
  });

  const token = tokenResponse.data.access_token;
  const kakaoUserInfo = await getKakaoUserInfo(token); // get KaKao User Info using token

  try {
    let existUser = await User.findOne({
      email: kakaoUserInfo.email,
      provider: "kakao",
    });

    if (!existUser) {
      const user = new User({
        email: kakaoUserInfo.email,
        provider: "kakao",
        nickname: kakaoUserInfo.nickname,
        profileUrl: kakaoUserInfo.profileUrl,
      });
      existUser = await user.save();
    }

    // create Token
    const accessToken = jwt.sign(existUser._id.toString(), existUser.nickname);
    const refreshToken = jwt.refresh();

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const refreshToken = async (old: refreshTokenRequest) => {
  const decodedAccessToken = jwt.verify(old.accessToken);
  const decodedRefrehToken = jwt.verify(old.refreshToken);

  if (
    decodedAccessToken.ok === false &&
    decodedAccessToken.message === "jwt expired"
  ) {
    // accessToken 만료된 경우
    if (decodedRefrehToken.ok === false) {
      // refresh도 만료 -> 재로그인
      return { status: 401, message: "No authorized" };
    } else {
      // refresh는 만료 X -> 새로운 access Token 발급
      const newAccessToken = jwt.sign(
        decodedRefrehToken.id,
        decodedRefrehToken.nickname
      );
      return {
        status: 200,
        accessToken: newAccessToken,
      };
    }
  } else {
    // accessToken 만료 안 됨
    return {
      status: 400,
      message: "Access Token is not expired",
    };
  }
};

export default {
  localLogin,
  kakaoLogin,
  refreshToken,
};
