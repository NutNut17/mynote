# AGENTS.md — Agent Collaboration Guide

This project is a personal knowledge documentation site (MyNote) built on the **Docus 5.x / Nuxt 4** framework, deployed to **AWS Amplify** (WEB_COMPUTE, Node 22, SSR).

## What this project is

- A personal notes/wiki site rendered as a documentation site
- Hosted at `d1x2divnj6b0hf.amplifyapp.com` (prod branch: `main`)
- Images stored in AWS S3 (`mynote-storage`, `ap-northeast-1`)
- MCP server exposed at `/mcp` for AI tool integration
- Docus AI assistant (`/__docus__/assistant`) powered by Google Gemini via a gateway

## Documentation Index

| Doc | Covers |
|-----|--------|
| `devdocs/architecture.md` | Full stack overview, module map |
| `devdocs/mcp.md` | MCP server setup, known issues, debug steps |
| `devdocs/assistant.md` | Docus AI assistant config, env vars, troubleshooting |
| `devdocs/mermaid.md` | Mermaid diagram workflow |
| `devdocs/deployment.md` | AWS Amplify build, S3 sync, lockfile notes |
| `devdocs/testing.md` | Playwright test suite |
| `devdocs/content.md` | Content structure, i18n, MDC syntax |

## Dev Workflow

```bash
# 1. Start dev
npm run dev

# 2. Test
npx playwright test --project=chromium

# 3. Build for production check
npm run build
$env:TEST_MODE="prod"; npx playwright test --project=chromium
```

## Cross-Platform Lockfile Warning

If `package.json` is modified on Windows, regenerate lockfile with:
```bash
npm install --os=linux --cpu=x64 --cpu=arm64
```
This is required for AWS Amplify (Linux/x64) builds to succeed.
