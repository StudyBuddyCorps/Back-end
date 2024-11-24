import mongoose from "mongoose";

export interface DateRecord {
  date: number;
  studyRecords: mongoose.Types.ObjectId[];
}

export interface GetCalendarRequest {
  userId: mongoose.Types.ObjectId;
  yearMonth: string;
}

export interface GetCalendarResponse {
  userId: mongoose.Types.ObjectId;
  yearMonth: string;
  dateRecord: DateRecord[];
  goal: number;
  monthlyTime: number;
  weeklyTime: number;
  dailyTime: number;
}
