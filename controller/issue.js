import { issueModel } from "../models/issue.js";

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
    const data = await issueModel.find(queryParam);
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


export const getIssueById = (req, res) => {
  /*  try {
    const { project, type } = req.query;
    const queryParam = {};
    if (project) {
      queryParam.Project = project;
    }
    if (type) {
      queryParam.IssueType = type;
    }
    const data = await issueModel.find(queryParam);
    res.json({
      success: true,
      data,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      msg: `Internal server error`,
    });
  } */
};

/*
logger.log("info", "Results not found after searching");
return res.status(200).json({
  success: false,
  err: true,
  errorcode : maybe
  message: "Result not found",
}); */
