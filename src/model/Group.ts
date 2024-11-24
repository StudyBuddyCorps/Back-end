import mongoose, { Schema, Document } from "mongoose";

const groupSchema = new Schema({
  name: { type: String, required: true }, // require -> required
  description: { type: String, required: true },
  goalStudyTime: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  members: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, default: "member", required: true },
    },
  ],
});

export default mongoose.model("Group", groupSchema);
