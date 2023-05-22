import express, { Request, Response } from "express";
import { z } from "zod";
import { verifyToken } from "../middlewares/verifyToken";
import { Solution } from "../models/SolutionSchema";

const router = express.Router();

router.post("/", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  const newSolution = req.body.solution;
  if (!newSolution) {
    return res.status(400).json({ error: "Bad request" });
  }
  if (newSolution.studentId !== user._id) {
    return res.status(403).json({ error: "Forbidden" })};
  const solution = new Solution(newSolution);
  const savedSolution = await solution.save();
  if (!savedSolution) {
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.json(savedSolution);
});

router.get("/", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  const mySolutions = await Solution.find({ studentId: user._id });
  if (!mySolutions) {
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.json(mySolutions);
});

router.delete("/", verifyToken(), async (req: Request, res: Response) => {
  const user = res.locals.user;
  if (user.role !== "teacher") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const solutionId = req.body.solutionId;
  if (!solutionId) {
    return res.status(400).json({ error: "Bad request" });
  }
  const solution = await Solution.findById(solutionId);
  if (!solution) {
    return res.status(404).json({ error: "Not found" });
  }
  const deleted = await Solution.findByIdAndDelete({ _id: solutionId });
  if (!deleted) {
    return res.status(500).json({ error: "Internal server error" });
  }
  return res.sendStatus(200);
});

export default router;