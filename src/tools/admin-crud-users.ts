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

const userId = z.string().nonempty().describe("User id");
const role = z.enum(["admin", "user"]).default("user");

const adminToken = z
  .string()
  .nonempty()
  .describe("Admin jwt token acquired from login");

const readSchema = z.object({
  adminToken,
});

export const getAllUsers: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-get-all-registered-users",
      "Admin getting all users registered in the system",
      readSchema.shape,
      async ({ adminToken }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users`, {
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
                text: `Error getting all the users registered: ${error.message}`,
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
  userId,
});

export const getDetailUser: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-get-detail-user",
      "Admin getting details about the user specified by the id",
      detailedReadSchema.shape,
      async ({ adminToken, userId }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users/${userId}`, {
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
                text: `Error getting the detail user of specified id: ${error.message}`,
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
  adminToken,
  role,
});

export const updateUser: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-update-user",
      "Admin update details of user specified by the id",
      updateSchema.shape,
      async ({
        adminToken,
        userId,
        role,
        name,
        email,
        password,
      }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({ name, email, password, role }),
          });

          return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: "text",
                text: `Error updating the detail user of specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};

export const deleteUser: McpPrimitive = {
  register(server) {
    server.tool(
      "admin-delete-user",
      "Admin delete the specified user by id",
      detailedReadSchema.shape,
      async ({ adminToken, userId }): Promise<CallToolResult> => {
        try {
          const result = await fetchFromJobApp(`/api/users/${userId}`, {
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
                text: `Error deleting the user of specified id: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
