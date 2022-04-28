import mongoose from "mongoose";
import { issueSchema } from "../models/issue.js";

const issueDetails = mongoose.model("issues", issueSchema);

export const getIssues = async (req, res) => {
  try {
    const data = await issueDetails.find();
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });
  }
};

/*
logger.log("info", "Results not found after searching");
return res.status(200).json({
  success: false,
  err: true,
  errorcode : maybe
  message: "Result not found",
}); */
