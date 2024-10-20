import dotenv from "dotenv";

dotenv.config();

export default {
  port: parseInt(process.env.PORT as string, 10) as number,
  database: process.env.DATABASE_URI as string,
  jwtSecret: process.env.SECRET_KEY as string,

  // kakao
  kakao_ID: process.env.KAKAO_CLIENT_ID as string,
  kakao_password: process.env.KAKAO_CLIENT_PASSWORD as string,
  kakao_uri: process.env.KAKAO_REDIRECT_URI as string,

  // google
  google_ID: process.env.GOOGLE_CLIENT_ID as string,
  google_password: process.env.GOOGLE_CLIENT_PASSWORD as string,
  google_uri: process.env.GOOGLE_REDIRECT_URI as string,
};
