import { getIssues } from "../controller/issue.js";

const issueRouter = (app) => {
  app.get("/issues", getIssues);
};

export default issueRouter;
