import { Router } from "express";
import authJWT from "../middleware/authJWT";
import { recordController } from "../controller";
import { body } from "express-validator";

const router = Router();

router.post(
  "/final",
  authJWT,
  [
    body("roomId")
      .notEmpty()
      .withMessage("roomId가 없습니다.")
      .isString()
      .withMessage("roomId는 문자열이어야 합니다."),
  ],
  recordController.createStudyRecord
);

export default router;
