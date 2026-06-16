import { test, expect } from '@playwright/test';

test('calculator computes a quote and builds a WhatsApp link', async ({ page }) => {
  await page.goto('/');
  await page.locator('#kalkulator').scrollIntoViewIfNeeded();

  // Service 1: Kauč → Dvosjed (45)
  await page.locator('.svc-pick[data-service=couch]').click();
  await page.locator('#size-opts .csize-pill').first().click();
  await page.locator('#size-add').click(); // → cart

  // Service 2: Tepih → do 10 m² (65)
  await page.locator('#add-more').click(); // → service list
  await page.locator('.svc-pick[data-service=carpet]').click();
  await page.locator('#size-opts .csize-pill').first().click();
  await page.locator('#size-add').click(); // → cart

  await page.locator('#to-location').click(); // → Lokacija
  await page.locator('#to-result').click(); // → Ponuda

  // Dvosjed (45) + tepih do 10 m² (65) = 110, -10% (2 usluge) = 99, no location -> no travel fee.
  await expect(page.locator('#cr-total')).toHaveText('99 €');

  const href = await page.locator('#cr-wa').getAttribute('href');
  expect(href).toContain('wa.me/385953765343');
  const body = decodeURIComponent(href!.split('text=')[1]!);
  expect(body).toContain('Kauč');
  expect(body).toContain('Tepih');
  expect(body).toContain('Ukupno');
});

test('mobile nav opens, then closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#nf-hamburger').click();
  await expect(page.locator('#nf-mpanel')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nf-mpanel')).toBeHidden();
});

test('mobile nav panel covers the screen and is opaque (not collapsed/transparent)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('#nf-hamburger').click();
  const panel = page.locator('#nf-mpanel');
  await expect(panel).toBeVisible();

  // Regression guard: the panel must be full-height, not collapsed to the nav bar (~67px).
  const box = await panel.boundingBox();
  expect(box!.height).toBeGreaterThan(700);

  // ...and have a fully opaque background so content behind never shows through.
  const alpha = await panel.evaluate((el) => {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    return m && m.length === 4 ? Number(m[3]) : 1;
  });
  expect(alpha).toBe(1);

  // The overlay must cover the full viewport too.
  const overlay = await page.locator('#nf-moverlay').boundingBox();
  expect(overlay!.height).toBeGreaterThan(700);
});

test('before/after slider responds to keyboard', async ({ page }) => {
  await page.goto('/');
  const handle = page.locator('#ba-handle');
  await handle.scrollIntoViewIfNeeded();
  await handle.focus();
  const before = Number(await handle.getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowRight');
  const after = Number(await handle.getAttribute('aria-valuenow'));
  expect(after).toBeGreaterThan(before);
});

test('no fabricated aggregateRating in JSON-LD', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.join(' ')).not.toContain('aggregateRating');
});
