import mongoose, { Schema } from "mongoose";

const CalendarSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  yearMonth: { type: String, required: true },
  dateRecord: [
    {
      date: { type: Number, required: true },
      studyRecords: [
        { type: mongoose.Schema.Types.ObjectId, ref: "StudyRecord" },
      ],
      totalTime: { type: Number, required: true },
      feedTime: { type: Number, required: true },
      sleepCount: { type: Number, default: 0 },
      phoneCount: { type: Number, default: 0 },
      postureCount: { type: Number, default: 0 },
      totalAdvice: { type: String, default: "" },
    },
  ],
  monthlyTime: { type: Number, default: 0 }, // 이번 달 누적 공부 시간
  weeklyTime: { type: Number, default: 0 }, // 이번 주 누적 공부 시간
  dailyTime: { type: Number, default: 0 }, // 오늘 누적 공부 시간,
});

export default mongoose.model("Calendar", CalendarSchema);
