import { test, expect } from '@playwright/test';

test.describe('First Launch Experience', () => {
  test('should show first launch modal for new users', async ({ page, context }) => {
    // Clear localStorage to simulate first launch
    await context.clearCookies();
    
    // Clear localStorage before navigation
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Reload to apply cleared localStorage
    await page.reload();
    
    // Wait for page to load or capture error
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
    } catch (e) {
      // Page might have crashed, check for error
      const errorText = await page.locator('body').textContent();
      console.log('Page content:', errorText);
      throw new Error(`Page crashed: ${errorText}`);
    }
    
    // Wait for first launch modal
    const modal = page.locator('.first-launch-overlay, .first-launch-content');
    await expect(modal).toBeVisible({ timeout: 10000 });
  });

  test('should allow entering player name', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    
    // Clear localStorage before waiting for load
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.waitForLoadState('networkidle');
    
    // Wait for first launch modal
    const modal = page.locator('.first-launch-content');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    // Enter name
    const input = page.locator('.first-launch-input, input[type="text"]');
    await input.fill('TestPlayer');
    
    // Submit
    const submitButton = page.locator('.first-launch-next, button[type="submit"]');
    await submitButton.click();
    
    // Modal should disappear
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('should validate name length', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    
    // Clear localStorage before waiting for load
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.waitForLoadState('networkidle');
    
    const modal = page.locator('.first-launch-content');
    await expect(modal).toBeVisible({ timeout: 10000 });
    
    const input = page.locator('.first-launch-input, input[type="text"]');
    const submitButton = page.locator('.first-launch-next, button[type="submit"]');
    
    // Try empty name
    await input.fill('');
    await submitButton.click();
    
    // Should show error
    const error = page.locator('.first-launch-error, [class*="error"]');
    await expect(error).toBeVisible();
  });
});
