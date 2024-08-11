import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI as string, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("This is change!!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
