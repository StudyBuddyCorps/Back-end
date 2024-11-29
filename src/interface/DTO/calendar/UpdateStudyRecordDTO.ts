import mongoose from "mongoose";

export interface UpdateStudyRecordRequest {
  yearMonth: string;
  studyRecordId: string;
  date: number;
}
