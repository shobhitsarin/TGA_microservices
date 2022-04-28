import { issueModel } from "../models/issue.js";
import logger from "../../utils/logger.js";
/**
 * @openapi
 * /issues:
 *  get:
 *    tags:
 *    - Issues
 *    description: Responds with all issues based on Project and Type
 *    parameters:
 *     - name: project
 *       in: query
 *       description: Name of the project
 *       required: false
 *     - name: type
 *       in: query
 *       description: Type of the issue
 *       required: false
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Issue'
 */
export const getIssues = async (req, res) => {
  try {
    const { project, type } = req.query;
    const queryParam = {};
    if (project) {
      queryParam.Project = project;
    }
    if (type) {
      queryParam.IssueType = type;
    }
    logger.info("queryParam " + queryParam);
    const data = await issueModel.find(queryParam);
    logger.info("data length " + data.length);
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    logger.error("Error in getIssues", e);
    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });
  }
};

const normalizeIssueId = (val) => {
  let issueId = parseInt(val, 10);
  if (isNaN(issueId)) {
    return false;
  }

  if (issueId > 0) {
    // port number
    return issueId;
  }

  return false;
};

/**
 * @openapi
 * /issue/{id}:
 *  get:
 *    tags:
 *    - Issues
 *    description: Responds with the issue based on IssueID
 *    parameters:
 *     - name: id
 *       in: path
 *       description: ID of the Issue
 *       required: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/Issue'
 *      404:
 *        description: Issue not found when ID is incorrect or Issue is deleted
 */
export const getIssueById = async (req, res) => {
  try {
    let { id: IssueId } = req.params;
    IssueId = normalizeIssueId(IssueId);
    logger.info("IssueId " + IssueId);
    if (IssueId) {
      const data = await issueModel.findOne({ IssueId });
      if (data && data.IssueId) {
        logger.info("data " + IssueId);
        res.json({
          success: true,
          data,
        });
      } else {
        logger.error("Issue not found");
        res.status(404).json({
          success: false,
          data: {
            mssg: "Data not found",
          },
        });
      }
    } else {
      logger.error("ID not sent as valid number in getIssueById");
      res.status(404).json({
        success: false,
        data: {
          mssg: "Issue ID is not a valid number",
        },
      });
    }
  } catch (e) {
    logger.error("Error in getIssueById "+ e);
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
