import mongoose from "mongoose";

export interface CreateStudyRecordRequest {
  userId: mongoose.Types.ObjectId;
  roomId: string;
}

export interface CreateStudyRecordResponse {}
