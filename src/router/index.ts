import { Router } from "express";
import userRouter from "./userRouter";
import groupRouter from "./groupRouter"
import authRouter from "./authRouter";

const router = Router();

router.use("/users", userRouter);
router.use("/groups", groupRouter);
router.use("/auth", authRouter);

export default router;
