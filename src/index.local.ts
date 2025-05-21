import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { factory } from "./mcp.factory";

const server = factory.getServer();
const transport = new StdioServerTransport();
await server.connect(transport);
