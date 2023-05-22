import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import jwt from "jsonwebtoken";
import { User, UserType } from "../models/UserSchema";
import { Task, TaskType } from "../models/TaskSchema";
import { TaskList, TaskListType } from "../models/TaskListSchema";
import { Solution, SolutionType } from "../models/SolutionSchema";

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

const testSolution1: SolutionType = {
  taskId: undefined,
  taskListId: undefined,
  studentId: undefined,
  team: "Test Team",
  answer: "6",
  teacherComment: "ok",
  points: 1,
  duringTime: 30,
  correct: true,
  checked: true,
  usedHints: 0,
  ip: "84.3.216.142",
  date: new Date("2023-04-25T00:00:00.000Z").getTime(),
};

const testSolution2: SolutionType = {
  taskId: undefined,
  taskListId: undefined,
  studentId: undefined,
  team: "Test Team",
  answer: "12",
  teacherComment: "ok",
  points: 2,
  duringTime: 15,
  correct: false,
  checked: false,
  usedHints: 0,
  ip: "84.3.216.142",
  date: new Date("2023-04-26T00:00:00.000Z").getTime(),
};

const secretKey = process.env.JWT_SECRET || "secret";

describe("statistics router test", () => {
  beforeAll(connect);
  afterEach(cleanData);
  afterAll(disconnect);

  it("should send the user's statistics. POST /api/statistics - get user's statistics", async () => {
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

    const task1InDB = await task1.save();
    const task2InDB = await task2.save();

    const taskIds = [task1InDB._id, task2InDB._id];

    const taskListInDB = new TaskList({
      ...testTaskList1,
      tasks: taskIds,
    });
    const taskListInDBWithId = await taskListInDB.save();

    const taskListId = taskListInDBWithId._id;
    const studentId = userInDB._id;
    const solution1 = {
      ...testSolution1,
      taskId: task1InDB._id,
      taskListId,
      studentId,
    };
    const solution1InDB = await Solution.create(solution1);
    const solution2 = {
      ...testSolution2,
      taskId: task2InDB._id,
      taskListId,
      studentId,
    };
    const solution2InDB = await Solution.create(solution2);

    const start = new Date("2023-04-20T00:00:00.000Z").getTime();
    const end = new Date("2023-04-30T00:00:00.000Z").getTime();

    // when
    const response = await request(app)
      .post("/api/statistics")
      .set("Authorization", `Bearer ${token}`)
      .send({ start, end });
    console.log("response.body", response.body);
    
    // then
    expect(response.status).toBe(200);
    expect(response.body.practiceTime).toStrictEqual([
      { date: "2023-04-25", time: 0.5 },
      { date: "2023-04-26", time: 0.25 },      
      { date: "2023-04-20", time: 0 },
      { date: "2023-04-21", time: 0 },
      { date: "2023-04-22", time: 0 },
      { date: "2023-04-23", time: 0 },
      { date: "2023-04-24", time: 0 },
      { date: "2023-04-27", time: 0 },
      { date: "2023-04-28", time: 0 },
      { date: "2023-04-29", time: 0 },
      { date: "2023-04-30", time: 0 },
    ]);
    expect(response.body.solvedTasks).toBe(2);
    expect(response.body.correctTasks).toBe(1);
    expect(response.body.points).toStrictEqual([
      { date: "2023-04-25", point: 1 },
      { date: "2023-04-26", point: 2 },
      { date: "2023-04-20", point: 0 },
      { date: "2023-04-21", point: 0 },
      { date: "2023-04-22", point: 0 },
      { date: "2023-04-23", point: 0 },
      { date: "2023-04-24", point: 0 },
      { date: "2023-04-27", point: 0 },
      { date: "2023-04-28", point: 0 },
      { date: "2023-04-29", point: 0 },
      { date: "2023-04-30", point: 0 },
    ]);
    expect(response.body.pointRankInTeam).toBe(1); 
  });
});
