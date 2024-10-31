import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { GetCalendarRequest } from "../interface/DTO/calendar/GetCalendarDTO";
import { calendarService } from "../service";
import { UpdateStudyResultRequest } from "../interface/DTO/calendar/UpdateStudyResultDTO";

const createCalendar = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }
  const userId = req.body.userId;
  try {
    const data = await calendarService.createCalendar(userId);
    if (!data) {
      return res.status(400).json({ success: false, error: "달력 생성 실패" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getCalendar = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  const calendar: GetCalendarRequest = req.body;

  try {
    const data = await calendarService.getCalendar(
      calendar.userId,
      calendar.year,
      calendar.month
    );
    if (!data) {
      return res.status(400).json({ success: false, error: "달력 조회 실패" });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getStudyResultByDay = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  const calendar: GetCalendarRequest = req.body;
  try {
    const data = await calendarService.getStudyResultByDay(
      calendar.userId,
      calendar.year,
      calendar.month,
      calendar.day!
    );
    if (!data) {
      return res
        .status(400)
        .json({ success: false, error: "공부 기록 조회 실패" });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const updateStudyResult = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  const studyResult: UpdateStudyResultRequest = req.body;
  try {
    const data = await calendarService.updateStudyResult(
      studyResult.userId,
      studyResult.year,
      studyResult.month,
      studyResult.data
    );
    if (!data) {
      return res
        .status(400)
        .json({ success: false, error: "공부 기록 생성 실패" });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export default {
  createCalendar,
  getCalendar,
  getStudyResultByDay,
  updateStudyResult,
};
