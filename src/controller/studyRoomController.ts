import { Request, Response } from 'express';
import { studyRoomService } from '../service/studyRoomService';
import userService from '../service/userService';
import mongoose from 'mongoose';

export const studyRoomController = {
  // 공부방 생성
  async createStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const { roomType, studyMate, assistantTone, cameraAccess } = req.body;
      const newRoom = await studyRoomService.createStudyRoom(userId, roomType, studyMate, assistantTone, cameraAccess);
      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ message: '공부방 생성에 실패했습니다.' });
    }
  },

  // 공부방 시작
  async startStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      const result = await studyRoomService.startStudyRoom(userId, roomId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: '공부방 시작에 실패했습니다.' });
    }
  },

  // 공부방 일시정지 및 재개
  async pauseStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      const result = await studyRoomService.pauseStudyRoom(userId, roomId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: '공부방 일시정지/재개에 실패했습니다.' });
    }
  },

  // 공부방 종료
  async stopStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      const result = await studyRoomService.stopStudyRoom(userId, roomId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: '공부방 종료에 실패했습니다.' });
    }
  },

  // 디폴트 공부방 설정 저장
  async setDefaultStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const { roomType, studyMate, assistantTone, cameraAccess } = req.body;
      const result = await studyRoomService.setDefaultStudyRoom(userId, { roomType, studyMate, assistantTone, cameraAccess });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: '디폴트 공부방 설정 저장에 실패했습니다.' });
    }
  },
  
  // 공부방 정보 조회
  async getStudyRoomInfo(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      const roomInfo = await studyRoomService.getStudyRoomInfo(userId, roomId);
      res.status(200).json(roomInfo);
    } catch (error) {
      res.status(500).json({ message: '공부방 정보를 가져오는데 실패했습니다.' });
    }
  },

  // 뽀모도로 세션 관리 (공부 및 휴식)
  async managePomodoro(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      const action = req.body.action; 
      
      const result = await studyRoomService.managePomodoro(userId, roomId, action);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: '뽀모도로 세션 관리에 실패했습니다.', error });
    }
  },

  // 뽀모도로 진행 상태 조회
  async getPomodoroStatus(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const roomId = req.params.roomId;
      
      const status = await studyRoomService.getPomodoroStatus(userId, roomId);
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ message: '뽀모도로 상태를 가져오는데 실패했습니다.', error });
    }
  },

  // 디폴트 공부방 설정을 불러와 바로 실행
  async startDefaultStudyRoom(req: Request, res: Response) {
    try {
      const userId = req.body.userId;

      const user = await userService.getUserByID(userId);
      const defaultSettings = user.defaultSettings;

      if (!defaultSettings) {
        return res.status(404).json({ message: "디폴트 공부방 설정이 없습니다." });
      }

      const newStudyRoom = await studyRoomService.createStudyRoom(
        userId,
        defaultSettings.roomType,
        defaultSettings.studyMate,
        defaultSettings.assistantTone,
        defaultSettings.cameraAccess
      );

      const studyRoomId = (newStudyRoom._id as mongoose.Types.ObjectId).toString();

      const startedRoom = await studyRoomService.startStudyRoom(userId, studyRoomId);
      res.status(201).json({
        message: "디폴트 공부방이 성공적으로 실행되었습니다.",
        studyRoom: startedRoom,
      });
    } catch (error: any) {
      console.error("Error while starting default study room:", error);
      res.status(500).json({ message: '공부방 시작에 실패.', error: error.message });
    }
  }
};
