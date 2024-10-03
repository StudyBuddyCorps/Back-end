import mongoose, { Schema, Document } from "mongoose";

// const ProviderSchema = new Schema({
//   _id: mongoose.Schema.Types.ObjectId,
//   providerId: { type: Number, required: true },
//   from: { type: String, enum: ["Google", "KaKao", "default"], required: true },
// });

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // provider: { type: ProviderSchema, required: true },
  nickname: { type: String, required: true },
  // profileUrl: { type: String },
  // goal: { type: String },
  // isRandom: { type: Boolean, default: false },
  // userPhrase: { type: String },
  myGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
});

export default mongoose.model("User", UserSchema);
