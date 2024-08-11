import { Router } from "express";
import { userController } from "../controller";

const router = Router();

router.use("/signup", userController.signUp);

export default router;
