import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";
import { PROMPT_LIST } from "./prompts";
import { RESOURCE_LIST } from "./resources";
import { TOOL_LIST } from "./tools";

export class McpServerFactory {
  private server: McpServer;

  constructor(serverInfo?: Implementation, options?: ServerOptions) {
    this.server = new McpServer(
      {
        name: "job-app-mcp",
        version: "1.0.0",
        ...serverInfo,
      },
      { capabilities: { logging: {} }, ...options }
    );

    this.registerAll();
  }

  /**
   * Get the configured instance of mcp server from the factory.
   * @returns The instance of mcp server.
   */
  public getServer(): McpServer {
    return this.server;
  }

  /**
   * Register all primitives and binding
   */
  private registerAll() {
    this.registerBinding();
    this.registerAllTools();

    this.registerAllResources();
    this.registerAllPrompts();
  }

  /**
   * Register error handling
   */
  private registerBinding() {
    this.server.server.onerror = console.error.bind(console);
  }

  /**
   * Register all tools from the tool list
   */
  private registerAllTools() {
    for (const tool of TOOL_LIST) {
      this.server.tool(tool.name, tool.description, tool.schema, tool.handler);
    }
  }

  /**
   * Register all resources from the resource list
   */
  private registerAllResources() {
    for (const resource of RESOURCE_LIST) {
      this.server.resource(
        resource.name,
        resource.uri,
        resource.options,
        resource.handler
      );
    }
  }

  /**
   * Register all prompts from prompt list
   */
  private registerAllPrompts() {
    for (const prompt of PROMPT_LIST) {
      this.server.prompt(
        prompt.name,
        prompt.description,
        prompt.schema,
        prompt.handler
      );
    }
  }
}

const factory = new McpServerFactory();
export { factory };
