import { SolutionType } from "../models/SolutionSchema";
import { z } from "zod";
import { SolutionSchema } from "./getStudentsPoints";

const getStudentsPracticeTimes = async (solutions: SolutionType[], start:number,end:number): Promise<[string, number][]> => {

  const studentsTimes = new Map<string,number>();
  
  solutions.forEach((solution) => {
    // const checkedSolution = SolutionSchema.safeParse(solution);
    // if (!checkedSolution.success) {
    //   throw new Error("Solution is not valid");
    // }
    const id = solution.studentId?.toString();
    if (!id) throw new Error("Solution is not valid");
    const time = solution.duringTime || 0;
    if (studentsTimes.has(id)) {
      studentsTimes.set(id, studentsTimes.get(id)! + time);
    } else {
      studentsTimes.set(id, time);
    }
  });

  const sortedStudentsTimes = new Map([...studentsTimes.entries()].sort((a, b) => b[1] - a[1]));
  const studentsTimesArray = Array.from(sortedStudentsTimes.entries());
  
  return studentsTimesArray;
};

export default getStudentsPracticeTimes;