import axios from "axios";

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
  getKakaoUserInfo,
};
