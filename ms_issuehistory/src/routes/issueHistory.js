import {
  getIssueHistoryById,
  createAndUpdateIssueHistory,
} from "../controller/issueHistory.js";

const issueHistoryRouter = (app) => {
  app.get("/issueHistory/:id", getIssueHistoryById);
  app.post("/issueHistory", createAndUpdateIssueHistory);
  app.put("/issueHistory", createAndUpdateIssueHistory);
};

export default issueHistoryRouter;
