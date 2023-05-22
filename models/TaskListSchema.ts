import mongoose, { Schema, InferSchemaType } from "mongoose";

const taskListSchema = new Schema({
    // _id: { type: Schema.Types.ObjectId, required: false },
    name: String,
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    sequence: String, // "random", "sequential"
    startTime: Date,
    deadline: Date,
    team: { type: String },
    teacher: { type: String }
});

export type TaskListType = InferSchemaType<typeof taskListSchema>;
export const TaskList = mongoose.model("TaskList", taskListSchema);