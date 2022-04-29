import request from "supertest";
import app from "../src/app.js";
import {
  issueDataList,
  issueData12,
  issueData13,
  issueData14,
  newIssueData,
} from "./__mock__/issue.data.js";
import db from "./dbhandler.js";
import { errorCodes } from "../config/error.js";
import loggerObj from "../utils/logger.js";

const { ISSUE: issueErr } = errorCodes;

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

  test("It should respond all the issues with project filter", async () => {
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

  test("It should respond all the issues with Type filter", async () => {
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
      body: { data, errCode },
    } = response;
    expect(data.length).toBe(0);
    expect(statusCode).toBe(404);
    expect(errCode).toBe(issueErr.ISSUE_NOT_FOUND_FILTER.errCode);
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
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(404);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_FOUND.errCode);
  });

  test("It should respond the 400 if issueID is not a valid number", async () => {
    const response = await request(app).get("/issue/abc");
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_VALID.errCode);
  });
});

describe("POST a new Issue", () => {
  test("It should respond the new created issue of with its issue ID", async () => {
    const response = await request(app).post("/issue/").send(newIssueData);
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(201);
    expect(data.IssueId).toBe(1);
    expect(data).toMatchObject(newIssueData);
  });
  test("It should respond with error if the Required issue Details are missing", async () => {
    const missingData = { ...newIssueData };
    delete missingData["Status"];
    const response = await request(app).post("/issue/").send(missingData);
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_DATA_MISSING.errCode);
  });
});

describe("Update an existing Issue", () => {
  test("It should respond the updated issue", async () => {
    const Title = "This is the new title";
    const response = await request(app)
      .put("/issue/12")
      .send({
        ...issueData12,
        Title,
      });
    const { statusCode } = response;
    expect(statusCode).toBe(204);
  });
  test("It should respond 404 if the issue ID is not provided", async () => {
    const response = await request(app).put("/issue/");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(404);
  });

  test("It should respond the 404 if issueID is incorrect or does not exist", async () => {
    const response = await request(app).put("/issue/" + 1111);
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(404);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_FOUND.errCode);
  });

  test("It should respond the 400 if issueID is not a valid number", async () => {
    const response = await request(app).put("/issue/abc");
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_VALID.errCode);
  });
});
