import mongoose from "mongoose";

export interface GroupMember {
  userId: mongoose.Types.ObjectId;
  role: "admin" | "member";
}

export interface GroupData {
  name: string;
  description: string;
  goalStudyTime: number;
  createdAt?: Date;
  members: GroupMember[];
}
