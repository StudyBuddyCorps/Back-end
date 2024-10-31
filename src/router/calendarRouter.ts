import { Router } from "express";
import { calendarController } from "../controller";
import { body } from "express-validator";

const router = Router();

router.post(
  "/",
  [body("userId").notEmpty().withMessage("유저 아이디가 없습니다.")],
  calendarController.createCalendar
);

router.get(
  "/",
  [
    body("userId").notEmpty().withMessage("유저 아이디가 없습니다."),
    body("year")
      .notEmpty()
      .withMessage("년도가 없습니다.")
      .isNumeric()
      .withMessage("년도가 숫자가 아닙니다."),
    body("month")
      .notEmpty()
      .withMessage("월이 없습니다.")
      .isNumeric()
      .withMessage("월이 숫자가 아닙니다."),
  ],
  calendarController.getCalendar
);

router.get(
  "/studyResult",
  [
    body("userId").notEmpty().withMessage("유저 아이디가 없습니다."),
    body("year")
      .notEmpty()
      .withMessage("년도가 없습니다.")
      .isInt()
      .withMessage("년도는 정수로 입력해야 합니다."),
    body("month")
      .notEmpty()
      .withMessage("월이 없습니다.")
      .isInt({ min: 1, max: 12 })
      .isNumeric()
      .withMessage("월은 1부터 12 사이의 정수를 입력해야 합니다.")
      .withMessage("월이 숫자가 아닙니다."),
    body("day")
      .notEmpty()
      .withMessage("일이 없습니다.")
      .isInt({ min: 1, max: 31 })
      .withMessage("일은 1부터 31 사이의 정수를 입력해야 합니다.")
      .isNumeric()
      .withMessage("일이 숫자가 아닙니다."),
  ],
  calendarController.getStudyResultByDay
);

router.put(
  "/studyResult",
  [
    body("userId").notEmpty().withMessage("유저 아이디가 없습니다."),
    body("year")
      .notEmpty()
      .withMessage("년도가 없습니다.")
      .isNumeric()
      .withMessage("년도가 숫자가 아닙니다."),
    body("month")
      .notEmpty()
      .withMessage("월이 없습니다.")
      .isNumeric()
      .withMessage("월이 숫자가 아닙니다."),
    body("data").notEmpty().withMessage("공부 기록 결과가 존재하지 않습니다."),
  ],
  calendarController.updateStudyResult
);

export default router;
