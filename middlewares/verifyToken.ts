import { Request, Response, NextFunction } from "express";
import { safeParse } from "../utils/safeParse";
import { z } from "zod";
import jwt, { VerifyErrors } from "jsonwebtoken";

const env = z.object({JWT_SECRET: z.string()}).parse(process.env)

const UserSchema = z.object({
  sub: z.string(),
  email: z.string(),
  name: z.string(),
  picture: z.string(),
  role: z.string(),
  school: z.string(),
  team: z.string(),
  _id: z.string(),
});

type UserType = z.infer<typeof UserSchema>;


export const verifyToken = () => (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    jwt.verify(token, env.JWT_SECRET, (error, decoded) => {
      if (error) return res.status(401).json({ error: "Unauthorized" }) 
      const user = safeParse(UserSchema, decoded);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      res.locals.user = user;
      next();
    });
  };