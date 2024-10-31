export interface IStudyRoom {
  _id: string;
  userId: string; 
  roomType: 'normal' | 'pomodoro';
  studyMate: {
    image: string;
    voice: 'voice1' | 'voice2' | 'voice3' | 'mute';
  };
  assistantTone: 'default' | 'genius-nerd' | 'scholar' | 'fairy';
  cameraAccess: boolean;
  startTime: Date;
  accumulatedTime: number;
  status: 'active' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}