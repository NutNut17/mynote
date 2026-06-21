# Mermaid Diagrams

## How It Works

Mermaid diagrams are **pre-generated at build time** into static SVGs. They are NOT rendered client-side.

```
content/*.md  →  scripts/generate-mermaid.mjs  →  public/mermaid/*.svg
```

The script runs automatically before `dev` and `build`:
```bash
node scripts/generate-mermaid.mjs && nuxt dev ...
```

## MDC Syntax

In any markdown file, use:
```
::mermaid{name="unique-name"}
graph TD
  A --> B
::
```

- `name` must be **unique across all content files** — it becomes the SVG filename
- The `::mermaid` block must start at the beginning of a line

## Generated Output

SVGs are saved to `public/mermaid/{name}.svg` and served as static assets.

The `Mermaid.vue` component renders them:
```html
<img src="/mermaid/{name}.svg" class="mermaid-diagram" />
```

## Caching

`mermaid-cache.json` stores `{ name: sha256(code) }` to skip regeneration when diagram code hasn't changed. This file is in `.gitignore`.

## Adding a New Diagram

1. Add `::mermaid{name="my-diagram"}` block to a markdown file
2. Run `npm run generate-mermaid` or `npm run dev` (auto-runs)
3. SVG appears in `public/mermaid/my-diagram.svg`

## Playwright Test

`tests/mermaid.spec.ts` validates:
- `.mermaid-diagram` container is visible on `/en/getting-started/markdown`
- Image `src` matches `/mermaid/*.svg`
- Image is fully loaded (`naturalWidth > 0`)

## Troubleshooting

| Problem | Fix |
|---------|-----|
| SVG not generated | Check `tmp/{hash}.mmd` was created; check `mmdc` is installed (`npm install`) |
| Diagram not showing on page | Confirm `name` matches exactly between MDC block and `public/mermaid/` |
| Stale diagram | Delete entry from `mermaid-cache.json` or delete the SVG file |
| `mmdc` not found | Run `npm install` to ensure `@mermaid-js/mermaid-cli` devDep is present |
