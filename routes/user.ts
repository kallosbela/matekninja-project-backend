import express, { Request, Response } from "express";
import { z } from "zod";
import { getIdToken } from "../api/getIdToken";
import jwt from "jsonwebtoken";
import { safeParse } from "../utils/safeParse";
import { verifyToken } from "../middlewares/verifyToken";
import { User, UserType } from "../models/UserSchema";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined");
}

const router = express.Router();

//update user in db
router.put("/:id", verifyToken(), async (req: Request, res: Response) => {
  const id = req.params.id;
  const newProfilData = req.body;
  const userId = res.locals.user._id;
  if (userId !== id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const updatedUser = await User.findByIdAndUpdate(id, newProfilData, { new: true });
  if (!updatedUser) return res.sendStatus(500)
  const tokenObject = {
    sub: updatedUser.sub,
    email: updatedUser.email,
    name: updatedUser.name,
    picture: updatedUser.picture,
    role: updatedUser.role,
    _id: updatedUser._id?.toString(),
    school: updatedUser.school,
    team: updatedUser.team
  };
  const sessionToken = jwt.sign(tokenObject, secretKey, { expiresIn: "1d" });
  return res.json({ token: sessionToken });
});

//delete user in db
router.delete("/:id", verifyToken(), async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = res.locals.user._id;
  if (userId !== id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const result = await User.findByIdAndDelete(id);
  return res.json({ message: "User deleted" });
});

export default router;