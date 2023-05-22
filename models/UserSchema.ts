import mongoose, { Schema, InferSchemaType } from "mongoose";

const userSchema = new Schema({
  sub: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String, required: true },
  role: { type: String, required: true },//student or teacher
  school: { type: String},
  team: { type: String},
});

export type UserType = InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);