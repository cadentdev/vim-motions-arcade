import { test, expect } from '@playwright/test';

/**
 * Example E2E Test - Basic App Loading
 * This is a scaffold test to verify Playwright is working correctly
 */

test.describe('Game Application', () => {
  test('should load the application', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Check that the title is correct
    await expect(page).toHaveTitle(/Vim Motions Arcade/);
  });

  test('should display the game container', async ({ page }) => {
    await page.goto('/');

    // Check that the game container exists
    const gameContainer = page.locator('#game-container');
    await expect(gameContainer).toBeVisible();
  });

  test('should display the main heading', async ({ page }) => {
    await page.goto('/');

    // Check that the h1 is present
    const heading = page.locator('h1');
    await expect(heading).toContainText('Vim Motions Arcade');
  });
});
