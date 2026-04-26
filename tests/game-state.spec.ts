import { test, expect } from '@playwright/test';

test.describe('Game State Management', () => {
  test('should have initial game time', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const gameTime = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player.gameTime;
    });
    
    expect(gameTime).toBeDefined();
    expect(gameTime.currentDay).toBeGreaterThanOrEqual(1);
    expect(gameTime.currentGameMinutes).toBeGreaterThanOrEqual(0);
  });

  test('should have hidden state flags', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hiddenState = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player.hiddenState;
    });
    
    expect(hiddenState).toBeDefined();
    expect(typeof hiddenState).toBe('object');
  });

  test('should have dialogue state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const dialogue = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player.dialogue;
    });
    
    expect(dialogue).toBeDefined();
    expect(dialogue.activeDialogue).toBeDefined();
  });

  test('should have notification system', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const notifications = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player.notifications;
    });
    
    expect(notifications).toBeDefined();
    expect(notifications.history).toBeDefined();
    expect(Array.isArray(notifications.history)).toBe(true);
  });

  test('should have Flack DM state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const flackDMs = await page.evaluate(() => {
      const state = (window as any).store.getState();
      return state.player.flackDMs;
    });
    
    expect(flackDMs).toBeDefined();
    expect(typeof flackDMs).toBe('object');
  });
});
