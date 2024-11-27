![Stylized laptop side mockup](https://github.com/user-attachments/assets/b64e834b-dae0-43f0-9c2e-b42139c6b804)
# 🐣StudyBuddy Backend🐣
노티와 함께 성장하는 공부 파트너, StudyBuddy의 백엔드입니다!

<br><br>

## 🔎 Service Introduction
StudyBuddy는 가상의 캐릭터 `노티`가 학습 자세를 관찰하고 피드백을 제공하며, 학습 결과를 시각화하여 목표 달성을 돕는 학습 플랫폼입니다.
이제, 혼자 공부하지 말고, StudyBuddy와 함께하세요!
### 🎥 Demonstration video
[![StudyBuddy 소개 영상](https://github.com/user-attachments/assets/8a6c9c70-004c-4e74-9f5e-1d58c37a0141)
](https://youtu.be/QcWG6GFLRQc)

<br><br>

## 😁 Backend Developers
<table>
  <tbody>
    <tr>
      <td align="center"><img src="https://github.com/user-attachments/assets/558fe1f1-15de-436b-971c-a0d8d44ee371"width="100px;" alt="한지수"/></td>
      <td align="center"><img src="https://github.com/user-attachments/assets/57b38a95-4dbf-4a95-89b5-8dea210157ac" width="100px;" alt="전의정"/></td>
    <tr/>
    <tr>
        <td align="center">한지수</td><td align="center">전의정</td>
    </tr>
    <tr>
        <td align="center"><a href="https://github.com/Jisu0528">Jisu0528</a></td>
        <td align="center"><a href="https://github.com/juijeong8324">juijeong8324</a></td>
    </tr>
  </tbody>
</table>

<br><br>

## 🛠️ Technology Stack
![기술스택_백엔드](https://github.com/user-attachments/assets/84e95f5c-81d8-4041-bdba-bd9cd2c44a91)

<br><br>

## 📌 System Archtecture
![image](https://github.com/user-attachments/assets/af2ef79f-2f5f-4fbd-8dd8-347fe6fed1d6)

<br><br>


## 🔗 API Specification
![image](https://github.com/user-attachments/assets/22d1657a-ff02-42d5-9485-17330ee26e77)
> **url:** https://app.swaggerhub.com/apis-docs/0528JISU_1/StudyBuddy/1.0.0


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
