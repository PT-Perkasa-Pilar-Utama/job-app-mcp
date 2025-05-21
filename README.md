# job-app-mcp

Simple mcp server to be used for MCP demo.

- `job-app-rest`: https://github.com/PT-Perkasa-Pilar-Utama/job-app-rest
- `job-app-client`: https://github.com/PT-Perkasa-Pilar-Utama/job-app-client

## Installation

### With Claude Desktop

> [!NOTE]
> Make sure `job-app-rest` and `job-app-mcp` is in the same OS
> Since the protocol is going to use Stdio

Here's the sample on ubuntu, you can adjust the path. Also we're using Bunjs.

```json
{
  "mcpServers": {
    "job-app": {
      "command": "/home/snowfluke/.bun/bin/bun",
      "args": [
        "--env-file=/home/snowfluke/project/mcp/job-app-mcp/.env",
        "/home/snowfluke/project/mcp/job-app-mcp/src/index.local.ts"
      ]
    }
  }
}
```

Windows:

```json
{
  "mcpServers": {
    "job-app": {
      "command": "bun",
      "args": [
        "--env-file=C:\\Users\\username\\Downloads\\mcp\\job-app-mcp\\.env",
        "C:\\Users\\username\\Downloads\\mcp\\job-app-mcp\\src\\index.local.ts"
      ]
    }
  }
}
```
