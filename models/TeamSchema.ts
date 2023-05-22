import mongoose, { Schema, InferSchemaType } from "mongoose";

const teamSchema = new Schema({
    name: String,
    studentEmails: [String],
});

export type TeamType = InferSchemaType<typeof teamSchema>;
export const Team = mongoose.model("User", teamSchema);