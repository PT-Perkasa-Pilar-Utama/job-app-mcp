import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface McpPrimitive {
  register: (server: McpServer) => any;
}
