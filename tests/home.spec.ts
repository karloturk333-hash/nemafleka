import { test, expect } from '@playwright/test';

test('calculator computes a quote and builds a WhatsApp link', async ({ page }) => {
  await page.goto('/');
  await page.locator('#kalkulator').scrollIntoViewIfNeeded();

  // Kauč → Kutna garnitura (90)
  await page.locator('.svc-pick[data-service=couch]').click();
  await page.locator('#size-opts .csize-pill').nth(2).click();
  await page.locator('#size-add').click();

  // Tepih → do 6 m² (60)
  await page.locator('#add-more').click();
  await page.locator('.svc-pick[data-service=carpet]').click();
  await page.locator('#size-opts .csize-pill').nth(1).click();
  await page.locator('#size-add').click();

  await page.locator('#to-location').click();
  await page.locator('#to-result').click();

  await expect(page.locator('#cr-total')).toHaveText('150 €');

  const href = await page.locator('#cr-wa').getAttribute('href');
  expect(href).not.toBe('#');
  expect(href).toContain('wa.me/385953765343');
  const body = decodeURIComponent(href!.split('text=')[1]!);
  expect(body).toContain('Kutna garnitura — 90 €');
  expect(body).toContain('Tepih do 6 m² — 60 €');
  expect(body).toContain('Ukupno: ~150 €');
  expect(body).toContain('Možemo li dogovoriti termin?');
  expect(body).toContain('\n');
});

test('calculator CTA has a WhatsApp fallback href before JS rewrites it', async ({ page }) => {
  await page.goto('/');
  const href = await page.locator('#cr-wa').getAttribute('href');
  expect(href).toContain('wa.me/385953765343');
  expect(href).not.toBe('#');
});

test('chair cannot proceed as the only service', async ({ page }) => {
  await page.goto('/');
  await page.locator('#kalkulator').scrollIntoViewIfNeeded();
  await page.locator('.svc-pick[data-service=chair]').click();
  await page.locator('#size-opts .csize-pill').first().click();
  await page.locator('#size-add').click();
  await expect(page.locator('#to-location')).toBeDisabled();
  await expect(page.locator('#cart-warn')).toBeVisible();
});

test('no "od X €" price anchoring on the homepage', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/\bod\s+\d+\s*€/i);
});

test('reviews section is omitted when the JSON is empty', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#recenzije')).toHaveCount(0);
});

test('city page has unique H1, canonical, and city WhatsApp text', async ({ page }) => {
  await page.goto('/dubinsko-ciscenje-krizevci');
  await expect(page.locator('h1')).toHaveText('Dubinsko čišćenje Križevci');
  const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
  expect(canonical).toBe('https://nemafleka.com/dubinsko-ciscenje-krizevci');
  const robots = await page.locator('meta[name=robots]').count();
  expect(robots).toBe(0);
  const href = await page.locator('a[data-wa-source="grad-krizevci"]').first().getAttribute('href');
  const body = decodeURIComponent(href!.split('text=')[1]!);
  expect(body).toContain('Križevci');
});

test('JSON-LD LocalBusiness has no aggregateRating', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const joined = blocks.join(' ');
  expect(joined).not.toContain('aggregateRating');
  expect(joined).toContain('LocalBusiness');
  expect(joined).toContain('FAQPage');
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

  const box = await panel.boundingBox();
  expect(box!.height).toBeGreaterThan(700);

  const alpha = await panel.evaluate((el) => {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
    return m && m.length === 4 ? Number(m[3]) : 1;
  });
  expect(alpha).toBe(1);

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
