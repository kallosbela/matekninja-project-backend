import express, { Request, Response } from "express";
import { z } from "zod";
import { verifyToken } from "../middlewares/verifyToken";
import { TaskList, TaskListType } from "../models/TaskListSchema";

const router = express.Router();

router.get("/", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const tasklists = await TaskList.find<TaskListType>({ team: user.team });
  

  return res.json(tasklists);
});

export default router;