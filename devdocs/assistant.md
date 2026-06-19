# Docus AI Assistant

## Overview

Docus 5.x ships a built-in AI assistant that renders as:
- A floating chat input bar at the bottom of doc pages
- An "Explain with AI" button in the sidebar TOC
- An "Ask AI" panel triggered from the top nav

It's implemented as an auto-registered Nuxt module at `node_modules/docus/modules/assistant`
(Nuxt's `modules/` directory convention auto-registers it; its `configKey` is **`assistant`**, top-level).

### Correct config (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  // top-level "assistant" key — NOT nested under "docus"
  assistant: {
    model: 'openai/gpt-4o-mini',
    mcpServer: '/mcp',
    apiPath: '/__docus__/assistant',
  },
})
```

> **Gotcha**: `docus.assistant.*` in `nuxt.config.ts` is a *different*, unrelated config path
> (only `app.config.ts`'s `docus.assistant` — UI toggles like `floatingInput`, `faqQuestions` —
> is read by the app). If the server-side `model`/`mcpServer`/`apiPath` are nested under
> `docus.assistant` in `nuxt.config.ts`, the assistant module never sees them and silently
> falls back to its default model `google/gemini-3-flash`.

**`app.config.ts`** — UI toggles (separate, correct as-is):
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
| `AI_GATEWAY_API_KEY` | API key for Vercel AI Gateway |

> Set in `.env` locally. In Amplify, set as an environment variable in the console under the `main` branch.

## Model choice

The Vercel AI Gateway free tier (no purchased credits beyond the $5/mo free allowance) does
**not** allow Google Gemini models (`google/gemini-3-flash`, `google/gemini-2.5-flash-preview`,
etc.) — these return `"Free tier users do not have access to this model"` regardless of the
exact Gemini model name. `openai/gpt-4o-mini` works on the free tier, supports tool calling
(needed for the `list-pages`/`get-page` MCP tools), and is very cheap.

If switching providers later, verify directly against the gateway first:
```bash
curl https://ai-gateway.vercel.sh/v1/chat/completions \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" -H "Content-Type: application/json" \
  -d '{"model":"<provider/model>","messages":[{"role":"user","content":"hi"}],"max_tokens":16}'
```

## Dependency pitfall: duplicate `@vercel/oidc`

`@ai-sdk/gateway` (a transitive dep of `ai`) requires `@vercel/oidc`. If two versions get
installed (one at top-level `node_modules/@vercel/oidc`, another nested under
`node_modules/ai/node_modules/@vercel/oidc`), the browser bundle throws:

```
The requested module '.../node_modules/ai/node_modules/@vercel/oidc/dist/index-browser.js'
does not provide an export named 'getContext'
```

This breaks the assistant chat UI (panel opens but renders a broken loading animation, no input).
Docus's `optimizeDeps`/alias fix for `@vercel/oidc` only covers the top-level copy.

**Fix**: pin `@ai-sdk/gateway` in `package.json` `overrides` to match the root-resolved version
so npm dedupes to a single `@vercel/oidc` copy, then `npm install`:

```json
"overrides": {
  "@ai-sdk/gateway": "3.0.112"
}
```

## Verifying locally

```bash
# 1. MCP tools available
curl -X POST http://localhost:3000/mcp -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# 2. Assistant streams a real response (not a "Free tier" error)
curl -X POST http://localhost:3000/__docus__/assistant -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"hello"}]}]}'
```

For the UI, open the site, click the "Ai" button in the top nav — the "Ask AI" panel should
slide in from the right with a working input and FAQ suggestions.

## Cloud Setup (Amplify)

1. Go to AWS Amplify Console → App `mynote` (d1x2divnj6b0hf) → Branch `main` → Environment variables
2. Add `AI_GATEWAY_API_KEY` with the value from `.env`
3. Redeploy
