const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect("mongodb://mongo:27017/studyBuddy", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("This is Node.js & express.js Server with MongoDB!!!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
