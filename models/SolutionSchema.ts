import mongoose, { Schema, InferSchemaType } from "mongoose";

const solutionSchema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'Task' },
    taskListId: { type: Schema.Types.ObjectId, ref: 'TaskList' },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    team: String,
    answer: String,
    teacherComment: String,
    points: Number,
    duringTime: Number,
    correct: Boolean,
    checked: Boolean,
    usedHints: Number,
    ip: String,
    date: Number,
});

export type SolutionType = InferSchemaType<typeof solutionSchema>;
export const Solution = mongoose.model("Solution", solutionSchema);