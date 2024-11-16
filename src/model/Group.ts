import mongoose, { Schema, Document, Types } from "mongoose";

interface GroupMember {
  userId: Types.ObjectId;
  role: string;
}

export interface GroupDocument extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  goalStudyTime: number;
  createdAt: Date;
  members: GroupMember[];
}

const groupSchema = new Schema<GroupDocument>({
  name: { type: String, require: true },
  description: { type: String, required: true },
  goalStudyTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  members: [{ 
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'member', required: true }
  }]
});

export default mongoose.model<GroupDocument>('Group', groupSchema);