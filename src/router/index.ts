import { Router } from "express";
import userRouter from "./userRouter";
import groupRouter from "./groupRouter";
import authRouter from "./authRouter";
import calendarRouter from "./calendarRouter";
import studyRoomRouter from "./studyRoomRouter";
import recordRouter from "./recordRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/groups", groupRouter);
router.use("/auth", authRouter);
router.use("/calendar", calendarRouter);
router.use("/studyroom", studyRoomRouter);
router.use("/record", recordRouter);

export default router;
