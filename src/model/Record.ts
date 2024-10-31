import mongoose, { Schema, Document } from 'mongoose';

interface IStudyRecordDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  studyDuration: number;
  createdAt: Date;
}

const studyRecordSchema: Schema<IStudyRecordDocument> = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  studyDuration: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const StudyRecordModel = mongoose.model<IStudyRecordDocument>('StudyRecord', studyRecordSchema);
export { StudyRecordModel, IStudyRecordDocument };
