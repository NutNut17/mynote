# Development Notes

- Never edit unrelated files, you may suggest for improvements and bugs after execution.
- When the prompt is ambiguous, stop and ask for clarification. If the user is not sure about what they want, provide some options.
- Keep modules simple and modular.
- Make sure to validate on browser to check for any mistakes.

## Custom Features

- **Mermaid**: Use `::mermaid{name="unique-name"}`. SVGs are pre-generated via `scripts/generate-mermaid.mjs` into `public/mermaid/`.
- **Testing**: Using playwright tests

## Build & Deployment

- **Cross-Platform Lockfile**: If you modify `package.json` on Windows, you **must** regenerate the lockfile with Linux/ARM flags to ensure the Amplify build succeeds:
  ```bash
  npm install --os=linux --cpu=x64 --cpu=arm64
  ```

## Test

### Dev Test

```powershell
npm run dev

# In another terminal:
npx playwright test tests/smoke.spec.ts --project=chromium
```

## Production Build Test

```powershell
npm run build
npx nitro dev .output/server/index.mjs

# In another terminal:
npx playwright test tests/smoke.spec.ts --project=chromium --baseUrl=http://localhost:3000
```