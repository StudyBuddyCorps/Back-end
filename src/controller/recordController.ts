import { Request, Response } from "express";
import { recordService } from "../service";
import { validationResult } from "express-validator";
import { CreateStudyRecordRequest } from "../interface/DTO/record/CreateStudyRecord";

// final 페이지에 필요한 결과
const createStudyRecord = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const validationErrorMsg = error["errors"][0].msg;
      return res.status(400).json({ error: validationErrorMsg });
    }
    const request: CreateStudyRecordRequest = req.body;
    const result = await recordService.createStudyRecord(request.roomId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "결과를 가져오는데 실패하였습니다." });
  }
};

export default {
  createStudyRecord,
};
