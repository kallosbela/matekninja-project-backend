import {z} from 'zod';

export const statisticsSchema = z.object({
  studentId: z.string(),
  start: z.number(),
  end: z.number(),
  practiceTime: z.number().array(),
  solvedTasks: z.number(),
  correctTasks: z.number(),
  points: z.number().array(),
  pointRankInTeam: z.number(),
  practiceRankInTeam: z.number(),
  team: z.string(),
  teacher: z.string(),
  school: z.string(),
});

export type StatisticsType = z.infer<typeof statisticsSchema>;

import express, { Request, Response } from "express";

import { verifyToken } from "../middlewares/verifyToken";
import { Solution } from "../models/SolutionSchema";
import getPracticeList from '../utils/getPracticeList';
import getStudentsPoints from '../utils/getStudentsPoints';
import getPointList from '../utils/getPointList';
import getStudentsPracticeTimes from '../utils/getStudentsPracticeTimes';

const router = express.Router();

router.post("/", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  const {start,end} = req.body;
  const solutions = await Solution.find({ team: user.team });
  if (!solutions) {
    return res.sendStatus(404);
  }
  const filteredSolutions = solutions.filter((solution) => solution.date! >= start && solution.date! <= end);
  if (!filteredSolutions) {
    return res.sendStatus(404);
  }
  const mySolutions = filteredSolutions.filter((solution) => solution.studentId?.toString() === user._id);
  if (!mySolutions) {
    return res.sendStatus(404);
  }
  const mySolutionsCorrect = mySolutions.filter((solution) => solution.correct).length;
  const mySolutionsSolved = mySolutions.length;
  const practiceList = await getPracticeList(mySolutions, start, end);
  const myPoints = mySolutions.reduce((acc, solution) => acc + solution.points!, 0);
  const studentsPoints = await getStudentsPoints(filteredSolutions,start,end);
  const myPointRank = studentsPoints.findIndex((student) => student[0] === user._id) + 1;
  const pointList = await getPointList(mySolutions,start,end);
  const studentPracticeTimes = await getStudentsPracticeTimes(solutions,start,end);
  const myPracticeRank = studentPracticeTimes.findIndex((student) => student[0] === user._id) + 1;

  const statistics = {
    studentId: user._id,
    start: start,
    end: end,
    practiceTime: practiceList,
    solvedTasks: mySolutionsSolved,
    correctTasks: mySolutionsCorrect,
    points: pointList,
    pointRankInTeam: myPointRank,
    practiceRankInTeam: myPracticeRank,
    team: user.team,
    teacher: user.teacher,
    school: user.school,
  };

  return res.json(statistics);
});

export default router;