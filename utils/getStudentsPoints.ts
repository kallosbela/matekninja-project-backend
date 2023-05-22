import { ObjectId } from "mongoose";
import { SolutionType } from "../models/SolutionSchema";
import { z } from "zod";

export const SolutionSchema = z.object({
  taskId: z.string(),
  taskListId: z.string(),
  studentId: z.string(),
  team: z.string(),
  answer: z.string(),
  teacherComment: z.string(),
  points: z.number(),
  duringTime: z.number(),
  correct: z.boolean(),
  checked: z.boolean(),
  usedHints: z.number(),
  ip: z.string(),
  date: z.number(),
});

const getStudentsPoints = async (solutions: SolutionType[], start: number, end: number): Promise<[string, number][]> => {

  const studentPoints = new Map<string,number>();
  
  solutions
  .filter(solution=>solution.date!>=start && solution.date!<=end)
  .forEach((solution) => {
    const id = solution.studentId?.toString();
    if (!id) throw new Error("Solution is not valid");
    const points = solution.points || 0;
    if (studentPoints.has(id)) {
      studentPoints.set(id, studentPoints.get(id)! + points);
    } else {
      studentPoints.set(id, points);
    }
  });

  const sortedStudentPoints = new Map([...studentPoints.entries()].sort((a, b) => b[1] - a[1]));
  const studentPointsArray = Array.from(sortedStudentPoints.entries());

  return studentPointsArray;
};

export default getStudentsPoints;