import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpPrompt } from "../mcp.primitive";

const schema = {
  name: z.string().describe("Name to include in greeting"),
  language: z.enum(["en", "es", "fr"]).describe("Language for greeting"),
};

export const greetingPrompt: McpPrompt<typeof schema> = {
  name: "greeting",
  description: "A simple greeting prompt template",
  schema: schema,
  handler: async ({ name, language }): Promise<GetPromptResult> => {
    const greetings = {
      en: `Hello, ${name}!`,
      es: `¡Hola, ${name}!`,
      fr: `Bonjour, ${name}!`,
    };

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please respond with: ${greetings[language]} in a friendly manner.`,
          },
        },
      ],
    };
  },
};
