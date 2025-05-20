import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

const mainSchema = z.object({
  email: z.string().email().describe("User's email"),
  password: z.string().min(6).describe("User's password"),
  name: z.string().min(2).describe("User's name"),
});

const optionalSchema = mainSchema.partial();

const userId = z.string().nonempty().describe("User's id");
const userToken = z
  .string()
  .nonempty()
  .describe("User jwt token acquired from login");

const readSchemma = z.object({
  userId,
  userToken,
});
export const getSelfDetailUser: McpPrimitive = {
  register(server) {
    server.tool(
      "user-get-detail-self",
      "User get details about their self",
      readSchemma.shape,
      async ({ userId, userToken }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
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
                text: `Error getting the self user details: ${error.message}`,
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
  userId,
  userToken,
});
export const updateSelfUserDetails: McpPrimitive = {
  register(server) {
    server.tool(
      "user-edit-self-detail",
      "User edit details about their self",
      updateSchema.shape,
      async ({
        userId,
        userToken,
        name,
        email,
        password,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ name, email, password }),
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error editing the self user details: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
