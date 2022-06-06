import {
  getIssueHistoryById,
  createAndUpdateIssueHistory,
} from "../controller/issueHistory.js";

const issueHistoryRouter = (app) => {
       app.get("/lols", async (req,res) => {
       console.log(" lols in history has passed   ");
return  res.status(200).json({
      success: true,
      msg: `lols in history has passed`,
    });
    
   });

   
  app.get("/issueHistory/:id", getIssueHistoryById);
  app.post("/issueHistory", createAndUpdateIssueHistory);
  app.put("/issueHistory", createAndUpdateIssueHistory);
};

export default issueHistoryRouter;
