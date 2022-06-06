import {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../controller/issue.js";
import fetch from "node-fetch";
import logger from "../utils/logger.js";


const issueRouter = (app) => {

     app.get("/lols", async (req,res) => {
      logger.error("lols has passed  ");
return  res.status(200).json({
      success: true,
      msg: `lols has passed`,
    });
    
   });


     app.get("/lolhistory", async (req,res) => {
try {
  logger.error("lolhistory has started ");
    const resp = await fetch(process.env.LOLS_API,{
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    const response = await resp.json();



 logger.error("lolhistory has got response ");
   logger.error(JSON.stringify(response));


    if(response) {
      logger.error("lolhistory has got response and coming back now...");
     return  res.status(200).json({
      success: true,
      msg: response,
    });
    } else {
      logger.error("lolhistory has partially failed ");
               return    res.status(500).json({
      success: false,
      msg: `Partial Internal server error`,
    });
    }
} catch (e) {
    logger.error("lol has failed ");
        logger.error(e);

         return    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });

}

   });

   app.get("/lolo", async (req,res) => {
try {
  logger.error("lolo has started ");
    const response = await fetch(process.env.LOLO_API,{
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

        const resp = await response.json();


 logger.error("lolo has got response ");
  logger.error(JSON.stringify(resp));

    if(resp) {
      logger.error("lolo has got response and coming back now...");
     return  res.status(200).json({
      success: true,
      msg: resp,
    });
    } else {
      logger.error("lolo has partially failed ");
               return    res.status(500).json({
      success: false,
      msg: `Partial Internal server error`,
    });
    }
} catch (e) {
    logger.error("lolo has failed ");
        logger.error(e);

         return    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });

}

   });


   app.get("/lolapi", async (req,res) => {
try {
  logger.error("lolo has started ");
    const response = await fetch('https://sandbox.api.service.nhs.uk/hello-world/hello/world',{
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

        const resp = await response.json();


 logger.error("lolo has got response ");
  logger.error(JSON.stringify(resp));

    if(resp) {
      logger.error("lolo has got response and coming back now...");
     return  res.status(200).json({
      success: true,
      msg: resp,
    });
    } else {
      logger.error("lolo has partially failed ");
               return    res.status(500).json({
      success: false,
      msg: `Partial Internal server error`,
    });
    }
} catch (e) {
    logger.error("lolo has failed ");
        logger.error(e);

         return    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });

}s

   });

  app.get("/issues", getIssues);
  app.get("/issue/:id", getIssueById);
  app.post("/issue", createIssue);
  app.put("/issue/:id", updateIssue);
  app.delete("/issue/:id", deleteIssue);
};

export default issueRouter;
