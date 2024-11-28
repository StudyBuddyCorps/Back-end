import mongoose from "mongoose";

export interface DateRecord {
  date: number;
  studyRecords: mongoose.Types.ObjectId[];
  totalTime: number;
  feedTime: number;
  sleepCount: number;
  phoneCount: number;
  postureCount: number;
}
export interface GetCalendarResponse {
  userId: mongoose.Types.ObjectId;
  yearMonth: string;
  dateRecord: DateRecord[];
  monthlyTime: number;
  weeklyTime: number;
  dailyTime: number;
}
