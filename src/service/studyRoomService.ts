import User from "../model/User";
import { StudyRecordModel } from '../model/Record';
import mongoose from 'mongoose';
import redisClient from '../redis';
import { wss } from "../index";
import { v4 as uuidv4 } from 'uuid';

// 공부방 생성
const createStudyRoom = async (userId: string, roomType: string, studyMate: any, assistantTone: string, cameraAccess: boolean) => {
  const _id = uuidv4();
  const roomData = {
    _id,
    userId,
    roomType,
    studyMate: JSON.stringify(studyMate),
    assistantTone,
    cameraAccess: cameraAccess.toString(),
    startTime: new Date().toISOString(),
    accumulatedTime: "0",
    status: "active",
    createdAt: new Date().toISOString(),
  };

  // Redis에 방 정보 저장
  await redisClient.hSet(_id, roomData);

  return { ...roomData };
};

// 공부방 시작
const startStudyRoom = async (userId: string, roomId: string) => {
  const roomKey = roomId;

  // Redis에서 방 정보 확인
  const room = await redisClient.hGetAll(roomKey);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  // 방 상태를 활성화로 설정
  await redisClient.hSet(roomKey, { status: "active", startTime: new Date().toISOString() });

  // WebSocket으로 클라이언트에 알림 전송
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify({
        type: "roomStarted",
        roomId,
        message: "Study room has started.",
      })
    );
  });

  return { message: "공부방 시작됨", roomId };
};

// 공부방 일시정지 및 재개
const pauseStudyRoom = async (userId: string, roomId: string) => {
  const roomKey = roomId;

  const room = await redisClient.hGetAll(roomKey);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  const now = new Date();
  let accumulatedTime = parseInt(room.accumulatedTime || "0", 10);

  if (room.status === "active") {
    accumulatedTime += Math.floor((now.getTime() - new Date(room.startTime).getTime()) / 1000);
    await redisClient.hSet(roomKey, { status: "paused", accumulatedTime: accumulatedTime.toString() });
  } else {
    await redisClient.hSet(roomKey, { status: "active", startTime: now.toISOString() });
  }

  wss.clients.forEach((client) => {
    client.send(JSON.stringify({ type: "roomPaused", roomId, status: room.status }));
  });

  return { roomId, status: room.status, accumulatedTime };
};

// 공부방 종료
const stopStudyRoom = async (userId: string, roomId: string) => {
  const roomKey = roomId;
  const room = await redisClient.hGetAll(roomKey);

  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  const now = new Date();
  let totalStudyTime = parseInt(room.accumulatedTime || "0", 10);

  if (room.status === "active") {
    totalStudyTime += Math.floor((now.getTime() - new Date(room.startTime).getTime()) / 1000);
  }

  // 공부 기록 저장
  const newRecord = new StudyRecordModel({
    userId,
    date: now,
    startTime: room.startTime,
    endTime: now.toTimeString().split(' ')[0],
    studyDuration: totalStudyTime,
    createdAt: now,
  });
  await newRecord.save();

  // Redis에서 방 정보 삭제
  await redisClient.del(roomKey);

  return { totalStudyTime, stoppedAt: now };
};

// 디폴트 공부방 설정 저장
const setDefaultStudyRoom = async (userId: string, roomSettings: any) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('사용자를 찾을 수 없습니다.');

  user.defaultSettings = {
    roomType: roomSettings.roomType,
    studyMate: roomSettings.studyMate,
    assistantTone: roomSettings.assistantTone,
    cameraAccess: roomSettings.cameraAccess
  };
  await user.save();

  return user.defaultSettings;
};

// 공부방 정보 조회
const getStudyRoomInfo = async (userId: string, roomId: string) => {
  const roomKey = roomId;

    // Redis에서 방 정보 조회
  const room = await redisClient.hGetAll(roomKey);
  if (!room || room.userId !== userId) {
    throw new Error("공부방을 찾을 수 없습니다.");
  }

  // Redis에서 저장된 데이터 반환
  return {
    _id: roomKey,
    userId: room.userId,
    roomType: room.roomType,
    studyMate: JSON.parse(room.studyMate),
    assistantTone: room.assistantTone,
    cameraAccess: room.cameraAccess === "true",
    startTime: room.startTime,
    accumulatedTime: parseInt(room.accumulatedTime || "0", 10),
    status: room.status,
  };
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
  // managePomodoro,
  // getPomodoroStatus,
}