import mongoose, { Schema } from "mongoose";

const PhraseSchema = new Schema({
  isRandom: { type: Boolean, default: true },
  content: { type: String, default: "지금 안 하면 언제 할거야?" },
});

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, trim: true },
  provider: {
    type: String,
    enum: ["local", "google", "kakao"],
    default: "local",
  },
  refreshToken: { type: String },
  nickname: { type: String, required: true },
  profileUrl: { type: String },
  goal: { type: Number, default: 3600 },
  phrase: PhraseSchema,
  myGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

export default mongoose.model("User", UserSchema);
