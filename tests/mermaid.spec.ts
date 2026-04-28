import { test, expect } from '@playwright/test';

test.describe('Mermaid Diagrams', () => {
  test('should render the mermaid diagram on the markdown page', async ({ page }) => {
    // Navigate to the markdown features page
    await page.goto('/en/getting-started/markdown');
    
    // 1. Locate the mermaid diagram container
    const mermaidContainer = page.locator('.mermaid-diagram').first();
    await expect(mermaidContainer).toBeVisible();

    // 2. Locate the image inside the container
    const mermaidImg = mermaidContainer.locator('img');
    await expect(mermaidImg).toBeVisible();

    // 3. Verify the src attribute points to the generated SVG
    const src = await mermaidImg.getAttribute('src');
    expect(src).toMatch(/^\/mermaid\/.*\.svg$/);

    // 4. Verify the image is actually loaded (naturalWidth > 0)
    // We wait for the image to be fully loaded
    await mermaidImg.evaluate(async (img: HTMLImageElement) => {
      if (img.complete) return;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    const isLoaded = await mermaidImg.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
    expect(isLoaded).toBeTruthy();
  });
});
