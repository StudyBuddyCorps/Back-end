import { Router } from "express";
import userRouter from "./userRouter";
import groupRouter from "./groupRouter"
import authRouter from "./authRouter";
import studyRoomRouter from "./studyRoomRouter";
import RecordRouter from "./recordRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/groups", groupRouter);
router.use("/auth", authRouter);
router.use("/studyroom", studyRoomRouter);
router.use("/record", RecordRouter);

export default router;
