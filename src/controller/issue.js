import { issueModel } from "../models/issue.js";
import logger from "../utils/logger.js";
import { errorCodes } from "../config/error.js";
const { ISSUE: issueErr } = errorCodes;
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
 *      404:
 *        description: Issue not found based on Filters, errCode:2405
 *      500:
 *        description: Internal server Error, errCode:1500
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
    if (data && data.length) {
      res.json({
        success: true,
        data,
      });
    } else {
      const { errCode, errMsg } = issueErr.ISSUE_NOT_FOUND_FILTER;
      res.status(404).json({
        success: false,
        data: [],
        errCode,
        errMsg,
      });
    }
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
 *      400:
 *        description: Bad Request when ID is not a valid number  errCode:2400
 *      404:
 *        description: Issue not found when ID is incorrect or Issue is deleted  errCode:2404
 *      500:
 *        description: Internal Server Error, errCode:1500
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
        const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_FOUND;

        res.status(404).json({
          success: false,
          data: {},
          errCode,
          errMsg,
        });
      }
    } else {
      logger.error("ID not sent as valid number in getIssueById");
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_VALID;

      res.status(400).json({
        success: false,
        data: {},
        errCode,
        errMsg,
      });
    }
  } catch (e) {
    logger.error("Error in getIssueById " + e);

    const { errCode, errMsg } = issueErr.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      success: false,
      errCode,
      errMsg,
    });
  }
};
/**
 * @openapi
 * /issue/:
 *  post:
 *    tags:
 *    - Issues
 *    description: Submits a new Issue
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Issue'
 *    responses:
 *      201:
 *        description: Created Successfully
 *        content:
 *          application/json:
 *            schema:
 *                $ref: '#/components/schemas/Issue'
 *      400:
 *        description: Bad Request when data is missing parameters  errCode:3400
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
export const createIssue = async (req, res) => {
  try {
    const { body: issueData } = req;
    delete issueData["_id"];
    delete issueData["CreatedAt"];
    const newIssue = new issueModel(issueData);
    await newIssue.save((err, data) => {
      if (err) {
        const { errCode, errMsg } = issueErr.ISSUE_DATA_MISSING;
        logger.error("Missing Data Error in createIssue " + err);
        res.status(400).json({
          success: false,
          errCode,
          errMsg,
        });
      } else if (data) {
        logger.info("data inserted successfully");
        logger.info(data);
        res.status(201).json({
          success: true,
          data,
        });
      }
    });
  } catch (e) {
    logger.error("Caught Error in createIssue " + e);

    const { errCode, errMsg } = issueErr.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      success: false,
      errCode,
      errMsg,
    });
  }
};

/**
 * @openapi
 * /issue/{id}:
 *  put:
 *    tags:
 *    - Issues
 *    description: Updates an existing Issue
 *    parameters:
 *     - name: id
 *       in: path
 *       description: ID of the Issue
 *       required: true
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/Issue'
 *    responses:
 *      204:
 *        description: Updated Successfully
 *      400:
 *        description: Bad Request when invalid id of issue  errCode:3400
 *      404:
 *        description: Issue not found when ID is incorrect  errCode:2404
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
export const updateIssue = async (req, res) => {
  try {
    const { body: issueData, params } = req;
    let { id: IssueId } = params;
    delete issueData["CreatedAt"];
    delete issueData["_id"];
    delete issueData["IssueId"];
    IssueId = normalizeIssueId(IssueId);
    if (!IssueId) {
      logger.error("ID not sent as valid number in updateIssue");
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_VALID;
      res.status(400).json({
        success: false,
        data: {},
        errCode,
        errMsg,
      });
      return;
    }
    const data = await issueModel.findOneAndUpdate(
      {
        IssueId,
      },
      issueData
    );
    if (data) {
      res.status(204).send();
    } else {
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_FOUND;

      logger.error("Incorrect Issue ID to be updated ");
      res.status(404).json({
        success: false,
        errCode,
        errMsg,
      });
    }
  } catch (e) {
    logger.error("Caught Error in updating issue " + e);

    const { errCode, errMsg } = issueErr.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      success: false,
      errCode,
      errMsg,
    });
  }
};

/**
 * @openapi
 * /issue/{id}:
 *  delete:
 *    tags:
 *    - Issues
 *    description: Deletes an existing Issue
 *    parameters:
 *     - name: id
 *       in: path
 *       description: ID of the Issue
 *       required: true
 *    responses:
 *      204:
 *        description: Updated Successfully
 *      400:
 *        description: Bad Request when invalid id of issue  errCode:3400
 *      404:
 *        description: Issue not found when ID is incorrect  errCode:2404
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
export const deleteIssue = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;
    const IssueId = normalizeIssueId(id);
    if (!IssueId) {
      logger.error("ID not sent as valid number in updateIssue");
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_VALID;
      res.status(400).json({
        success: false,
        data: {},
        errCode,
        errMsg,
      });
      return;
    }
    const data = await issueModel.deleteOne({
      IssueId,
    });
    if (data && data.deletedCount) {
      res.status(204).send();
    } else {
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_FOUND;

      logger.error("Incorrect Issue ID to be updated ");
      res.status(404).json({
        success: false,
        errCode,
        errMsg,
      });
    }
  } catch (e) {
    logger.error("Caught Error in updating issue " + e);

    const { errCode, errMsg } = issueErr.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      success: false,
      errCode,
      errMsg,
    });
  }
};
