import { Router } from "express";
import { authController } from "../controller";
import { body, query, header, cookie } from "express-validator";
import { google } from "googleapis";
import config from "../config";

const router = Router();
const googleOauth = new google.auth.OAuth2(
  config.google_ID,
  config.google_password,
  config.google_uri
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("email이 존재하지 않습니다.")
      .bail()
      .isEmail()
      .withMessage("email 형식이 맞지 않습니다."),
    body("password").notEmpty().withMessage("password가 존재하지 않습니다."),
  ],
  authController.login
); // local Login

router.get("/oauth/google", async (req, res) => {
  const authorizationUrl = googleOauth.generateAuthUrl({
    // Google Login 화면 요청 URL
    response_type: "code",
    scope: ["email", "profile"],
  });
  res.json({ url: authorizationUrl });
});

router.get("/oauth/kakao", async (req, res) => {
  // Kakao 로그인 요청 화면 URL
  const kakaoOauthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${config.kakao_ID}&redirect_uri=${config.kakao_uri}&response_type=code`;

  res.json({ url: kakaoOauthUrl });
});

router.get(
  "/google/callback",
  [
    query("code")
      .exists()
      .withMessage("Authorization code is missing or invalid"),
  ],
  authController.googleLogin
);

router.get(
  "/kakao/callback",
  [
    query("code")
      .exists()
      .withMessage("Authorization code is missing or invalid"),
  ],
  authController.kakaoLogin
);
router.get(
  "/getNewToken",
  [
    // Header에서 accessToken 확인
    header("authorization")
      .exists()
      .withMessage("Authorization header is missing")
      .bail()
      .custom((value, { req }) => {
        if (!value.startsWith("Bearer ")) {
          throw new Error(
            "Invalid authorization format. Expected Bearer token"
          );
        }
        return true;
      }),

    // Cookie에서 refreshToken 확인
    cookie("refreshToken").notEmpty().withMessage("Refresh token is empty"),
  ],
  authController.getNewToken
);

router.get(
  "/logout",
  [
    cookie("refreshToken")
      .exists()
      .withMessage("Refresh token is missing in cookies")
      .notEmpty()
      .withMessage("Refresh token is empty"),
  ],
  authController.logout
);

export default router;
