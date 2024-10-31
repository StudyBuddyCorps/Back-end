import { Request, Response } from 'express';
import { recordService } from '../service/recordService';

export const recordController = {
  async getStudyRecords(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const records = await recordService.getStudyRecords(userId);
      res.status(200).json(records);
    } catch (error) {
      res.status(500).json({ message: '공부 기록을 가져오는데 실패했습니다.' });
    }
  },

  async getStudyRecordById(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const recordId = req.params.recordId;
      const record = await recordService.getStudyRecordById(userId, recordId);
      if (!record) {
        return res.status(404).json({ message: '공부 기록을 찾을 수 없습니다.' });
      }
      res.status(200).json(record);
    } catch (error) {
      res.status(500).json({ message: '공부 기록을 가져오는데 실패했습니다.' });
    }
  }
};
