import { getIssues, getIssueById } from "../controller/issue.js";

const issueRouter = (app) => {
  app.get("/issues", getIssues);
  app.get("/issue/:id", getIssueById);
};

export default issueRouter;
