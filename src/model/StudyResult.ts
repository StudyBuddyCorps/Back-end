import mongoose, { Schema } from "mongoose";

const StudyResultSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  feedList: [
    {
      content: { type: String, required: true },
      createdAt: { type: Date, required: true },
    },
  ],
  totalTime: { type: Number, required: true },
  realTime: { type: Number, required: true },
  advice: { type: String },
});

export default mongoose.model("StudyResult", StudyResultSchema);
