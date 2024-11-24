import mongoose from "mongoose";

export interface UpdateStudyRecordRequest {
  userId: mongoose.Types.ObjectId;
  yearMonth: string;
  studyRecordId: mongoose.Types.ObjectId;
  date: number;
}
