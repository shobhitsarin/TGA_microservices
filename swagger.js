import { swaggerIssueSchema } from "./models/issue.js";

export default {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Issue Management System By Shobhit Sarin",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: `http://localhost:3000`,
      },
    ],
    components: {
      schemas: swaggerIssueSchema,
    },
  },
  apis: ["./controller/*.js"],
};
