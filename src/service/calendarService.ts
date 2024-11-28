import Calendar from "../model/Calendar";
import mongoose from "mongoose";
import recordService from "./recordService";
import { ObjectId } from "mongodb";

const createCalendar = async (userId: mongoose.Types.ObjectId) => {
  try {
    const date = new Date();
    const yearMonth = date.toISOString().slice(0, 7); // YYYY-MM 형식으로 변환

    const newCalendar = new Calendar({
      userId: userId,
      yearMonth: yearMonth,
      dateRecord: [], // 빈 배열로 초기화
      monthlyTime: 0,
      weeklyTime: 0,
      dailyTime: 0,
    });
    await newCalendar.save();
    return newCalendar;
  } catch (error) {
    throw error;
  }
};

const getCalendar = async (
  userId: mongoose.Types.ObjectId,
  yearMonth: string
) => {
  try {
    const calendar = await Calendar.findOne({
      userId: userId,
      yearMonth: yearMonth,
    });

    if (!calendar) {
      return null;
    }

    return calendar;
  } catch (error) {
    throw error;
  }
};

const getDateRecord = async (
  userId: mongoose.Types.ObjectId,
  yearMonth: string,
  date: number
) => {
  try {
    // 해당 년월의 달력 찾기
    const calendar = await Calendar.findOne({
      userId: userId,
      yearMonth: yearMonth,
    });

    if (!calendar) {
      return null;
    }

    // 같은 date record 찾기
    const todayRecord = calendar.dateRecord.find(
      (record) => record.date === date
    );

    if (!todayRecord) {
      return null;
    }

    return todayRecord;
  } catch (error) {
    console.error("Error fetching study records:", error);
    throw error;
  }
};

const updateStudyRecord = async (
  userId: mongoose.Types.ObjectId,
  yearMonth: string,
  studyRecordId: string,
  date: number
) => {
  try {
    // 0. 해당 studyRecord 체크
    const studyRecord = await recordService.getStudyRecord(studyRecordId);
    if (!studyRecord) {
      console.log("해당 공부 기록이 존재하지 않습니다.");
      return null;
    }

    // 1. 년월 존재 확인
    let calendar = await Calendar.findOne({ userId, yearMonth });
    if (!calendar) {
      calendar = await createCalendar(userId); // 없으면 새로 생성
    }

    // 2. 날짜 존재 확인
    const existingRecord = calendar.dateRecord.find(
      (record) => record.date === date
    );
    if (existingRecord) {
      // 존재한다면
      existingRecord.studyRecords.push(userId); // 공부 아이디 추가
      // 해당 날짜의 총 데이터 추가
      existingRecord.totalTime += studyRecord.totalTime;
      existingRecord.feedTime += studyRecord.feedTime;
      existingRecord.sleepCount += studyRecord.sleepCount;
      existingRecord.phoneCount += studyRecord.phoneCount;
      existingRecord.postureCount += studyRecord.postureCount;
    } else {
      // 없다면 해당 날짜 추가
      calendar.dateRecord.push({
        date: date,
        studyRecords: [studyRecordId],
        // 해당 날짜의 총 데이터 추가
        totalTime: studyRecord.totalTime,
        feedTime: studyRecord.feedTime,
        sleepCount: studyRecord.sleepCount,
        phoneCount: studyRecord.phoneCount,
        postureCount: studyRecord.postureCount,
      });
    }

    // 달력에 보여질 시간
    calendar.dailyTime += studyRecord.totalTime;
    calendar.weeklyTime += studyRecord.totalTime;
    calendar.monthlyTime += studyRecord.totalTime;

    await calendar.save();

    return calendar;
  } catch (error) {
    throw error;
  }
};

const testStudyRecord = async (
  userId: string,
  yearMonth: string,
  date: number,
  s: number,
  ph: number,
  p: number,
  t: number,
  f: number
) => {
  try {
    // 1. 년월 존재 확인
    let calendar = await Calendar.findOne({ userId, yearMonth });
    if (!calendar) {
      calendar = await createCalendar(new ObjectId(userId)); // 없으면 새로 생성
    }

    // 2. 날짜 존재 확인
    const existingRecord = calendar.dateRecord.find(
      (record) => record.date === date
    );
    if (existingRecord) {
      // 존재한다면
    } else {
      // 없다면 해당 날짜 추가
      calendar.dateRecord.push({
        date: date,
        studyResult: [new ObjectId()],
        // 해당 날짜의 총 데이터 추가
        totalTime: t,
        feedTime: f,
        sleepCount: s,
        phoneCount: ph,
        postureCount: p,
      });
    }

    // 달력에 보여질 시간
    calendar.monthlyTime += t;

    await calendar.save();

    return calendar;
  } catch (error) {
    throw error;
  }
};

export default {
  createCalendar,
  getCalendar,
  getDateRecord,
  updateStudyRecord,
  testStudyRecord,
};
