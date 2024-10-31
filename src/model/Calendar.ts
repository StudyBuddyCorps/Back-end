import mongoose, { Schema } from "mongoose";

const CalendarSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  record: [
    {
      day: { type: Number, required: true },
      studyResult: [
        { type: mongoose.Schema.Types.ObjectId, ref: "StudyResult" },
      ],
    },
  ],
  monthlyTime: { type: Number, default: 0 }, // 이번 달 누적 공부 시간
  weeklyTime: { type: Number, default: 0 }, // 이번 주 누적 공부 시간
  dailyTime: { type: Number, default: 0 }, // 오늘 누적 공부 시간
});

export default mongoose.model("Calendar", CalendarSchema);
