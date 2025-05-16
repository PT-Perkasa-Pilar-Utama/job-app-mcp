import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

import type { McpResource } from "../mcp.primitive";

export const greetingResource: McpResource = {
  name: "quran",
  description: "Al-Qur'an resource wiki page",
  uri: "https://en.wikipedia.org/wiki/Quran",
  options: { mimeType: "text/plain" },
  handler: async (): Promise<ReadResourceResult> => {
    return {
      contents: [
        {
          uri: "https://en.wikipedia.org/wiki/Quran",
          text: "All the general knowledge about Islamic Holy Book (Al-Qur'an)",
        },
      ],
    };
  },
};
