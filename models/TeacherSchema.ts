import mongoose, { Schema, InferSchemaType, SchemaType } from "mongoose";

const teacherSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    email: String,
    sub: String,
    school: String,
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
});

export type TeacherType = InferSchemaType<typeof teacherSchema>;
export const Teacher = mongoose.model("Teacher", teacherSchema);