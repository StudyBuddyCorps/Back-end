import { Router } from "express";
import { userController } from "../controller";
import { body } from "express-validator";

const router = Router();

router.post(
  "/signup",
  [
    body("email")
      .notEmpty()
      .withMessage("email이 존재하지 않습니다.")
      .bail()
      .isEmail()
      .withMessage("email 형식이 맞지 않습니다."),
    body("nickname")
      .notEmpty()
      .withMessage("nickname이 존재하지 않습니다.")
      .bail()
      .isLength({ min: 2, max: 12 })
      .withMessage("nickname은 2자 이상 12자 이하여야 합니다."),
    body("password")
      .notEmpty()
      .withMessage("password가 존재하지 않습니다.")
      .bail()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password는 반드시 8자 이상 25자 이하여야 합니다.")
      .bail()
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,25}$/)
      .withMessage(
        "Password는 반드시 적어도 1개 이상의 영문자, 숫자, 특수 문자를 포함해야 합니다."
      ),
    body("comparePassword")
      .notEmpty()
      .withMessage("Compare Password가 존재하지 않습니다.")
      .bail()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password와 Compare Password가 일치하지 않습니다.");
        }
        return true;
      }),
  ],
  userController.signUp
);

//router.get('/profile', authJWT, authController.editProfile);
router.get("/:userId", userController.getUserById);

export default router;
