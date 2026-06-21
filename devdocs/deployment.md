# Deployment

## Platform

- **AWS Amplify** (WEB_COMPUTE — SSR, not static)
- App ID: `d1x2divnj6b0hf`
- Production branch: `main`
- Region: `ap-northeast-1`
- Runtime: Node 22 (`nodejs22.x`)
- Nitro preset: `aws-amplify`

## Build Flow

```
git push → GitHub (NutNut17/mynote) → Amplify auto-build → deploy
```

Amplify runs `npm run build`, which:
1. `node scripts/generate-mermaid.mjs` — generates Mermaid SVGs
2. `nuxt build --extends docus` — builds SSR bundle
3. Output lands in `.amplify-hosting/` (committed for local preview)

## Route Architecture

Static assets → served by Amplify CDN directly (no Lambda)
Dynamic routes (`/*`) → Amplify Compute (Lambda, `server.js`)

See `.amplify-hosting/deploy-manifest.json` for full routing rules.

## S3 Images

Images are stored in S3 and NOT committed to git (all image types are in `.gitignore`).

```
S3 bucket: mynote-storage
Region: ap-northeast-1
Public path: https://mynote-storage.s3.ap-northeast-1.amazonaws.com/public/images/
```

To sync local images to S3:
```bash
aws s3 sync public/images/ s3://mynote-storage/public/images/ --region ap-northeast-1
```

`ProseImg.vue` rewrites `/images/*` paths to the S3 URL **only in production** (`!import.meta.dev`). In dev, local files are used.

## Environment Variables (Amplify Console)

Set these in Amplify → App → Branch `main` → Environment variables:

| Variable | Required | Purpose |
|----------|----------|---------|
| `AI_GATEWAY_API_KEY` | Yes | Docus AI assistant / Gemini gateway |
| `S3_ACCESS_KEY_ID` | Yes | S3 image access |
| `S3_SECRET_ACCESS_KEY` | Yes | S3 image access |
| `S3_BUCKET` | Yes | `mynote-storage` |
| `S3_REGION` | Yes | `ap-northeast-1` |
| `HUB_BLOB_PUBLIC_URL` | Yes | Public S3 URL base |

## Cross-Platform Lockfile

**Critical**: If `package.json` is modified on Windows, regenerate the lockfile before pushing:

```bash
npm install --os=linux --cpu=x64 --cpu=arm64
```

Otherwise Amplify (Linux/x64) may fail to install native deps like `better-sqlite3` or `sharp`.

## Preview Production Build Locally

```bash
npm run build
# Then either:
node .amplify-hosting/compute/default/server.js
# Or:
$env:TEST_MODE="prod"; npx playwright test --project=chromium
```

## Checking Cloud Status

```bash
# List branches and last deploy status
aws amplify list-branches --app-id d1x2divnj6b0hf --region ap-northeast-1

# Get last job
aws amplify list-jobs --app-id d1x2divnj6b0hf --branch-name main --region ap-northeast-1
```
