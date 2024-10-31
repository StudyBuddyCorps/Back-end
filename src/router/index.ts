import { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import calendarRouter from "./calendarRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/calendar", calendarRouter);

export default router;
