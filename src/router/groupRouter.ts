import express from "express";
import groupController from "../controller/groupController";

const router = express.Router();

router.post('/create', groupController.createGroup);  // 그룹 생성
router.post('/mygroup', groupController.getMyGroups);  // 그룹 목록 조회
router.get('/search', groupController.searchGroups);  // 그룹 검색
router.post('/addmember', groupController.addMemberToGroup);  // 그룹에 멤버 추가
router.get("/:groupId", groupController.getGroupById);  // 특정 그룹 조회
router.get("/name/:groupName", groupController.getGroupIdByName);  // groupname으로 그룹 조회

export default router;