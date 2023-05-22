import express, { Request, Response } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { TaskList, TaskListType } from "../models/TaskListSchema";
import { Task, TaskType } from "../models/TaskSchema";

const router = express.Router();

router.post("/mytasks", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  const taskIds = req.body.taskIds;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const tasks = await Task.find<TaskType>({ _id: { $in: taskIds } });
  return res.json(tasks);
});

router.post("/:id", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  const tasklistId = req.params.id;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const tasklist = await TaskList.find<TaskListType>({ team: user.team, _id: tasklistId });
  if (!tasklist) {
    return res.status(404).json({ error: "Tasklist not found" });
  }
  const tasks = await Task.find<TaskType>({ _id: { $in: tasklist[0].tasks } });

  return res.json(tasks);
});


export default router;