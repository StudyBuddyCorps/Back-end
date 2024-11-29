# 🐣StudyBuddy Backend🐣
Vision을 활용한 실시간 학습 관리 웹어플리케이션, StudyBuddy의 백엔드입니다!

<br><br>

### 🎥 Demonstration video
[![StudyBuddy 소개 영상](https://github.com/user-attachments/assets/8a6c9c70-004c-4e74-9f5e-1d58c37a0141)
](https://youtu.be/QcWG6GFLRQc)

<br><br>

## 🛠️ Technology Stack
![기술스택_백엔드](https://github.com/user-attachments/assets/84e95f5c-81d8-4041-bdba-bd9cd2c44a91)

<br><br>

## 🔗 API Specification
![image](https://github.com/user-attachments/assets/22d1657a-ff02-42d5-9485-17330ee26e77)
> **url:** https://app.swaggerhub.com/apis-docs/0528JISU_1/StudyBuddy/1.0.0


<br><br>

## DB Scheme      

<br><br>      

## 📂 Folder Archtecture
<details>
  <summary>폴더 구조 보기</summary>

  ```plaintext
📦 Back-end
 ├─ 📂src
 │  ├─ 📂config
 │  │  └─ 📜index.ts
 │  ├─ 📂constant
 │  │  └─ 📜index.ts
 │  ├─ 📂controller
 │  │  ├─ 📜authController.ts
 │  │  ├─ 📜calendarController.ts
 │  │  ├─ 📜groupController.ts
 │  │  ├─ 📜index.ts
 │  │  ├─ 📜recordController.ts
 │  │  ├─ 📜studyRoomController.ts
 │  │  └─ 📜userController.ts
 │  ├─ 📂interface
 │  │  └─ 📂DTO
 │  │     ├─ 📂auth
 │  │     │  └─ 📜LoginDTO.ts
 │  │     ├─ 📂calendar
 │  │     │  ├─ 📜GetCalendarDTO.ts
 │  │     │  └─ 📜UpdateStudyResultDTO.ts
 │  │     ├─ 📂group
 │  │     │  └─ 📜IGroup.ts
 │  │     ├─ 📂record
 │  │     │  └─ 📜IRecord.ts
 │  │     ├─ 📂studyRoom
 │  │     │  └─ 📜IStudyRoom.ts
 │  │     └─ 📂user
 │  │        └─ 📜SignupDTO.ts
 │  ├─ 📂middleware
 │  │  ├─ 📜authJWT.ts
 │  │  └─ 📜index.ts
 │  ├─ 📂model
 │  │  ├─ 📜Calendar.ts
 │  │  ├─ 📜Group.ts
 │  │  ├─ 📜Record.ts
 │  │  ├─ 📜StudyResult.ts
 │  │  ├─ 📜StudyRoom.ts
 │  │  └─ 📜User.ts
 │  ├─ 📂router
 │  │  ├─ 📜authRouter.ts
 │  │  ├─ 📜calendarRouter.ts
 │  │  ├─ 📜groupRouter.ts
 │  │  ├─ 📜index.ts
 │  │  ├─ 📜recordRouter.ts
 │  │  ├─ 📜studyRoomRouter.ts
 │  │  └─ 📜userRouter.ts
 │  ├─ 📂service
 │  │  ├─ 📜authService.ts
 │  │  ├─ 📜calendarService.ts
 │  │  ├─ 📜groupService.ts
 │  │  ├─ 📜index.ts
 │  │  ├─ 📜recordService.ts
 │  │  ├─ 📜studyRoomService.ts
 │  │  └─ 📜userService.ts
 │  ├─ 📂util
 │  │  ├─ 📜jwt.ts
 │  │  └─ 📜social.ts
 │  └─ 📜index.ts
 ├─ 📜.env
 ├─ 📜.gitignore
 ├─ 📜docker-compose.yml
 ├─ 📜Dockerfile
 ├─ 📜nodemon.json
 ├─ 📜package-lock.json
 ├─ 📜package.json
 ├─ 📜README.md
 └─ 📜tsconfig.json
