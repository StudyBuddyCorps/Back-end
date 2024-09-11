import { Router } from "express";
import { userController } from "../controller";

const router = Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.getUser);

export default router;
