import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const schema = {
  jobId: z.string().nonempty().describe("Job id where the user wants to apply"),
  coverLetter: z
    .string()
    .nonempty()
    .describe(
      "Cover letter of the appplying user, could be simple description or link to the document"
    ),
  resume: z
    .string()
    .nonempty()
    .describe(
      "Resume of the appplying user, could be simple description or link to the document"
    ),
  userToken: z
    .string()
    .nonempty()
    .describe("User jwt token acquired from login"),
};

export const applyForJobTool: McpPrimitive = {
  register(server) {
    server.tool(
      "user-apply-for-job",
      "User apply for available job specified in jobId",
      schema,
      async ({
        jobId,
        coverLetter,
        resume,
        userToken,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp("/api/applications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },

            body: JSON.stringify({ jobId, resume, coverLetter }),
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              { type: "text", text: `Error logging in: ${error.message}` },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
