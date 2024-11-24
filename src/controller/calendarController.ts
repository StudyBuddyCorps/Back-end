import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { calendarService } from "../service";
import {
  DateRecordRequest,
  DateRecordResponse,
} from "../interface/DTO/calendar/DateRecordDTO";
import {
  GetCalendarRequest,
  GetCalendarResponse,
} from "../interface/DTO/calendar/GetCalendarDTO";
import { UpdateStudyRecordRequest } from "../interface/DTO/calendar/UpdateStudyRecordDTO";

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

  const request: GetCalendarRequest = req.body;

  try {
    const response = await calendarService.getCalendar(
      request.userId,
      request.yearMonth
    );
    if (!response) {
      return res.status(400).json({ success: false, error: "달력 조회 실패" });
    }

    const data: GetCalendarResponse = {
      userId: response.userId,
      yearMonth: response.yearMonth,
      dateRecord: response.dateRecord.map((record) => ({
        date: record.date,
        studyRecords: record.studyRecords,
      })),
      goal: response.goal,
      monthlyTime: response.monthlyTime,
      weeklyTime: response.weeklyTime,
      dailyTime: response.dailyTime,
    };
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const getDateRecord = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  const request: DateRecordRequest = req.body;
  try {
    const response = await calendarService.getDateRecord(
      request.userId,
      request.yearMonth,
      request.date
    );
    if (!response) {
      // null인 경우
      return res.status(200).json({ success: false });
    }
    const data: DateRecordResponse = {
      total_time: response.totalTime,
      feed_time: response.feedTime,
      sleep_count: response.sleepCount,
      phone_count: response.phoneCount,
      posture_count: response.postureCount,
    };
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

const updateStudyRecord = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }

  const request: UpdateStudyRecordRequest = req.body;
  try {
    const response = await calendarService.updateStudyRecord(
      request.userId,
      request.yearMonth,
      request.studyRecordId,
      request.date
    );
    if (!response) {
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
  getDateRecord,
  updateStudyRecord,
};
