import User from "../model/User";
import redisClient from "../redis";
import { wss } from "../index";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// 공부방 생성
const createStudyRoom = async (
  userId: string,
  roomType: string,
  studyMate: any,
  assistantTone: string,
  cameraAccess: boolean
) => {
  const _id = uuidv4();
  const roomData = {
    _id: _id,
    userId: userId,
    roomType: roomType,
    studyMate: JSON.stringify(studyMate),
    assistantTone: assistantTone,
    cameraAccess: cameraAccess.toString(),
    accumulatedTime: "0",
    status: "pending",
    createdAt: "0",
    feedbackList: JSON.stringify([]),
  };

  await redisClient.hSet(_id, roomData);

  return { ...roomData };
};

// 공부방 시작
const startStudyRoom = async (userId: string, _id: string) => {
  const room = await redisClient.hGetAll(_id);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  await redisClient.hSet(_id, {
    status: "active",
    createdAt: new Date().getTime(),
  });

  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "roomStarted",
        _id,
        message: "Study room has started.",
      })
    );
  });

  return { message: "공부방 시작됨", _id };
};

// 공부방 일시정지 및 재개
const pauseStudyRoom = async (
  userId: string,
  _id: string,
  accumulatedTime: number
) => {
  const room = await redisClient.hGetAll(_id);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  if (room.status === "active") {
    await redisClient.hSet(_id, {
      status: "paused",
      accumulatedTime: accumulatedTime.toString(),
    });
  } else if (room.status === "paused") {
    await redisClient.hSet(_id, { status: "active" });
  }

  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "roomPaused",
        _id,
        status: room.status === "active" ? "paused" : "active",
      })
    );
  });

  return {
    _id,
    status: room.status === "active" ? "paused" : "active",
    accumulatedTime,
  };
};

// 공부방 종료
const stopStudyRoom = async (
  userId: string,
  _id: string,
  accumulatedTime: number
) => {
  const room = await redisClient.hGetAll(_id);

  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  await redisClient.hSet(_id, {
    accumulatedTime: accumulatedTime.toString(),
    status: "stopped",
  });
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "roomStopped",
        roomId: _id,
        message: "Study room has been stopped.",
        accumulatedTime,
      })
    );
  });

  // Redis에서 방 정보 삭제
  // await redisClient.del(roomId);

  return { accumulatedTime };
};

// 디폴트 공부방 설정 저장
const setDefaultStudyRoom = async (userId: string, roomSettings: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("사용자를 찾을 수 없습니다.");

  user.defaultSettings = {
    roomType: roomSettings.roomType,
    studyMate: roomSettings.studyMate,
    assistantTone: roomSettings.assistantTone,
    cameraAccess: roomSettings.cameraAccess,
  };
  await user.save();

  return user.defaultSettings;
};

// 디폴트 공부방 시작
const startDefaultStudyRoom = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.defaultSettings) {
    throw new Error("디폴트 공부방 설정이 없습니다.");
  }

  const defaultSettings = user.defaultSettings;

  const newRoom = await createStudyRoom(
    userId,
    defaultSettings.roomType,
    defaultSettings.studyMate,
    defaultSettings.assistantTone,
    defaultSettings.cameraAccess
  );

  const startedRoom = await startStudyRoom(userId, newRoom._id);

  return {
    message: "디폴트 공부방이 성공적으로 시작되었습니다.",
    room: startedRoom,
  };
};

// 공부방 정보 조회
const getStudyRoomInfo = async (userId: string, _id: string) => {
  // Redis에서 방 정보 조회
  const room = await redisClient.hGetAll(_id);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  return {
    _id,
    userId: room.userId,
    roomType: room.roomType,
    studyMate: JSON.parse(room.studyMate),
    assistantTone: room.assistantTone,
    cameraAccess: room.cameraAccess === "true",
    accumulatedTime: parseInt(room.accumulatedTime || "0", 10),
    status: room.status,
    feedbackList: JSON.parse(room.feedbackList || "[]"),
  };
};

const updateFeedback = async (
  _id: string,
  feedbackType: string[],
  time: string | number
) => {
  const room = await redisClient.hGetAll(_id);
  if (!_id) throw new Error("공부방이 없음~");

  const feedbackList = room.feedbackList ? JSON.parse(room.feedbackList) : [];
  if (!Array.isArray(feedbackList))
    throw new Error("피드백 리스트 데이터가 손상되었습니다.");
  feedbackList.push({ feedType: feedbackType, time });

  await redisClient.hSet(_id, { feedbackList: JSON.stringify(feedbackList) });

  return { message: "피드백이 성공적으로 업데이트되었습니다.", feedbackList };
};

// // 뽀모도로 세션 관리
// const managePomodoro = async (userId: string, roomId: string, action: string) => {
//   const room = await StudyRoomModel.findOne({ _id: roomId, userId });
//   if (!room) throw new Error('공부방을 찾을 수 없습니다.');

//   const now = new Date();

//   if (action === 'start') {
//     room.status = 'pomodoro_study';
//     room.startTime = now;
//     room.accumulatedTime = 0;
//   } else if (action === 'break') {
//     if (room.status !== 'pomodoro_study') {
//       throw new Error('공부 중이 아니므로 휴식으로 전환할 수 없습니다.');
//     }
//     room.status = 'pomodoro_break';
//     const studyDuration = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
//     room.accumulatedTime += studyDuration;
//     room.startTime = now;
//   } else if (action === 'stop') {
//     const totalDuration = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
//     room.accumulatedTime += totalDuration;
//     room.status = 'stopped';
//   }

//   await room.save();
//   return room;
// };

// // 뽀모도로 진행 상태 조회
// const getPomodoroStatus = async (userId: string, roomId: string) => {
//   const room = await StudyRoomModel.findOne({ _id: roomId, userId });
//   if (!room) throw new Error('공부방을 찾을 수 없습니다.');

//   const now = new Date();
//   const elapsedTime = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
//   let statusMessage = '';

//   if (room.status === 'pomodoro_study') {
//     const remainingStudyTime = 1500 - elapsedTime;
//     statusMessage = `공부 중, 남은 시간: ${remainingStudyTime}초`;
//   } else if (room.status === 'pomodoro_break') {
//     const remainingBreakTime = 300 - elapsedTime;
//     statusMessage = `휴식 중, 남은 시간: ${remainingBreakTime}초`;
//   } else {
//     statusMessage = '세션이 종료되었습니다.';
//   }

//   return { status: room.status, statusMessage };
// };

export default {
  createStudyRoom,
  startStudyRoom,
  pauseStudyRoom,
  stopStudyRoom,
  setDefaultStudyRoom,
  startDefaultStudyRoom,
  getStudyRoomInfo,
  updateFeedback,
  // managePomodoro,
  // getPomodoroStatus,
};
