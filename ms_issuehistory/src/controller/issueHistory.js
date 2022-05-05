import { issueHistoryModel } from "../models/issueHistory.js";
import logger from "../utils/logger.js";
import { errorCodes } from "../config/error.js";

const { ISSUE: issueErr } = errorCodes;
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
 * /issueHistory/{id}:
 *  get:
 *    tags:
 *    - IssueHistory
 *    description: Responds with the issue Hisotry based on IssueID
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
 *                $ref: '#/components/schemas/IssueHistory'
 *      400:
 *        description: Bad Request when ID is not a valid number  errCode:2400
 *      404:
 *        description: Issue not found when ID is incorrect or Issue is deleted  errCode:2404
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
export const getIssueHistoryById = async (req, res) => {
  try {
    let { id: IssueId } = req.params;
    IssueId = normalizeIssueId(IssueId);
    logger.info("IssueId " + IssueId);
    if (IssueId) {
      const { Updates = [] } =
        (await issueHistoryModel.findOne({ IssueId })) || {};
      if (Updates && Updates.length) {
        logger.info("data " + Updates);
        res.json({
          success: true,
          data: Updates,
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
    logger.error("Error in getIssueHistoryById " + e);

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
 * /issueHistory/:
 *  post:
 *    tags:
 *    - IssueHistory
 *    description: Submits a new Issue
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/IssueHistory'
 *    responses:
 *      204:
 *        description: Created Successfully
 *      400:
 *        description: Bad Request when ID is not a valid number  errCode:2400
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
/**
 * @openapi
 * /issueHistory/:
 *  put:
 *    tags:
 *    - IssueHistory
 *    description: Submits a new Issue
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/IssueHistory'
 *    responses:
 *      204:
 *        description: Created Successfully
 *      400:
 *        description: Bad Request when ID is not a valid number  errCode:2400
 *      500:
 *        description: Internal Server Error, errCode:1500
 */
export const createAndUpdateIssueHistory = async (req, res) => {
  try {
    const {
      body: { IssueId, Updates },
    } = req;
    const issueId = normalizeIssueId(IssueId);
    if (issueId) {
      const data = await issueHistoryModel.findOneAndUpdate(
        { IssueId },
        { $push: { Updates: Updates[0] } },
        { upsert: true }
      );
      res.status(204).send({
        success: true,
        data,
      });
    } else {
      logger.error(
        "ID not sent as valid number in createAndUpdateIssueHistory"
      );
      const { errCode, errMsg } = issueErr.ISSUE_ID_NOT_VALID;
      res.status(400).json({
        success: false,
        data: {},
        errCode,
        errMsg,
      });
    }
  } catch (e) {
    logger.error("Caught Error in createAndUpdateIssueHistory " + e);

    const { errCode, errMsg } = issueErr.INTERNAL_SERVER_ERROR;

    res.status(500).json({
      success: false,
      errCode,
      errMsg,
    });
  }
};
