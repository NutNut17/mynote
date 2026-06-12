# Docus AI Assistant

## Overview

Docus 5.x ships a built-in AI assistant that renders as:
- A floating chat input bar at the bottom of doc pages
- An "Explain with AI" button in the sidebar TOC

Configured in two places:

**`nuxt.config.ts`** — backend (model, API path, MCP server):
```ts
docus: {
  assistant: {
    model: 'google/gemini-3-flash-preview',
    mcpServer: '/mcp',
    apiPath: '/__docus__/assistant',
  },
},
```

**`app.config.ts`** — UI toggles:
```ts
assistant: {
  floatingInput: true,
  explainWithAi: true,
  faqQuestions: ['How do I get started?', '...'],
  shortcuts: { focusInput: 'meta_i' }
}
```

## Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `AI_GATEWAY_API_KEY` | API key for Vercel AI Gateway (routes to Gemini) |

> Set in `.env` locally. In Amplify, set as an environment variable in the console under the `main` branch.

## Known Issue: Assistant Not Working

**Root cause identified**: `server/api/__docus__/` directory is **empty**. Docus expects an assistant API handler at `/__docus__/assistant` but the directory contains no files.

Docus likely provides this handler internally through its `extends` layer. The issue may be one of:

1. **Missing env var in cloud** — `AI_GATEWAY_API_KEY` not set in Amplify environment variables
2. **Wrong model name** — `google/gemini-3-flash-preview` — verify this is a valid model ID for the gateway
3. **API gateway URL mismatch** — Docus may need a `baseURL` or gateway URL config, not just an API key
4. **MCP server unreachable** — the assistant depends on `/mcp` being functional

## Troubleshooting

```bash
# 1. Confirm env var is set locally
grep AI_GATEWAY .env

# 2. Test the assistant API directly
curl -X POST http://localhost:3000/__docus__/assistant \
  -H "Content-Type: application/json" \
  -d '{"question":"hello"}'

# 3. Check Docus source for what env vars it reads
# Docus repo: https://github.com/nuxt-themes/docus
# Look in: src/server/api/__docus__/assistant.ts
```

## Cloud Setup (Amplify)

1. Go to AWS Amplify Console → App `mynote` (d1x2divnj6b0hf) → Branch `main` → Environment variables
2. Add `AI_GATEWAY_API_KEY` with the value from `.env`
3. Redeploy

## Model Config Note

`config_failing.ts` used `google/gemini-2.5-flash-preview`, `config_working.ts` also. The current `nuxt.config.ts` uses `google/gemini-3-flash-preview`. If that model doesn't exist in the gateway, revert to `google/gemini-2.5-flash-preview`.
