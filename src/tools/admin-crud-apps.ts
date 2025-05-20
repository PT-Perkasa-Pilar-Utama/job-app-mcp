import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const applicationId = z.string().nonempty().describe("Job application id");
const adminToken = z
  .string()
  .nonempty()
  .describe("Admin jwt token acquired from login");

const readSchema = z.object({
  adminToken,
});

export const getAllJobAplication: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-get-all-job-application",
      "Admin getting all application received from user",
      readSchema.shape,
      async ({ adminToken }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/applications`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error getting all the application received: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

const detailedReadSchema = readSchema.extend({
  applicationId,
});

export const getDetailJobAplication: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-get-detail-job-application",
      "Admin getting details about application specified by the id",
      detailedReadSchema.shape,
      async ({ adminToken, applicationId }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(
            `/api/applications/${applicationId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
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
                text: `Error getting the detail application of specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

const updateStatusSchema = detailedReadSchema.extend({
  status: z
    .enum(["pending", "reviewed", "accepted", "rejected"])
    .describe("Job application status"),
});
export const updateJobApplicationStatus: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-update-application-status",
      "Admin update application status to whether pending, reviewed, accepted, rejected",
      updateStatusSchema.shape,
      async ({
        adminToken,
        applicationId,
        status,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(
            `/api/applications/${applicationId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
              },
              body: JSON.stringify({ status }),
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
                text: `Error updating the application status of specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

export const deleteJobApplication: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-delete-application",
      "Admin delete the specified application by id",
      detailedReadSchema.shape,
      async ({ adminToken, applicationId }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(
            `/api/applications/${applicationId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
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
                text: `Error deleting the application of specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
