# Development Notes

- Never edit unrelated files, you may suggest for improvements and bugs after execution.
- When the prompt is ambiguous, stop and ask for clarification. If the user is not sure about what they want, provide some options.
- Keep modules simple and modular.
- Make sure to validate on browser to check for any mistakes.

## Custom Features

- **Mermaid**: Use `::mermaid{name="unique-name"}`. SVGs are pre-generated via `scripts/generate-mermaid.mjs` into `public/mermaid/`.
- **Testing**: Playwright tests are in `tests/`. Run `npx playwright test tests/mermaid.spec.ts` to validate Mermaid generation. Note: standard tests run on the dev server; they do not catch Nitro/Amplify-specific module resolution issues.

## Build & Deployment

- **Cross-Platform Lockfile**: If you modify `package.json` on Windows, you **must** regenerate the lockfile with Linux/ARM flags to ensure the Amplify build succeeds:
  ```bash
  npm install --os=linux --cpu=x64 --cpu=arm64
  ```
- **Runtime Fixes**: If you see `ERR_MODULE_NOT_FOUND` on production for sub-modules like `tailwindcss/colors`, add them to the `nitro.externals.inline` list in `nuxt.config.ts`.
- **Production Build Test**: To test the actual production bundle locally:
  ```bash
  npm run build
  npx nitro dev .output/server/index.mjs
  ```

