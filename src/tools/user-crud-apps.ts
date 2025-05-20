import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const mainSchema = z.object({
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
});

const optionalSchema = mainSchema.partial();
const applicationId = z.string().nonempty().describe("Job application id");
const userToken = z
  .string()
  .nonempty()
  .describe("User jwt token acquired from login");

const createApplicationSchema = mainSchema.extend({
  jobId: z.string().nonempty().describe("Job's id"),
  userToken,
});

export const applyJob: McpPrimitive = {
  register(server) {
    server.tool(
      "user-apply-job",
      "User apply for available job specified in jobId",
      createApplicationSchema.shape,
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
              {
                type: "text",
                text: `Error applying the job: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

const readSchemma = z.object({
  applicationId,
  userToken,
});
export const getSelfDetailApplication: McpPrimitive = {
  register(server) {
    server.tool(
      "user-get-detail-job-application",
      "User get details about their application specified by the id",
      readSchemma.shape,
      async ({ applicationId, userToken }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(
            `/api/applications/${applicationId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error getting the application details for the specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

const updateSchema = optionalSchema.extend({
  applicationId,
  userToken,
});
export const updateSelfJobApplication: McpPrimitive = {
  register(server) {
    server.tool(
      "user-edit-job-application",
      "User edit details about their application specified by the id",
      updateSchema.shape,
      async ({
        applicationId,
        userToken,
        resume,
        coverLetter,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(
            `/api/applications/${applicationId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
              body: JSON.stringify({ resume, coverLetter }),
            }
          );

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error editing the application details for the specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
