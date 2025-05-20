import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

import type { McpPrimitive } from "../mcp.primitive";

export const greetingPrompt: McpPrimitive = {
  register(server) {
    server.prompt(
      "greeting",
      "Greet user that coming to JobApp, a LLM-based job application system",
      async (): Promise<GetPromptResult> => {
        return {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `Please respond like an HR, welcome the user, explain briefly about JobApp (a LLM-based job application system), ask them to login if they haven't login to JobApp system.`,
              },
            },
          ],
        };
      }
    );
  },
};
