import request from "supertest";
import app from "../src/app.js";
import {
  issueHistoryDataList,
  issueHistory12,
  newIssueHistoryData,
} from "./__mock__/issue.data.js";
import db from "./dbhandler.js";
import { errorCodes } from "../src/config/error.js";

const { ISSUE: issueErr } = errorCodes;

beforeAll(async () => await db.connect());
beforeEach(
  async () => await db.insertData("issuehistories", issueHistoryDataList)
);
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());

describe("GET Issue History by ID", () => {
  test("It should respond the issue of which ID is provided", async () => {
    const response = await request(app).get("/issueHistory/12");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(200);
    expect(data.length).toBe(2);
    expect(data).toMatchObject(issueHistory12.Updates);
  });

  test("It should respond 404 if the issue ID is not provided", async () => {
    const response = await request(app).get("/issueHistory/");
    const {
      statusCode,
      body: { data },
    } = response;
    expect(statusCode).toBe(404);
  });

  test("It should respond the 404 if issueID is incorrect or does not exist", async () => {
    const response = await request(app).get("/issueHistory/11111");
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(404);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_FOUND.errCode);
  });

  test("It should respond the 400 if issueID is not a valid number", async () => {
    const response = await request(app).get("/issueHistory/abc");
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_VALID.errCode);
  });
});

describe("POST a new IssueHistory", () => {
  test("It should create issue history in issueHistory database ", async () => {
    const response = await request(app)
      .post("/issueHistory/")
      .send(newIssueHistoryData);
    const { statusCode } = response;
    expect(statusCode).toBe(204);
  });
  test("It should respond the 400 if issueID is not a valid number", async () => {
    const response = await request(app)
      .post("/issueHistory/")
      .send({ ...newIssueHistoryData, IssueId: "mdksds" });
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_VALID.errCode);
  });
});

describe("PUT history for updated Issue", () => {
  test("It should create issue history in issueHistory database ", async () => {
    const response = await request(app)
      .put("/issueHistory/")
      .send(newIssueHistoryData);
    const { statusCode } = response;
    expect(statusCode).toBe(204);
  });
  test("It should respond the 400 if issueID is not a valid number", async () => {
    const response = await request(app)
      .put("/issueHistory/")
      .send({ ...newIssueHistoryData, IssueId: "mdksds" });
    const {
      statusCode,
      body: { data, errCode },
    } = response;
    expect(statusCode).toBe(400);
    expect(errCode).toBe(issueErr.ISSUE_ID_NOT_VALID.errCode);
  });
});
