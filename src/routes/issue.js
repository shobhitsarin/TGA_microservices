import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
} from "../controller/issue.js";

const issueRouter = (app) => {
  app.get("/issues", getIssues);
  app.get("/issue/:id", getIssueById);
  app.post("/issue", createIssue);
  app.put("/issue/:id", updateIssue);
};

export default issueRouter;
