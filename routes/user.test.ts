import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import jwt from "jsonwebtoken";
import { User, UserType } from "../models/UserSchema";
import app from "../app";
import supertest from "supertest";
import { connect, disconnect, cleanData } from "./mongodb.memory.test.helper";

const testApp = supertest(app);

const testUser: UserType = {
  sub: "testUserId123",
  email: "testuser@example.com",
  name: "Test User",
  picture: "https://example.com/testuser.jpg",
  role: "student",
  team: "Test Team",
  school: "Test School",
};

const secretKey = process.env.JWT_SECRET || "secret";

describe("user router test", () => {
  beforeAll(connect);
  afterEach(cleanData);
  afterAll(disconnect);

  it("should update the user.school and user.name, and generate a new sessiontoken. PUT /api/user/:id - update user", async () => {
    // given
    const user = new User(testUser);
    const userInDB = await user.save();
    const tokenObject = {
      sub: userInDB.sub,
      email: userInDB.email,
      name: userInDB.name,
      picture: userInDB.picture,
      role: userInDB.role,
      _id: userInDB._id?.toString(),
      school: userInDB.school,
      team: userInDB.team
    };
    const token = jwt.sign(tokenObject, secretKey, { expiresIn: "1d" });

    // when
    const response = await request(app)
      .put(`/api/user/${userInDB._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        school: "New Test School",
        name: "New Test Name",
      });
    const updatedUser = await User.findById(userInDB._id);
    console.log("updatedUser", updatedUser);

    // then
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(updatedUser?.school).toBe("New Test School");
    expect(updatedUser?.name).toBe("New Test Name");
  });

  it("should delete the testUser from DB. DELETE /api/user/:id - delete user", async () => {
    // given
    const user = new User(testUser);
    const userInDB = await user.save();
    const tokenObject = {
      sub: userInDB.sub,
      email: userInDB.email,
      name: userInDB.name,
      picture: userInDB.picture,
      role: userInDB.role,
      _id: userInDB._id?.toString(),
      school: userInDB.school,
      team: userInDB.team
    };
    const token = jwt.sign(tokenObject, secretKey, { expiresIn: "1d" });

    // when
    const response = await request(app)
      .delete(`/api/user/${userInDB._id}`)
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted");
  });
});
