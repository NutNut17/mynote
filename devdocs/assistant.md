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

`AI_GATEWAY_API_KEY` must be set at the **app level** (not branch level) so it is available
during the build step. The Nitro Lambda reads it through runtimeConfig, not directly from
`process.env` at request time.

### Why runtimeConfig + Nitro plugin (not a bare env var)

`@ai-sdk/gateway` reads `process.env.AI_GATEWAY_API_KEY` via `loadOptionalSetting`. On
Amplify's SSR Lambda this env var is available during `npm run build` but **not** in the
bundled Lambda runtime. Two mechanisms work together to fix this:

1. **`nuxt.config.ts`** bakes the key into the bundle at build time:
   ```ts
   runtimeConfig: {
     aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY || '',
   }
   ```
   Nitro serialises runtimeConfig into `_inlineRuntimeConfig` inside the bundle, so the
   value survives into the Lambda.

2. **`server/plugins/ai-gateway.ts`** exposes it where the docus handler expects it:
   ```ts
   export default defineNitroPlugin(() => {
     const config = useRuntimeConfig()
     if (config.aiGatewayApiKey && !process.env.AI_GATEWAY_API_KEY) {
       process.env.AI_GATEWAY_API_KEY = config.aiGatewayApiKey as string
     }
   })
   ```
   Nitro plugins run at Lambda cold-start before any request handler, so `process.env` is
   populated by the time `/__docus__/assistant` is hit.

### Steps to set the env var via CLI

```bash
# Set at app level (all branches share it)
aws amplify update-app \
  --app-id d1x2divnj6b0hf \
  --region ap-northeast-1 \
  --environment-variables "AI_GATEWAY_API_KEY=<your-key>"
```

After adding/changing the key, trigger a redeploy — the value is baked at build time.

### Model selection

`openai/gpt-4o-mini` is used because Google Gemini models (`gemini-3-flash`,
`gemini-2.5-flash-preview`) are blocked on the Vercel AI Gateway **free tier**. If you
upgrade to a paid Vercel plan, you can switch the model in `nuxt.config.ts`.
