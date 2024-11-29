import User from "../model/User";
import { LoginLocalRequest } from "../interface/DTO/auth/LoginDTO";
import bcrypt from "bcrypt";
import axios from "axios";
import qs from "qs";
import config from "../config";
import { getGoogleUserInfo, getKakaoUserInfo } from "../util/social";
import jwt from "../util/jwt";

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

    // create Token and save
    const accessToken = jwt.sign(user._id.toString(), user.nickname);
    const refreshToken = jwt.refresh();
    user.refreshToken = refreshToken;
    await user.save();

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

    const refreshToken = jwt.refresh();

    if (!existUser) {
      // 유저가 존재하지 않는 경우
      const user = new User({
        email: kakaoUserInfo.email,
        provider: "kakao",
        nickname: kakaoUserInfo.nickname,
        profileUrl: kakaoUserInfo.profileUrl,
        refreshToken: refreshToken,
      });
      existUser = await user.save();
    } else {
      // 유저가 존재하는 경우
      existUser.refreshToken = refreshToken;
      await existUser.save();
    }

    // create Token
    const accessToken = jwt.sign(existUser._id.toString(), existUser.nickname);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const googleLogin = async (code: string) => {
  // get AccessToken using code
  const tokenResponse = await axios({
    method: "POST",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    data: qs.stringify({
      grant_type: "authorization_code",
      client_id: config.google_ID,
      client_secret: config.google_password,
      redirect_uri: config.google_uri,
      code: code,
    }),
  });

  const token = tokenResponse.data.access_token;
  const userInfo = await getGoogleUserInfo(token); // get KaKao User Info using token

  try {
    let existUser = await User.findOne({
      email: userInfo.email,
      provider: "google",
    });

    const refreshToken = jwt.refresh();
    if (!existUser) {
      const user = new User({
        email: userInfo.email,
        provider: "google",
        nickname: userInfo.nickname,
        profileUrl: userInfo.profileUrl,
        refreshToken: refreshToken,
      });
      existUser = await user.save();
    } else {
      // 유저가 존재하는 경우
      existUser.refreshToken = refreshToken;
      await existUser.save();
    }

    // create Token
    const accessToken = jwt.sign(existUser._id.toString(), existUser.nickname);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw error;
  }


};

const getUserByRefresh = async (refreshToken: string) => {
  try {
    return await User.findOne({ refreshToken });
  } catch (error) {
    console.error("Failed to find user by refresh token:", error);
    throw error;
  }
};

export default {
  localLogin,
  kakaoLogin,
  googleLogin,
  getUserByRefresh,
};
