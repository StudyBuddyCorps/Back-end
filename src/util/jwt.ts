import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const sign = (userId: string, nickname: string) => {
  const payload = { id: userId as string, nickname: nickname as string };

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "2h" });
  return accessToken;
};

const verify = (token: string) => {
  try {
    let decoded: any = jwt.verify(token, config.jwtSecret);
    return {
      ok: true,
      decoded: decoded,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "jwt expired") {
        return {
          ok: false,
          type: -1,
          message: error.message,
        };
      } else if (error.message === "invalid token") {
        return {
          ok: false,
          type: -2,
          message: error.message,
        };
      } else {
        return {
          ok: false,
          type: -3,
          message: error.message,
        };
      }
    } else {
      console.log(error);
    }
  }
};

const refresh = () => {
  return jwt.sign({}, config.jwtSecret, { expiresIn: "14d" });
};

export default {
  sign,
  verify,
  refresh,
};
