import { Router } from "express";
import userRouter from "./userRouter";
import groupRouter from "./groupRouter"

const router = Router();

router.use("/users", userRouter);
router.use("/groups", groupRouter);

export default router;
