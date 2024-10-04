import { Router } from "express";
import { authController } from "../controller";
import { body, query } from "express-validator";
import { authJWT } from "../middleware";

const router = Router();

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

router.get(
  "/kakao/oauth",
  [
    query("code")
      .isString()
      .withMessage("Authorization code is missing or invalid"),
  ],
  authController.kakaoLogin
);

router.get("/refresh", authController.refresh);

export default router;
