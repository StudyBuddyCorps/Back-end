import { Request, Response } from "express";
import { studyRoomService } from "../service";

// 공부방 생성
const createStudyRoom = async (req: Request, res: Response) => {
  try {
    const { userId, roomType, studyMate, assistantTone, cameraAccess } =
      req.body;
    const newRoom = await studyRoomService.createStudyRoom(
      userId.toString(),
      roomType,
      studyMate,
      assistantTone,
      cameraAccess
    );
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "공부방 생성에 실패했습니다." });
  }
};

// 공부방 시작
const startStudyRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const roomId = req.params.roomId;
    const result = await studyRoomService.startStudyRoom(
      userId.toString(),
      roomId
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "공부방 시작에 실패했습니다." });
  }
};

// 공부방 일시정지 및 재개
const pauseStudyRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const roomId = req.params.roomId;
    const { accumulatedTime } = req.body;
    const result = await studyRoomService.pauseStudyRoom(
      userId.toString(),
      roomId,
      accumulatedTime
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "공부방 일시정지/재개에 실패했습니다." });
  }
};

// 공부방 종료
const stopStudyRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const roomId = req.params.roomId;
    const { accumulatedTime } = req.body;
    const result = await studyRoomService.stopStudyRoom(
      userId.toString(),
      roomId,
      accumulatedTime
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "공부방 종료에 실패했습니다." });
  }
};

// 디폴트 공부방 설정 저장
const setDefaultStudyRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const { roomType, studyMate, assistantTone, cameraAccess } = req.body;
    const result = await studyRoomService.setDefaultStudyRoom(
      userId.toString(),
      {
        roomType,
        studyMate,
        assistantTone,
        cameraAccess,
      }
    );
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "디폴트 공부방 설정 저장에 실패했습니다." });
  }
};

// 디폴트 공부방 설정을 불러와 바로 실행
const startDefaultStudyRoom = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const result = await studyRoomService.startDefaultStudyRoom(
      userId.toString()
    );

    res.status(201).json(result);
  } catch (error) {
    console.error("Error starting default study room:", error);
  }
};

// 공부방 정보 조회
const getStudyRoomInfo = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const roomId = req.params.roomId;
    const roomInfo = await studyRoomService.getStudyRoomInfo(
      userId.toString(),
      roomId
    );
    res.status(200).json(roomInfo);
  } catch (error) {
    res.status(500).json({ message: "공부방 정보를 가져오는데 실패했습니다." });
  }
};

const updateFeedback = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const { feedbackType, time } = req.body;

    const result = await studyRoomService.updateFeedback(
      roomId,
      feedbackType,
      time
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "피드백 업데이트에 실패했습니다." });
  }
};

// // 뽀모도로 세션 관리 (공부 및 휴식)
// const managePomodoro = async (req: Request, res: Response) => {
//   try {
//     const userId = req.body.userId;
//     const roomId = req.params.roomId;
//     const action = req.body.action;

//     const result = await studyRoomService.managePomodoro(userId, roomId, action);
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ message: '뽀모도로 세션 관리에 실패했습니다.', error });
//   }
// };

// // 뽀모도로 진행 상태 조회
// const getPomodoroStatus = async (req: Request, res: Response) => {
//   try {
//     const userId = req.body.userId;
//     const roomId = req.params.roomId;

//     const status = await studyRoomService.getPomodoroStatus(userId, roomId);
//     res.status(200).json(status);
//   } catch (error) {
//     res.status(500).json({ message: '뽀모도로 상태를 가져오는데 실패했습니다.', error });
//   }
// };

export default {
  createStudyRoom,
  startStudyRoom,
  pauseStudyRoom,
  stopStudyRoom,
  setDefaultStudyRoom,
  getStudyRoomInfo,
  // managePomodoro,
  // getPomodoroStatus,
  startDefaultStudyRoom,
  updateFeedback,
};
