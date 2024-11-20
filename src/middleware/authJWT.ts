import jwtHandler from "../util/jwt";
import { Request, Response, NextFunction } from "express";
import { userService } from "../service";
import mongoose from "mongoose";

const authJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split("Bearer ")[1];
      if (!accessToken)
        return res
          .status(401)
          .json({ status: 401, message: "No token provided" });

      const decodedToken = jwtHandler.verify(accessToken);
      if (decodedToken?.ok) {
        const userId = new mongoose.Types.ObjectId(decodedToken.decoded.id);
        const existingUser = await userService.getUserByID(userId);
        if (!existingUser)
          return res
            .status(401)
            .json({ status: 401, message: "User not found in authJWT" });

        req.body.userId = existingUser._id;
        next();
      } else {
        res.status(401).json({
          status: 401,
          message: decodedToken?.message,
        });
      }
    }
  } catch (error) {
    console.error("JWT 인증 오류:", error);
    res.status(500).json({ status: 500, message: "Internal Server error" });
  }
};

export default authJWT;
