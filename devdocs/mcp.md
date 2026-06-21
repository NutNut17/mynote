# MCP Server

## Overview

MCP (Model Context Protocol) is served via `@nuxtjs/mcp-toolkit` at the `/mcp` endpoint. This lets AI tools (Claude Desktop, Cursor, etc.) connect to this site and call tools or read resources.

Enabled in `nuxt.config.ts`:
```ts
modules: [
  // ...
  '@nuxtjs/mcp-toolkit',
],
mcp: {
  enabled: true,
},
docus: {
  assistant: {
    mcpServer: '/mcp',
    ...
  }
}
```

## File Structure

Server code (Nitro API routes + MCP definitions) lives in the **root** `server/` directory:

| Directory | Status | Notes |
|-----------|--------|-------|
| `server/mcp/` | **Active** | Contains MCP tool/resource definitions |
| `server/api/` | **Active** | Nitro API routes |

- `server/mcp/resources/intro.ts` — exposes `INTRO.md` as an MCP resource
- `server/mcp/tools/project-info.ts` — `get-project-info` tool returning project metadata

> Note: `@nuxtjs/mcp-toolkit` resolves server definitions relative to each Nuxt layer's `srcDir`, which for this project is the project root — **not** `app/`. Code placed under `app/server/` is never picked up by Nitro/MCP.

### Active tool: `get-project-info`
```ts
// returns: { name, description, features[] }
```

## Debug Steps

```bash
# 1. Start dev server
npm run dev

# 2. Check MCP endpoint directly (dev server runs on port 3000)
curl http://localhost:3000/mcp

# 3. Use MCP Inspector
npx @modelcontextprotocol/inspector http://localhost:3000/mcp
```
