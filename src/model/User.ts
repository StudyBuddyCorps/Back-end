import mongoose, { Schema, Document } from "mongoose";

const ProviderSchema: Schema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  providerId: { type: Number, required: true },
  from: { type: String, enum: ["Google", "KaKao", "default"], required: true },
});

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwd: { type: String, required: true },
  provider: { type: ProviderSchema, required: true },
  nickname: { type: String, required: true },
  profileUrl: { type: String },
  goal: { type: String },
  isRandom: { type: Boolean, default: false },
  userPhrase: { type: String },
  myGroup: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

module.exports = mongoose.model("User", UserSchema);
