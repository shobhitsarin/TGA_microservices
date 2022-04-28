import request from "supertest";
import app from "../app.js";
import { issueData } from "./__mock__/issue.data.js";
import db from "./dbhandler.js";

beforeAll(async () => await db.connect());
beforeEach(async () => await db.insertData("issues", issueData));
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("GET Issues", () => {
  test("It should respond all the issues without any filter", async () => {
    const response = await request(app).get("/issues");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(3);
  });

  test("It should respond all the issues without project filter", async () => {
    const response = await request(app).get("/issues?project=TGA");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(2);
  });

  test("It should respond all the issues without Type filter", async () => {
    const response = await request(app).get("/issues?type=Story");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(2);
  });

  test("It should respond all the issues with both Type and Project filter", async () => {
    const response = await request(app).get("/issues?project=TGA&type=Story");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(1);
  });

  test("It should respond all the issues without EMPTY Type and Project filter", async () => {
    const response = await request(app).get("/issues?project=&type=");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(3);
  });

  test("It should respond all the issues without Incorrect Type and Project filter", async () => {
    const response = await request(app).get("/issues?project=Incorrect");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(0);
  });
});
