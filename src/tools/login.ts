import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const schema = {
  email: z.string().email().describe("Email for user/admin login into JobApp"),
  password: z.string().describe("Password for user/admin login into JobApp"),
};

export const loginTool: McpPrimitive = {
  register(server) {
    server.tool(
      "public-login",
      "Login to JobApp Rest API for admin and user",
      schema,
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
