import express, { Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config";
import router from "./router";

const app = express();
const port = config.port || 3000;

mongoose
  .connect(config.database, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("This is change!!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
