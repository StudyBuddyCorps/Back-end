import jwtHandler from "../util/jwt";
import { Request, Response, NextFunction } from "express";
import { userService } from "../service";

const authJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers.authorization) {
      const accessToken = req.headers.authorization.split("Bearer ")[1];
      if (!accessToken)
        return res
          .status(401)
          .json({ status: 401, message: "No token provided" });

      const decodedToken = jwtHandler.verify(accessToken);
      if (decodedToken.ok) {
        const userId: string = decodedToken.id;
        const existingUser = await userService.getUserByID(userId);
        if (!existingUser)
          return res
            .status(401)
            .json({ status: 401, message: "User not found" });

        req.body.userId = existingUser.id;
        next();
      } else {
        res.status(401).json({
          status: 401,
          message: decodedToken.message,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 500, message: "Internal Server error" });
  }
};

export default authJWT;
