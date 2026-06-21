# Architecture Overview

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Docus 5.9.0 (extends Nuxt 4.2.2) |
| Content | @nuxt/content 3.x — markdown files in `content/` |
| Styling | Tailwind CSS 4, inlined colors (Amplify compat) |
| Animation | motion-v |
| Math | remark-math + rehype-katex |
| Diagrams | Mermaid (pre-generated SVGs) |
| i18n | @nuxtjs/i18n — `en` (default), `fr` |
| SSR Host | AWS Amplify WEB_COMPUTE, Node 22, preset `aws-amplify` |
| Storage | AWS S3 (`mynote-storage`, `ap-northeast-1`) |
| MCP | @nuxtjs/mcp-toolkit 0.12.0 |
| Dev tooling | NuxtHub core (dev-only), Nuxt Studio (dev-only) |
| Testing | Playwright |

## Directory Map

```
mynote/
├── app/                        # Nuxt app layer (overrides docus)
│   ├── assets/css/             # Global CSS (main.css)
│   ├── components/
│   │   ├── content/            # MDC components (Mermaid, Three, BrowserFrame…)
│   │   ├── app/                # Layout components (AppFooter)
│   │   └── ProseImg.vue        # S3 image URL rewriter
│   ├── layout/custom.vue       # Custom layout
│   └── pages/hello.vue         # Test/demo page
├── content/
│   ├── en/                     # English docs (numbered dirs = nav order)
│   │   ├── 1.getting-started/
│   │   ├── 2.gpl/              # General Programming Languages
│   │   ├── 3.dev/              # DevOps / Infrastructure
│   │   ├── 4.web/              # Web Development
│   │   ├── 5.cs/               # Computer Science
│   │   └── 6.miscellaneous/
│   └── fr/                     # French docs (partial)
├── public/
│   ├── mermaid/                # Pre-generated SVG diagrams
│   └── images/                 # Static images (served from S3 in prod)
├── scripts/
│   └── generate-mermaid.mjs    # Mermaid SVG pre-generator
├── server/                     # Active server-side code (Nitro resolves this relative to srcDir, i.e. project root)
│   ├── api/test.ts             # Health-check endpoint
│   ├── mcp/resources/          # MCP resource definitions
│   └── mcp/tools/              # MCP tool definitions
├── tests/                      # Playwright tests
├── nuxt.config.ts              # Main Nuxt config
├── app.config.ts               # App-level config (socials, assistant UI)
├── playwright.config.ts        # Test runner config
└── .env                        # Local secrets (not committed)
```

## Module Load Order

At dev startup:
1. `@nuxthub/core` (dev-only — connects to Cloudflare, skipped in prod)
2. `@nuxtjs/i18n`
3. `@nuxt/content`
4. `motion-v/nuxt`
5. `@nuxtjs/mcp-toolkit`
6. `nuxt-studio` (dev-only)
7. `docus` (via `extends: 'docus'` — provides base layout, components, AI assistant)

## Route Structure

| Route | Target |
|-------|--------|
| `/` | Redirects to `/en` |
| `/en/**` | English content pages |
| `/fr/**` | French content pages |
| `/mcp` | MCP server endpoint |
| `/__docus__/assistant` | AI assistant API |
| `/llms.txt` | LLM-readable site index |
| `/llm.txt` | Redirects to `/llms.txt` |

## Image Strategy

- **Dev**: `/images/*` served from `public/images/` locally
- **Prod**: `ProseImg.vue` rewrites `/images/*` → `https://mynote-storage.s3.ap-northeast-1.amazonaws.com/public/images/*`
- Rationale: AWS Amplify's image optimizer cannot fetch from Lambda; direct S3 URLs bypass it
