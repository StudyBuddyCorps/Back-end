import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const sign = (userId: string, nickname: string) => {
  const payload = { id: userId as string, nickname: nickname as string };

  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "2h" });
  return accessToken;
};

const verify = (accessToken: string) => {
  try {
    let decoded: any = jwt.verify(accessToken, config.jwtSecret);
    return {
      ok: true,
      id: decoded.id,
      nickname: decoded.nickname,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
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
