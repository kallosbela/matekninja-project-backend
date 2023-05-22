import express, { Request, Response } from "express";
import { z } from "zod";
import { getIdToken } from "../api/getIdToken";
import jwt from "jsonwebtoken";
import { safeParse } from "../utils/safeParse";
import { verify } from "../middlewares/verify";
import { User } from "../models/UserSchema";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET is not defined");
}

const LoginRequestSchema = z.object({ code: z.string() });
type LoginRequest = z.infer<typeof LoginRequestSchema>;

const Payload = z.object({
  sub: z.string(),
  email: z.string(),
  name: z.string(),
  picture: z.string(),
});
type PayLoad = z.infer<typeof Payload>;

const router = express.Router();

//login as student, send token to frontend
router.post(
  "/",
  verify(LoginRequestSchema),
  async (req: Request, res: Response) => {
    const loginRequest = req.body as LoginRequest;
    const idToken = await getIdToken(loginRequest.code);
    if (!idToken) {
      return res.status(401).json({ error: "Invalid code" });
    }
    const payload = jwt.decode(idToken);
    const result = safeParse(Payload, payload);

    if (!result) {
      return res.status(500);
    }
    const userInDB = await User.findOne({ sub: result.sub });

    if (!userInDB) {
      const newUser = new User({
        ...result,
        role: "student",
        school: "",
        team: "",
      });
      const newUserInDB = await newUser.save();

      const tokenObject = {
        sub: newUserInDB.sub,
        email: newUserInDB.email,
        name: newUserInDB.name,
        picture: newUserInDB.picture,
        role: newUserInDB.role,
        _id: newUserInDB._id?.toString(),
        school: newUserInDB.school,
        team: newUserInDB.team,
      };
      const sessionToken = jwt.sign(tokenObject, secretKey, {
        expiresIn: "1d",
      });
      return res.json({ token: sessionToken });
    } else {
      const tokenObject = {
        sub: userInDB.sub,
        email: userInDB.email,
        name: userInDB.name,
        picture: userInDB.picture,
        role: userInDB.role,
        _id: userInDB._id?.toString(),
        school: userInDB.school,
        team: userInDB.team,
      };
      const sessionToken = jwt.sign(tokenObject, secretKey, {
        expiresIn: "1d",
      });
      return res.json({ token: sessionToken });
    }
  }
);

export default router;
