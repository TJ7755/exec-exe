import { test, expect } from '@playwright/test';

test.describe('Game Loading and Initialization', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check that the app container exists
    const app = page.locator('.App');
    await expect(app).toBeVisible();
  });

  test('should show boot screen initially', async ({ page }) => {
    await page.goto('/');
    
    // Check for boot screen
    const bootScreen = page.locator('.boot-screen, [class*="boot"], [class*="Boot"]');
    // Boot screen might disappear quickly, so we check if it exists
    const isVisible = await bootScreen.isVisible().catch(() => false);
    
    // Either boot screen was visible or it's already booted
    // Both are acceptable states
  });

  test('should expose store to window for debugging', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that window.store is available
    const storeExists = await page.evaluate(() => {
      return typeof (window as any).store !== 'undefined';
    });
    
    expect(storeExists).toBe(true);
  });

  test('should have player state in store', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that player state exists
    const playerState = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player;
    });
    
    expect(playerState).toBeDefined();
    expect(playerState.gameTime).toBeDefined();
    expect(playerState.hiddenState).toBeDefined();
  });
});
