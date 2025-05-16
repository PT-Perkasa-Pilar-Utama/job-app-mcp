import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { z } from "zod";
import type { McpTool } from "../mcp.primitive";

const schema = {
  interval: z
    .number()
    .describe("Interval in milliseconds between notifications")
    .default(100),
  count: z
    .number()
    .describe("Number of notifications to send (0 for 100)")
    .default(10),
};

export const notificationTool: McpTool<typeof schema> = {
  name: "start-notification-stream",
  description: "Starts sending periodic notifications for testing resumability",
  schema: schema,
  handler: async (
    { interval, count },
    { sendNotification }
  ): Promise<CallToolResult> => {
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    let counter = 0;

    while (count === 0 || counter < count) {
      counter++;
      try {
        await sendNotification({
          method: "notifications/message",
          params: {
            level: "info",
            data: `Periodic notification #${counter} at ${new Date().toISOString()}`,
          },
        });
      } catch (error) {
        console.error("Error sending notification:", error);
      }

      await sleep(interval);
    }

    return {
      content: [
        {
          type: "text",
          text: `Started sending periodic notifications every ${interval}ms`,
        },
      ],
    };
  },
};
