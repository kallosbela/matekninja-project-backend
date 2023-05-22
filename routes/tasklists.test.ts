import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import jwt from "jsonwebtoken";
import { User, UserType } from "../models/UserSchema";
import { Task, TaskType } from "../models/TaskSchema";
import { TaskList, TaskListType } from "../models/TaskListSchema";

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

const testTask1: TaskType = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot1\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor egy?",
  hints: [],
  answer: ["6"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};
const testTask2 = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot2\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor kettő?",
  hints: [],
  answer: ["12"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};

const testTask3 = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot3\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor három?",
  hints: [],
  answer: ["18"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};

const testTask4 = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot4\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor négy?",
  hints: [],
  answer: ["24"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};

const testTask5 = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot5\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor öt?",
  hints: [],
  answer: ["30"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};

const testTask6 = {
  name: "Hatos szorzótábla",
  text: "Mennyi $6\\cdot6\\ =\\ ?$",
  illustration: [],
  listen_text: "Mennyi hatszor hat?",
  hints: [],
  answer: ["36"],
  score: 1,
  tags: ["szorzás"],
  type: "one number",
};

const testTaskList1: TaskListType = {
  name: "Hatos szorzótábla eleje",
  tasks: [],
  sequence: "random",
  startTime: new Date("2023-01-01T00:00:00.000Z"),
  deadline: new Date("2023-12-31T00:00:00.000Z"),
  team: "Test Team",
  teacher: "test Teacher",
};
const testTaskList2: TaskListType = {
  name: "Hatos szorzótábla közepe",
  tasks: [],
  sequence: "random",
  startTime: new Date("2023-01-01T00:00:00.000Z"),
  deadline: new Date("2023-12-31T00:00:00.000Z"),
  team: "Test Team",
  teacher: "test Teacher",
};
const testTaskList3: TaskListType = {
  name: "Hatos szorzótábla vége",
  tasks: [],
  sequence: "random",
  startTime: new Date("2023-01-01T00:00:00.000Z"),
  deadline: new Date("2023-12-31T00:00:00.000Z"),
  team: "Wrong Team",
  teacher: "test Teacher",
};

const secretKey = process.env.JWT_SECRET || "secret";

describe("user router test", () => {
  beforeAll(connect);
  afterEach(cleanData);
  afterAll(disconnect);

  it("should send the user's tasklists (taskList1 and taskList2) that belong to the user's team ('Test Team'). POST /api/tasks/mytasks - get user's tasks", async () => {
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
    const task1 = new Task(testTask1);
    const task2 = new Task(testTask2);
    const task3 = new Task(testTask3);
    const task4 = new Task(testTask4);
    const task5 = new Task(testTask5);
    const task6 = new Task(testTask6);
    const task1InDB = await task1.save();
    const task2InDB = await task2.save();
    const task3InDB = await task3.save();
    const task4InDB = await task4.save();
    const task5InDB = await task5.save();
    const task6InDB = await task6.save();
    const taskIds1 = [task1InDB._id, task2InDB._id];
    const taskIds2 = [task3InDB._id, task4InDB._id];
    const taskIds3 = [task5InDB._id, task6InDB._id];
    const taskList1InDB = await TaskList.create({
      ...testTaskList1,
      tasks: taskIds1,
    });
    const taskList2InDB = await TaskList.create({
      ...testTaskList2,
      tasks: taskIds2,
    });
    const taskList3InDB = await TaskList.create({
      ...testTaskList3,
      tasks: taskIds3,
    });

    // when
    const response = await request(app)
      .get("/api/tasklists")
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("Hatos szorzótábla eleje");
    expect(response.body[1].name).toBe("Hatos szorzótábla közepe");
  });
});
