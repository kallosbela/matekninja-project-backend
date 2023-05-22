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
import { getTokenObject } from "../utils/getTokenObject";

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
  "name": "Hatos szorzótábla",
  "text": "Mennyi $6\\cdot1\\ =\\ ?$",
  "illustration": [],
  "listen_text": "Mennyi hatszor egy?",
  "hints": [],
  "answer": ["6"],
  "score": 1,
  "tags": [
    "szorzás"
  ],
  "type": "one number",
}
const testTask2 = {
  "name": "Hatos szorzótábla",
  "text": "Mennyi $6\\cdot2\\ =\\ ?$",
  "illustration": [],
  "listen_text": "Mennyi hatszor kettő?",
  "hints": [],
  "answer": ["12"],
  "score": 1,
  "tags": [
    "szorzás"
  ],
  "type": "one number"}

const testTask3 = {
  "name": "Hatos szorzótábla",
  "text": "Mennyi $6\\cdot3\\ =\\ ?$",
  "illustration": [],
  "listen_text": "Mennyi hatszor három?",
  "hints": [],
  "answer": ["18"],
  "score": 1,
  "tags": ["szorzás"],
  "type": "one number"}

const testTaskList: TaskListType = {
  name: "Hatos szorzótábla",
  tasks: [],
  sequence: "random",
  startTime: new Date("2023-01-01T00:00:00.000Z"),
  deadline: new Date("2023-12-31T00:00:00.000Z"),
  team: "Test Team",
  teacher: "test Teacher"
};

const secretKey = process.env.JWT_SECRET || "secret";

describe("user router test", () => {
  beforeAll(connect);
  afterEach(cleanData);
  afterAll(disconnect);

  it("should send the user's tasks (task1 and task2) that have their IDs included in the request body. POST /api/tasks/mytasks - get user's tasks", async () => {
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
  const task1InDB = await task1.save();
  const task2InDB = await task2.save();
  const task3InDB = await task3.save();
  const taskIds = [task1InDB._id, task2InDB._id];

  // when
  const response = await request(app)
    .post("/api/tasks/mytasks")
    .set("Authorization", `Bearer ${token}`)
    .send({ taskIds });

  // then
  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(2);
  expect(response.body[0].text).toBe("Mennyi $6\\cdot1\\ =\\ ?$");
  expect(response.body[1].text).toBe("Mennyi $6\\cdot2\\ =\\ ?$");
  });

  it("should send the user's tasks from the testTaskList. The testTaskList ID included in the request params. POST /api/tasks/:id - get user's tasks", async () => {
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
    const task1InDB = await task1.save();
    const task2InDB = await task2.save();
    const task3InDB = await task3.save();
    const taskIds = [task1InDB._id, task2InDB._id, task3InDB._id];
    testTaskList.tasks = taskIds;
    const taskList = new TaskList(testTaskList);
    const taskListInDB = await taskList.save();
  
    // when
    const response = await request(app)
      .post(`/api/tasks/${taskListInDB._id}`)
      .set("Authorization", `Bearer ${token}`)
  
    // then
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0].text).toBe("Mennyi $6\\cdot1\\ =\\ ?$");
    expect(response.body[1].text).toBe("Mennyi $6\\cdot2\\ =\\ ?$");
    expect(response.body[2].text).toBe("Mennyi $6\\cdot3\\ =\\ ?$");
    });
});