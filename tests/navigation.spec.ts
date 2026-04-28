import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should load the main page and navigate to Getting Started', async ({ page }) => {
    // 1. Check if the main page loads (it redirects / to /en)
    await page.goto('/');
    
    // Expect the URL to be /en due to the redirect in nuxt.config.ts
    await expect(page).toHaveURL(/\/en/);
    
    // 2. Check if the main title is present
    const title = page.locator('h1');
    await expect(title).toContainText('My Personal Notes');

    // 3. Find the "Get started" button and click it
    // Note: The text in index.md is "Get started"
    const getStartedBtn = page.getByRole('link', { name: /Get started/i });
    await expect(getStartedBtn).toBeVisible();
    
    await getStartedBtn.click();

    // 4. Verify the redirection to the getting started page
    await expect(page).toHaveURL(/\/en\/getting-started\/introduction/);
    
    // Check if the content of the introduction page loads
    const introTitle = page.locator('h1');
    await expect(introTitle).toBeVisible();
  });
});
