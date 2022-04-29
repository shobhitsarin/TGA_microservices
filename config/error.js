export const errorCodes = {
  /* PROJECT: {
    PROJECT_NOT_FOUND: {
      errCode: 1404,
      errMsg: "Project not found",
    },
  }, */
  ISSUE: {
    INTERNAL_SERVER_ERROR: {
      errCode: 1500,
      errMsg: "Something went wrong",
    },
    ISSUE_ID_NOT_FOUND: {
      errCode: 2404,
      errMsg: "Issue Not found by ID",
    },
    ISSUE_NOT_FOUND_FILTER: {
      errCode: 2405,
      errMsg: "Issue Not found by Filters",
    },
    ISSUE_ID_NOT_VALID: {
      errCode: 2400,
      errMsg: "Issue ID not valid",
    },
    ISSUE_DATA_MISSING: {
      errCode: 3400,
      errMsg: "Issue DATA is missing required fields",
    },
    ISSUE_DATA_CONFLICT: {
      errCode: 3409,
      errMsg: "Issue DATA is having conflict with other request",
    },
  },
};
