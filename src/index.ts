import express from "express";
import mongoose from "mongoose";
import config from "./config";
import router from "./router";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = config.port || 8080;

// Connect DB
mongoose
  .connect(config.database)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 도메인
    credentials: true, // 쿠키 전달 허용
  })
);
app.use(router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
