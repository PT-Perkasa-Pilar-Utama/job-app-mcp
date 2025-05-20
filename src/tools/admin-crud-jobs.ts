import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const mainSchema = z.object({
  title: z.string().min(2).describe("Job's title"),
  description: z.string().min(10).describe("Job's brief description"),
  company: z.string().min(2).describe("Company name"),
  location: z.string().min(2).describe("Location (state/country)"),
  salary: z.string().optional().describe("Salary for the job (monthly)"),
  type: z
    .enum(["full-time", "part-time", "contract", "internship", "remote"])
    .describe("Job's type"),
});

const optionalSchema = mainSchema.partial();
const jobId = z.string().nonempty().describe("The job id");
const adminToken = z
  .string()
  .nonempty()
  .describe("Admin jwt token acquired from login");

const createSchema = mainSchema.extend({
  adminToken,
});

export const createJob: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-create-job-listing",
      "Admin create job listing for user to apply",
      createSchema.shape,
      async ({
        title,
        description,
        company,
        location,
        salary,
        type,
        adminToken,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp("/api/jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },

            body: JSON.stringify({
              title,
              description,
              company,
              location,
              salary,
              type,
            }),
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error creating the job: ${error.message}`,
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
  jobId,
  adminToken,
});

export const updateJob: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-edit-job-listing",
      "Admin edit job listing",
      updateSchema.shape,
      async ({
        jobId,
        title,
        description,
        company,
        location,
        salary,
        type,
        adminToken,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/jobs/${jobId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },

            body: JSON.stringify({
              title,
              description,
              company,
              location,
              salary,
              type,
            }),
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error editing the job: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

const deleteSchema = z.object({
  jobId,
  adminToken,
});

export const deleteJob: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-delete-job-listing",
      "Admin delete job listing",
      deleteSchema.shape,
      async ({ jobId, adminToken }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/jobs/${jobId}`, {
            method: "DELETE",
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
                text: `Error deleting the job: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
