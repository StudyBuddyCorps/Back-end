import { Router } from 'express';
import { recordController } from '../controller/recordController';
import authJWT from '../middleware/authJWT';

const router = Router();

router.get('/', authJWT, recordController.getStudyRecords);
router.get('/:recordId', authJWT, recordController.getStudyRecordById);

export default router;
