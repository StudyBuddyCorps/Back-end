import { Router } from "express";
import { calendarController } from "../controller";
import { body, param } from "express-validator";
import { authJWT } from "../middleware";

const router = Router();

router.post(
  "/",
  authJWT,
  [body("userId").notEmpty().withMessage("유저 아이디가 없습니다.")],
  calendarController.createCalendar
);

router.get(
  "/:yearMonth",
  authJWT,
  [param("yearMonth").notEmpty().withMessage("년도와 월이 없습니다.")],
  calendarController.getCalendar
);

router.get(
  "/dateRecord/:yearMonth/:date",
  authJWT,
  [
    param("yearMonth").notEmpty().withMessage("년도와 월이 없습니다."),
    param("date").notEmpty().withMessage("일이 없습니다."),
  ],
  calendarController.getDateRecord
);

router.get(
  "/getTodayTime/:yearMonth",
  authJWT,
  [param("yearMonth").notEmpty().withMessage("년도와 월이 없습니다.")],
  calendarController.getTodayTime
);

router.put(
  "/dateRecord",
  authJWT,
  [
    body("yearMonth")
      .notEmpty()
      .withMessage("년도와 월이 없습니다.")
      .isString()
      .withMessage("년도와 월은 문자열이어야 합니다."),
    body("studyRecordId").notEmpty().withMessage("studyRecordId가 없습니다."),
    body("date")
      .notEmpty()
      .withMessage("일이 없습니다.")
      .isInt({ min: 1, max: 31 })
      .withMessage("일은 1부터 31 사이의 정수를 입력해야 합니다.")
      .isNumeric()
      .withMessage("일이 숫자가 아닙니다."),
  ],
  calendarController.updateStudyRecord
);

router.put("/testRecord", calendarController.test);

export default router;
