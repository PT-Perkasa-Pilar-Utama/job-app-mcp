import type { ResourceMetadata } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  CallToolResult,
  GetPromptResult,
  ReadResourceResult,
} from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";

export interface McpPrimitive {
  name: string;
  description: string;
}

export interface McpTool<TSchema extends Record<string, z.ZodType<any>> = any>
  extends McpPrimitive {
  schema: TSchema;
  handler: (
    params: z.infer<z.ZodObject<TSchema>>,
    context: any
  ) => Promise<CallToolResult>;
}

export interface McpResource extends McpPrimitive {
  uri: string;
  options: ResourceMetadata;
  handler: () => Promise<ReadResourceResult>;
}

export interface McpPrompt<TSchema extends Record<string, z.ZodType<any>> = any>
  extends McpPrimitive {
  schema: TSchema;
  handler: (params: z.infer<z.ZodObject<TSchema>>) => Promise<GetPromptResult>;
}

export interface McpTool<TSchema extends Record<string, z.ZodType<any>> = any>
  extends McpPrimitive {
  schema: TSchema;
  handler: (
    params: z.infer<z.ZodObject<TSchema>>,
    context: any
  ) => Promise<CallToolResult>;
}

export interface McpResource extends McpPrimitive {
  uri: string;
  options: ResourceMetadata;
  handler: () => Promise<ReadResourceResult>;
}

export interface McpPrompt<TSchema extends Record<string, z.ZodType<any>> = any>
  extends McpPrimitive {
  schema: TSchema;
  handler: (params: z.infer<z.ZodObject<TSchema>>) => Promise<GetPromptResult>;
}

export interface McpRegistry {
  tools: Array<McpTool<any>>;
  resources: Array<McpResource>;
  prompts: Array<McpPrompt<any>>;
}
