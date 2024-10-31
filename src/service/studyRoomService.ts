import { StudyRoomModel } from '../model/StudyRoom';
import User from "../model/User";
import { StudyRecordModel } from '../model/Record';
import mongoose from 'mongoose';

export const studyRoomService = {
  // 공부방 생성
  async createStudyRoom(userId: string, roomType: string, studyMate: any, assistantTone: string, cameraAccess: boolean) {
    const newRoom = new StudyRoomModel({
      userId,
      roomType,
      studyMate,
      assistantTone,
      cameraAccess,
      startTime: new Date(),
      accumulatedTime: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newRoom.save();
    return newRoom;
  },

  // 공부방 시작
  async startStudyRoom(userId: string, roomId: string) {
    const room = await StudyRoomModel.findOne({ _id: roomId, userId });
    console.log(roomId);
    if (!room) throw new Error('공부방을 찾을 수 없습니다.');
    room.status = 'active';
    room.startTime = new Date();
    await room.save();
    return room;
  },

  // 공부방 일시정지 및 재개
  async pauseStudyRoom(userId: string, roomId: string) {
    const room = await StudyRoomModel.findOne({ _id: roomId, userId });
    if (!room) throw new Error('공부방을 찾을 수 없습니다.');

    const now = new Date();
    if (room.status === 'active') {
      room.accumulatedTime += Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
      room.status = 'paused';
    } else {
      room.startTime = now;
      room.status = 'active';
    }

    await room.save();
    return room;
  },

  // 공부방 종료
  async stopStudyRoom(userId: string, roomId: string) {
    const room = await StudyRoomModel.findOne({ _id: roomId, userId });
    if (!room) throw new Error('공부방을 찾을 수 없습니다.');

    const now = new Date();
    let totalStudyTime = room.accumulatedTime;

    if (room.status === 'active') {
      totalStudyTime += Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
    }

    const newRecord = new StudyRecordModel({
      userId,
      date: now,
      startTime: room.startTime.toTimeString().split(' ')[0],
      endTime: now.toTimeString().split(' ')[0],
      studyDuration: totalStudyTime,
      createdAt: now
    });
    await newRecord.save();

    await StudyRoomModel.deleteOne({ _id: roomId });

    return { totalStudyTime, stoppedAt: now };
  },

  // 디폴트 공부방 설정 저장
  async setDefaultStudyRoom(userId: string, roomSettings: any) {
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
  },

  // 공부방 정보 조회
  async getStudyRoomInfo(userId: string, roomId: string) {
    try {
      const objectId = new mongoose.Types.ObjectId(roomId);
      const room = await StudyRoomModel.findOne({ _id: objectId, userId });
      if (!room) throw new Error('공부방을 찾을 수 없습니다.');
      return room;
    } catch (error) {
      throw new Error('유효하지 않은 방 ID입니다.');
    }
  },

  // 뽀모도로 세션 관리
  async managePomodoro(userId: string, roomId: string, action: string) {
    const room = await StudyRoomModel.findOne({ _id: roomId, userId });
    if (!room) throw new Error('공부방을 찾을 수 없습니다.');

    const now = new Date();

    if (action === 'start') {
      room.status = 'pomodoro_study';
      room.startTime = now;
      room.accumulatedTime = 0;
    } else if (action === 'break') {
      if (room.status !== 'pomodoro_study') {
        throw new Error('공부 중이 아니므로 휴식으로 전환할 수 없습니다.');
      }
      room.status = 'pomodoro_break';
      const studyDuration = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
      room.accumulatedTime += studyDuration; 
      room.startTime = now; 
    } else if (action === 'stop') {
      const totalDuration = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
      room.accumulatedTime += totalDuration; 
      room.status = 'stopped'; 
    }

    await room.save();
    return room;
  },

  // 뽀모도로 진행 상태 조회
  async getPomodoroStatus(userId: string, roomId: string) {
    const room = await StudyRoomModel.findOne({ _id: roomId, userId });
    if (!room) throw new Error('공부방을 찾을 수 없습니다.');

    const now = new Date();
    const elapsedTime = Math.floor((now.getTime() - room.startTime.getTime()) / 1000);
    let statusMessage = '';

    if (room.status === 'pomodoro_study') {
      const remainingStudyTime = 1500 - elapsedTime; 
      statusMessage = `공부 중, 남은 시간: ${remainingStudyTime}초`;
    } else if (room.status === 'pomodoro_break') {
      const remainingBreakTime = 300 - elapsedTime;
      statusMessage = `휴식 중, 남은 시간: ${remainingBreakTime}초`;
    } else {
      statusMessage = '세션이 종료되었습니다.';
    }

    return { status: room.status, statusMessage };
  }
};
