import { UserType } from "../models/UserSchema";

export const getTokenObject = (obj: UserType) => {
  const tokenObject = {
    sub: obj.sub,
    email: obj.email,
    name: obj.name,
    picture: obj.picture,
    role: obj.role,
    // id: obj._id?.toString(),
    school: obj.school,
    team: obj.team
  };
  return tokenObject;
};