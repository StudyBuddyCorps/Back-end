import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { calendarService } from "../service";
import { DateRecordResponse } from "../interface/DTO/calendar/DateRecordDTO";
import { GetCalendarResponse } from "../interface/DTO/calendar/GetCalendarDTO";
import { UpdateStudyRecordRequest } from "../interface/DTO/calendar/UpdateStudyRecordDTO";

const createCalendar = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }
  const userId = req.userId;
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

  const userId = req.userId;
  const { yearMonth } = req.params;

  try {
    const response = await calendarService.getCalendar(userId, yearMonth);
    if (!response) {
      return res.status(400).json({ success: false, error: "달력 조회 실패" });
    }

    const data: GetCalendarResponse = {
      userId: response.userId,
      yearMonth: response.yearMonth,
      dateRecord: response.dateRecord.map((record) => ({
        date: record.date,
        studyRecords: record.studyRecords,
        totalTime: record.totalTime,
        feedTime: record.feedTime,
        sleepCount: record.sleepCount,
        phoneCount: record.phoneCount,
        postureCount: record.postureCount,
        totalAdvice: record.totalAdvice,
      })),
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

  const userId = req.userId;
  const { yearMonth, date } = req.params;
  try {
    const response = await calendarService.getDateRecord(
      userId,
      yearMonth,
      Number(date)
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

const getTodayTime = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationErrorMsg = error["errors"][0].msg;
    return res.status(400).json({ error: validationErrorMsg });
  }
  const userId = req.userId;
  const date = new Date().getDate();
  const { yearMonth } = req.params;

  try {
    const response = await calendarService.getTodayTime(
      userId,
      yearMonth,
      date
    );
    if (!response) {
      return res.status(200).json({ success: true, data: 0 });
    }

    return res.status(200).json({ success: true, data: response });
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

  const userId = req.userId;
  const request: UpdateStudyRecordRequest = req.body;
  try {
    const response = await calendarService.updateStudyRecord(
      userId,
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

const test = async (req: Request, res: Response) => {
  const userId = "671285fd22a4d3e2b1aac6f3";
  const request = req.body;
  try {
    const response = await calendarService.testStudyRecord(
      userId,
      request.yearMonth,
      request.date,
      request.s,
      request.ph,
      request.p,
      request.t,
      request.f
    );
    if (!response) {
      return res
        .status(400)
        .json({ success: false, error: "공부 기록 생성 실패" });
    }
    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

export default {
  createCalendar,
  getCalendar,
  getDateRecord,
  getTodayTime,
  updateStudyRecord,
  test,
};
