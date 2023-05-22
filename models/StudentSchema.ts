import mongoose, { Schema, InferSchemaType } from "mongoose";

const studentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User"},
  teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
  teachers: [{ type: Schema.Types.ObjectId, ref: "Teacher" }],
  points: Number, // default 0
  practiceTime: Number, // default 0 
});

export type StudentType = InferSchemaType<typeof studentSchema>;
export const Student = mongoose.model("Student", studentSchema);