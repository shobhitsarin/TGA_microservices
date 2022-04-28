import request from "supertest";
import app from "../app.js";
import {
  issueDataList,
  issueData12,
  issueData13,
  issueData14,
} from "./__mock__/issue.data.js";
import db from "./dbhandler.js";

beforeAll(async () => await db.connect());
beforeEach(async () => await db.insertData("issues", issueDataList));
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
    expect(data[0]).toMatchObject(issueData12);
    expect(data[1]).toMatchObject(issueData13);
  });

  test("It should respond all the issues without Type filter", async () => {
    const response = await request(app).get("/issues?type=Story");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(2);
    expect(data[0]).toMatchObject(issueData12);
    expect(data[1]).toMatchObject(issueData14);
  });

  test("It should respond all the issues with both Type and Project filter", async () => {
    const response = await request(app).get("/issues?project=TGA&type=Story");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(1);
    expect(data[0]).toMatchObject(issueData12);
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

describe("GET Issue by ID", () => {
  test("It should respond the issue of which ID is provided", async () => {
    const response = await request(app).get("/issue/12");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data).toMatchObject(issueData12);
  });

  test("It should respond 404 if the issue ID is not provided", async () => {
    const response = await request(app).get("/issue/");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(404);
  });

  test("It should respond the 404 if issueID is incorrect or does not exist", async () => {
    const response = await request(app).get("/issue/11111");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(404);
  });

  test("It should respond the 404 if issueID is not a valid number", async () => {
    const response = await request(app).get("/issue/abc");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(404);
  });
});
