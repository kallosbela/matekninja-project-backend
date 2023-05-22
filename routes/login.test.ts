import dotenv from "dotenv";
dotenv.config();

import supertest from "supertest";
import app from "../app";
import { connect, disconnect, cleanData } from "./mongodb.memory.test.helper";
import { User } from "../models/UserSchema";

jest.mock("../api/getIdToken");
import { getIdToken } from "../api/getIdToken";

const testApp = supertest(app);

describe("Google login test", () => {
  beforeAll(connect);
  afterEach(cleanData);
  afterAll(disconnect);

  it("should return 200 and save user to the DB", async () => {
    // given
    const code = "as56df5w5a8d823djak";
    const token = process.env.TEST_TOKEN; // this is a valid token
    if (!token) throw new Error("Token not found");
    const mockedGetIdToken = jest.mocked(getIdToken);
    mockedGetIdToken.mockReturnValueOnce(Promise.resolve(token));
    // when
    const response = await supertest(app).post("/api/login").send({ code });
    // then
    const dbContent = await User.find();
    console.log("dbContent", dbContent);
    expect(dbContent).toHaveLength(1);
    expect(response.status).toBe(200);
  }, 10000);
});
