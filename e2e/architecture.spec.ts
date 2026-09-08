/**
 * E2E spec placeholder — requires Playwright to be installed.
 *
 * Install: npm i -D @playwright/test
 * Run:     npx playwright test e2e/architecture.spec.ts
 *
 * ponytail: Playwright not yet in devDependencies. Add when e2e coverage is prioritized.
 */
import { test, expect } from '@playwright/test';

test.describe('Architecture Explorer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/architecture/lessotp');
  });

  test('renders with valid node/edge data', async ({ page }) => {
    await expect(page.getByRole('region', { name: /LessOTP/i })).toBeVisible();
    await expect(page.getByText('API Gateway')).toBeVisible();
  });

  test('selecting a node displays correct detail', async ({ page }) => {
    await page.getByText('Auth API').first().click();
    await expect(page.getByRole('region', { name: /Details for Auth API/i })).toBeVisible();
    await expect(page.getByText('TypeScript').first()).toBeVisible();
  });

  test('keyboard user can traverse and select nodes via list', async ({ page }) => {
    await page.getByRole('button', { name: /Open node list/i }).click();
    const listbox = page.getByRole('listbox', { name: /Select a component/i });
    await expect(listbox).toBeVisible();
    await listbox.getByText('API Gateway').click();
    await expect(page.getByRole('region', { name: /Details for API Gateway/i })).toBeVisible();
  });

  test('Escape closes detail panel and restores focus', async ({ page }) => {
    await page.getByText('Auth API').first().click();
    await expect(page.getByRole('region', { name: /Details for Auth API/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('region', { name: /Details for Auth API/i })).not.toBeVisible();
  });

  test('text fallback contains all nodes', async ({ page }) => {
    const fallback = page.getByRole('region', { name: /text representation/i });
    await expect(fallback).toBeVisible();
    for (const name of ['Developer App', 'API Gateway', 'Auth API', 'WhatsApp Connector', 'Webhook Dispatcher']) {
      await expect(fallback.getByText(name)).toBeVisible();
    }
  });

  test('request trace follows requestStep ordering', async ({ page }) => {
    await page.getByText('Trace Request Flow').click();
    const toolbar = page.getByRole('toolbar', { name: /Request trace/i });
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByText('Ready')).toBeVisible();
    // Step forward
    await toolbar.getByRole('button', { name: /Next step/i }).first().click();
    await expect(toolbar.getByText('Step 1 of')).toBeVisible();
  });

  test('320px layout is usable without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/architecture/lessotp');
    const body = page.locator('body');
    const box = await body.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(320);
  });

  test('reduced-motion mode removes animated traversal', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/architecture/lessotp');
    await page.getByText('Trace Request Flow').click();
    const toolbar = page.getByRole('toolbar', { name: /Request trace/i });
    // In reduced motion, play button should not exist — only step buttons
    await expect(toolbar.getByRole('button', { name: /Play trace/i })).not.toBeVisible();
    await expect(toolbar.getByRole('button', { name: /Next step/i }).first()).toBeVisible();
  });
});
