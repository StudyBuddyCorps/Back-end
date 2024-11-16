import express from "express";
import groupController from "../controller/groupController";
import { authJWT } from "../middleware";

const router = express.Router();

router.post('/create', authJWT, groupController.createGroup);  // 그룹 생성
router.get('/mygroup', authJWT, groupController.getMyGroups);  // 그룹 목록 조회
router.get('/search',authJWT, groupController.searchGroups);  // 그룹 검색
router.post('/:groupId/addmember', authJWT, groupController.addMemberToGroup);  // 그룹에 멤버 추가
router.get("/:groupId", authJWT, groupController.getGroupById);  // 특정 그룹 조회
router.get("/:groupId/members/search", authJWT, groupController.searchMemberInGroup);  // 그룹에 속한 멤버 검색
router.get("/:groupId/members", authJWT, groupController.getGroupMembers);  // 그룹에 속한 멤버 조회

export default router;