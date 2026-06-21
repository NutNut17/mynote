# CLAUDE.md — AI Agent Instructions

> Full project context lives in `devdocs/`. Read the relevant file before making changes.

## Rules

- Never edit unrelated files. Suggest improvements separately after completing the task.
- When the prompt is ambiguous, stop and ask. If the user is unsure, offer options.
- Keep modules simple and modular.
- Validate changes in the browser before marking done.
- Do NOT add error handling, comments, or docstrings to code you did not change.
- Do NOT create helpers/abstractions for one-off use.

## Extra Key Files

| File | Purpose |
|------|---------|
| `server/` | Server API + MCP definitions (active) — see `devdocs/mcp.md` |
| `scripts/generate-mermaid.mjs` | Pre-generates Mermaid SVGs into `public/mermaid/` |

## Quick Commands

```bash
npm run dev          # dev server (also runs generate-mermaid)
npm run build        # production build
npx playwright test --project=chromium   # run tests
npx @modelcontextprotocol/inspector http://localhost:3000/mcp   # debug MCP
```

## When Something Goes Wrong

> Make a deep research on the project's GitHub if something goes wrong. Keep trying — don't be overconfident that an issue is solved. Make sure to validate and don't make unrelated changes.
