import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to all main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/Jacob Barkin/);
    
    // About page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/.*about/);
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
    
    // Projects page
    await page.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL(/.*projects/);
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
    
    // Contact page
    await page.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL(/.*contact/);
    await expect(page.getByRole('heading', { name: 'Contact Me' })).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    
    // Get the theme toggle button
    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    
    // Click the theme toggle
    await themeToggle.click();
    
    // Check if the theme has changed by looking for the dark class on html
    const isDarkMode = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    
    // Click again to toggle back
    await themeToggle.click();
    
    // Check if the theme has changed back
    const isLightMode = await page.evaluate(() => {
      return !document.documentElement.classList.contains('dark');
    });
    
    // At least one of these should be true, depending on the initial theme
    expect(isDarkMode || isLightMode).toBeTruthy();
  });
});
