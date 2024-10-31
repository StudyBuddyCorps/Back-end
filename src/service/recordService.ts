import { StudyRecordModel } from '../model/Record';
import mongoose from 'mongoose';

export const recordService = {
  async getStudyRecords(userId: string) {
    const records = await StudyRecordModel.find({ userId }).sort({ date: -1 });
    return records;
  },

  async getStudyRecordById(userId: string, recordId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(recordId);
      const record = await StudyRecordModel.findOne({ _id: objectId, userId });
      return record;
    } catch (error) {
      throw new Error('유효하지 않은 기록 ID입니다.');
    }
  }
};
