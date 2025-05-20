import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { McpPrimitive } from "../mcp.primitive";
import { fetchFromJobApp } from "../utils";

export const jobDetailsResource: McpPrimitive = {
  register(server) {
    server.resource(
      "public-get-job-details",
      new ResourceTemplate("jobapp://jobs/{jobId}", { list: undefined }),
      async (uri, { jobId }) => {
        try {
          const jobDetails = await fetchFromJobApp(`/api/jobs/${jobId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          return {
            contents: [
              {
                uri: uri.href,
                text: JSON.stringify(jobDetails, null, 2),
              },
            ],
          };
        } catch (error: any) {
          console.error("Error in list-available-jobs resource:", error);
          return {
            contents: [
              {
                uri: uri.href,
                text: `Error in getting the job details: ${error.message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  },
};
