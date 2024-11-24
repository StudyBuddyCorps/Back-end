import mongoose from "mongoose";

export interface DateRecordRequest {
  userId: mongoose.Types.ObjectId;
  yearMonth: string;
  date: number;
}

export interface DateRecordResponse {
  total_time: Number;
  feed_time: Number;
  sleep_count: Number;
  phone_count: Number;
  posture_count: Number;
}
