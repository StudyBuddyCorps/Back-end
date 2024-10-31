import mongoose, { Schema, Document } from 'mongoose';

interface IStudyRoomDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  roomType: 'normal' | 'pomodoro';
  studyMate: {
    image: 'Noti';
    voice: 'voice1' | 'voice2' | 'voice3' | 'mute';
  };
  assistantTone: 'default' | 'genius-nerd' | 'scholar' | 'fairy';
  cameraAccess: boolean;
  startTime: Date;
  accumulatedTime: number;
  status: 'active' | 'paused' | 'pomodoro_study' | 'pomodoro_break' | 'stopped';
  createdAt: Date;
  updatedAt: Date;
}

const studyRoomSchema: Schema<IStudyRoomDocument> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomType: { type: String, enum: ['normal', 'pomodoro'], default: 'normal' },
  studyMate: {
    image: {type: String, enum: ['Noti'], default: 'Noti', required: true },
    voice: { type: String, enum: ['voice1', 'voice2', 'voice3', 'mute'], default: 'mute' }
  },
  assistantTone: { type: String, enum: ['default', 'genius-nerd', 'scholar', 'fairy'], default: 'default' },
  cameraAccess: { type: Boolean, default: true },
  startTime: { type: Date, required: true },
  accumulatedTime: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'paused', 'pomodoro_study', 'pomodoro_break', 'stopped'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StudyRoomModel = mongoose.model<IStudyRoomDocument>('StudyRoom', studyRoomSchema);
export { StudyRoomModel, IStudyRoomDocument };
