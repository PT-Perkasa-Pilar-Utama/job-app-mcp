import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

export const listAvailableJobsResource: McpPrimitive = {
  register(server) {
    server.resource(
      "public-list-available-jobs",
      "jobapp://jobs",
      async (uri) => {
        try {
          const jobs = await fetchFromJobApp("/api/jobs", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          return {
            contents: [
              {
                uri: uri.href,
                text: JSON.stringify(jobs, null, 2),
              },
            ],
          };
        } catch (error: any) {
          console.error("Error in list-available-jobs resource:", error);
          return {
            contents: [
              {
                uri: uri.href,
                text: `Error getting all the available jobs: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
