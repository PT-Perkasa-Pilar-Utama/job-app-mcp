import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const schema = z.object({
  email: z.string().email().describe("Email for user/admin login into JobApp"),
  password: z.string().describe("Password for user/admin login into JobApp"),
});

export const login: McpPrimitive = {
  register(server) {
    server.tool(
      "public-login",
      "Login to JobApp Rest API for admin and user",
      schema.shape,
      async ({ email, password }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp("/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
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

export const index: McpPrimitive = {
  register(server) {
    server.tool(
      "public-check-host",
      "Check the JobApp host is running or not",
      async (): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp("/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error checking the host: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

export const health: McpPrimitive = {
  register(server) {
    server.tool(
      "public-health-check-api",
      "Check the JobApp API service is running or not",
      async (): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp("/health", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error checking the health of the API service: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
