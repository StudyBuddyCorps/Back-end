import express from "express";
import mongoose from "mongoose";
import config from "./config";
import router from "./router";
import cors from "cors";
import cookieParser from "cookie-parser";
import redisClient from "./redis";
import { WebSocketServer } from "ws";
import { createServer } from "http";

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

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  ws.on("message", (message) => {
    console.log("Received message:", message.toString());
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

export { wss };