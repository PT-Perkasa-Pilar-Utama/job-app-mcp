import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import type {
  McpPrompt,
  McpRegistry,
  McpResource,
  McpTool,
} from "./mcp.primitive";

export class McpServerFactory {
  private server: McpServer;
  private registry: McpRegistry = {
    tools: [],
    resources: [],
    prompts: [],
  };

  constructor(serverInfo?: Implementation, options?: ServerOptions) {
    this.server = new McpServer(
      {
        name: "job-app-mcp",
        version: "1.0.0",
        ...serverInfo,
      },
      { capabilities: { logging: {} }, ...options }
    );

    this.registerBinding();
  }

  /**
   * Create a new instance of mcp server from the factory
   * @returns A new instance of mcp server
   */
  public create(): McpServer {
    this.registerAll();
    return this.server;
  }

  /**
   * Register all primitives from the registry to the server
   */
  private registerAll() {
    this.registerAllTools();
    this.registerAllResources();
    this.registerAllPrompts();
  }

  /**
   * Register a tool to the registry
   */
  public addTool<TSchema extends Record<string, z.ZodType<any>>>(
    tool: McpTool<TSchema>
  ): McpServerFactory {
    this.registry.tools.push(tool);
    return this;
  }

  /**
   * Register a resource to the registry
   */
  public addResource(resource: McpResource): McpServerFactory {
    this.registry.resources.push(resource);
    return this;
  }

  /**
   * Register a prompt to the registry
   */
  public addPrompt<TSchema extends Record<string, z.ZodType<any>>>(
    prompt: McpPrompt<TSchema>
  ): McpServerFactory {
    this.registry.prompts.push(prompt);
    return this;
  }

  /**
   * Register error handling
   */
  private registerBinding() {
    this.server.server.onerror = console.error.bind(console);
  }

  /**
   * Register all tools from the registry to the server
   */
  private registerAllTools() {
    for (const tool of this.registry.tools) {
      this.server.tool(tool.name, tool.description, tool.schema, tool.handler);
    }
  }

  /**
   * Register all resources from the registry to the server
   */
  private registerAllResources() {
    for (const resource of this.registry.resources) {
      this.server.resource(
        resource.name,
        resource.uri,
        resource.options,
        resource.handler
      );
    }
  }

  /**
   * Register all prompts from the registry to the server
   */
  private registerAllPrompts() {
    for (const prompt of this.registry.prompts) {
      this.server.prompt(
        prompt.name,
        prompt.description,
        prompt.schema,
        prompt.handler
      );
    }
  }
}
