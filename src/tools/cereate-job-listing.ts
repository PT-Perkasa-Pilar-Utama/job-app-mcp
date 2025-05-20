import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const schema = {
  title: z.string().min(2).describe("Job's title"),
  description: z.string().min(10).describe("Job's brief description"),
  company: z.string().min(2).describe("Company name"),
  location: z.string().min(2).describe("Location (state/country)"),
  salary: z.string().optional().describe("Salary for the job (monthly)"),
  type: z
    .enum(["full-time", "part-time", "contract", "internship", "remote"])
    .describe("Job's type"),
  adminToken: z
    .string()
    .nonempty()
    .describe("Admin jwt token acquired from login"),
};

export const applyForJobTool: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-create-job-listing",
      "Admin create job listing for user to apply",
      schema,
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
