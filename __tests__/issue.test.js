import request from "supertest";
import app from "../app.js";
import { issueData } from "./__mock__/issue.data.js";
import db from "./dbhandler.js";

beforeAll(async () => await db.connect());
beforeEach(async () => await db.insertData("issues", issueData));
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("GET Issues", () => {
  test("It should respond with all the issues without any filter", async () => {
    const response = await request(app).get("/issues");
    console.log(response.body);
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(3);
  });
});
