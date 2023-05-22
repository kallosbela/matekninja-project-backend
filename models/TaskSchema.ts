import mongoose, { Schema, InferSchemaType } from "mongoose";

const taskSchema = new Schema({
    name: String,
    text: String, // "What is the sum of $\frac{2}{5}$ and 3?" - Latex format
    illustration: [String], 
    listen_text: String, 
    hints: [String], 
    answer: [String],
    score: Number, // 1, 2, 3, 4, 5
    tags: [String], // topics
    type: String, // "multiple choice", "one number", "short", "open problem",
});

export type TaskType = InferSchemaType<typeof taskSchema>;
export const Task = mongoose.model("Task", taskSchema);