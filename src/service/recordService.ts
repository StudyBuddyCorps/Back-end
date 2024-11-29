import mongoose from "mongoose";
import StudyRecord from "../model/StudyRecord";
import redisClient from "../redis";
import makeResult from "../util/makeResult";

const createStudyRecord = async (_id: string) => {
  try {
    // 데이터 가공 및 studyRecordDB에 저장
    // 1. redisClient로 roomId에 해당하는 정보 모두 가져오기
    const roomData = await redisClient.hGetAll(_id);

    if (!roomData) {
      throw new Error("Room data not found in Redis");
    }

    // 2. StudyRecord에 필요한 데이터 가공 (feedList, totalTime, feedTime 등)
    const result = makeResult.getResultFeedBack(
      JSON.parse(roomData.feedbackList),
      Number(roomData.accumulatedTime)
    );

    const feedList = result.feedbackList;
    const feedTime = result.feedTime;
    const sleepCount = result.sleep_count;
    const phoneCount = result.phone_count;
    const postureCount = result.posture_count;
    const advice = makeResult.getAdvice(
      sleepCount,
      phoneCount,
      postureCount,
      Number(roomData.accumulatedTime),
      feedTime
    );

    //3. StudyRecord DB에 추가
    const newStudyRecord = new StudyRecord({
      feedList: feedList,
      createdAt: new Date(parseInt(roomData.createdAt)),
      totalTime: Number(roomData.accumulatedTime),
      feedTime: feedTime,
      advice: advice,
      sleepCount: sleepCount,
      phoneCount: phoneCount,
      postureCount: postureCount,
    });

    await newStudyRecord.save(); // DB에 저장

    return newStudyRecord;
  } catch (error) {
    console.error("Error while processing study result:", error);
    throw error;
  }
};

const getStudyRecord = async (studyRecordId: string) => {
  try {
    const record = await StudyRecord.findById(studyRecordId);

    if (!record) {
      return null;
    }

    return record;
  } catch (error) {
    throw error;
  }
};

export default {
  createStudyRecord,
  getStudyRecord,
};
