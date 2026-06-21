# Testing

## Framework

Playwright (`@playwright/test`) — browser-level integration tests.

Config: `playwright.config.ts`
- Base URL: `http://localhost:3000` (or `$BASE_URL`)
- Browser: Chromium only
- Auto-starts dev server unless `reuseExistingServer` applies

## Test Files

| File | What it tests |
|------|--------------|
| `tests/navigation.spec.ts` | Page load, `/` → `/en` redirect, "Get started" button → intro page |
| `tests/mermaid.spec.ts` | Mermaid diagram visible on `/en/getting-started/markdown`, SVG loaded |

## Running Tests

### Dev mode (starts `npm run dev` automatically)
```bash
npx playwright test --project=chromium
```

### Against production build
```bash
npm run build
$env:TEST_MODE="prod"; npx playwright test --project=chromium
```
Production mode starts `.amplify-hosting/compute/default/server.js` instead of the dev server.

### View HTML report
```bash
npx playwright show-report
```
Report saved to `playwright-report/index.html`.

## Test Results

`test-results/` — raw Playwright artifacts (traces, screenshots on failure). In `.gitignore`.

## Adding Tests

Place new `*.spec.ts` files in `tests/`. Playwright picks them up automatically.

Key selectors already in use:
- `.mermaid-diagram` — Mermaid container
- `h1` — page title
- `role=link` with name matching
