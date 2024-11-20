import { Router } from 'express';
import { studyRoomController } from '../controller';
import authJWT from '../middleware/authJWT';

const router = Router();

router.post('/', authJWT, studyRoomController.createStudyRoom);
router.post('/:roomId/start', authJWT, studyRoomController.startStudyRoom);
router.patch('/:roomId/pause', authJWT, studyRoomController.pauseStudyRoom);
router.post('/:roomId/stop', authJWT, studyRoomController.stopStudyRoom);
// router.post('/:roomId/pomodoro', authJWT, studyRoomController.managePomodoro);
// router.get('/:roomId/pomodoro/status', authJWT, studyRoomController.getPomodoroStatus);
router.get('/:roomId', authJWT, studyRoomController.getStudyRoomInfo);
router.post('/default', authJWT, studyRoomController.setDefaultStudyRoom);
router.post('/defaultstart', authJWT, studyRoomController.startDefaultStudyRoom);
router.patch('/:roomId/feedback', authJWT, studyRoomController.updateFeedback);

export default router;
