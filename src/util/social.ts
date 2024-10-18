import axios from "axios";

// 구글 사용자 정보 요청 함수
export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return {
      email: userInfo.data.email,
      nickname: userInfo.data.name,
      profileUrl: userInfo.data.picture,
    };
  } catch (error) {
    throw new Error("Failed to retrieve Kakao user info");
  }
};

// 카카오 사용자 정보 요청 함수
export const getKakaoUserInfo = async (accessToken: string) => {
  try {
    const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return {
      email: userInfo.data.kakao_account.email,
      nickname: userInfo.data.properties.nickname,
      profileUrl: userInfo.data.properties.profile_image,
    };
  } catch (error) {
    throw new Error("Failed to retrieve Kakao user info");
  }
};

export default {
  getGoogleUserInfo,
  getKakaoUserInfo,
};
