# Development Notes

- Never edit unrelated files, you may suggest for improvements and bugs after execution.
- When the prompt is ambiguous, stop and ask for clarification. If the user is not sure about what they want, provide some options.
- Keep modules simple and modular.
- Make sure to validate on browser to check for any mistakes.

## Custom Features

- **Mermaid**: Use `::mermaid{name="unique-name"}`. SVGs are pre-generated via `scripts/generate-mermaid.mjs` into `public/mermaid/`.
- **Testing**: Playwright tests are in `tests/`. Run `npx playwright test tests/mermaid.spec.ts` to validate Mermaid generation.
