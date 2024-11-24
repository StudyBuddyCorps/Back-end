import mongoose, { Schema } from "mongoose";

const StudyRecordSchema = new Schema({
  feedList: [
    {
      feedType: {
        type: String,
        enum: ["bad_posture", "is_sleeping", "is_holding_phone"],
        required: true,
      }, // 피드백 종류 enum으로 정의
      start: { type: Number, required: true },
      end: { type: Number, required: true },
      time: { type: String, required: true },
    },
  ],
  createdAt: { type: Date },
  totalTime: { type: Number, required: true },
  feedTime: { type: Number, required: true },
  advice: { type: String, default: "" }, // 개선할 점
  sleepCount: { type: Number, default: 0 },
  phoneCount: { type: Number, default: 0 },
  postureCount: { type: Number, default: 0 },
});

export default mongoose.model("StudyRecord", StudyRecordSchema);
