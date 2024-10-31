import { StudyResultDTO } from "../interface/DTO/calendar/UpdateStudyResultDTO";
import Calendar from "../model/Calendar";
import StudyResult from "../model/StudyResult";
import mongoose, { Schema, Types, ObjectId } from "mongoose";

const createCalendar = async (userId: string) => {
  try {
    const date = new Date();
    const newCalendar = new Calendar({
      userId: new mongoose.Schema.Types.ObjectId(userId),
      year: date.getFullYear(),
      month: date.getMonth(),
    });
    await newCalendar.save();
    return newCalendar;
  } catch (error) {
    throw error;
  }
};

const getCalendar = async (userId: string, year: number, month: number) => {
  try {
    const user = new mongoose.Schema.Types.ObjectId(userId);
    const calendar = await Calendar.findOne({
      userId: user,
      year: year,
      month: month,
    });
    if (!calendar) {
      return null;
    }
    return calendar;
  } catch (error) {
    throw error;
  }
};

const getStudyResultByDay = async (
  userId: string,
  year: number,
  month: number,
  day: number
) => {
  try {
    const user = new mongoose.Schema.Types.ObjectId(userId);
    const calendar = await Calendar.findOne({
      userId: user,
      year: year,
      month: month,
    });
    if (!calendar) {
      return null;
    }
    const history = calendar.record.find((r) => r.day === day);
    if (!history) {
      return null;
    }
    return history.studyResult;
  } catch (error) {
    throw error;
  }
};

const updateStudyResult = async (
  userId: string,
  year: number,
  month: number,
  studyResult: StudyResultDTO
) => {
  try {
    const user = new mongoose.Schema.Types.ObjectId(userId);
    const newStudyResult = new StudyResult({
      userId: user,
      feedList: studyResult.feedList,
      totalTime: studyResult.totalTime,
      realTime: studyResult.realTime,
      advice: studyResult.advice,
    });
    await newStudyResult.save();

    let calendar = await Calendar.findOne({ userId, year, month });
    if (!calendar) {
      const newCalendar = new Calendar({
        userId,
        year,
        month,
      });
      await newCalendar.save();
      calendar = newCalendar;
    }

    const today = new Date().getDate();
    const existingRecord = calendar.record.find((r) => r.day === today);
    if (existingRecord) {
      existingRecord.studyResult.push(newStudyResult._id);
    } else {
      calendar.record.push({
        day: today,
        studyResult: [newStudyResult._id],
      });
    }

    calendar.dailyTime += studyResult.totalTime;
    calendar.weeklyTime += studyResult.totalTime;
    calendar.monthlyTime += studyResult.totalTime;

    await calendar.save();

    return calendar;
  } catch (error) {
    throw error;
  }
};

export default {
  createCalendar,
  getCalendar,
  getStudyResultByDay,
  updateStudyResult,
};
