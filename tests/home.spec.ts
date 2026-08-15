import { test, expect } from '@playwright/test';

test('cjenik lists concrete prices, travel, and a WhatsApp CTA', async ({ page }) => {
  await page.goto('/');
  const cjenik = page.locator('#cjenik');
  await cjenik.scrollIntoViewIfNeeded();

  await expect(cjenik).toContainText('Kutna garnitura');
  await expect(cjenik).toContainText('90 €');
  await expect(cjenik).toContainText('Paket "Dnevni boravak"');
  await expect(cjenik).toContainText('Minimalni izlazak 60 €');
  await expect(cjenik).toContainText('Bjelovar, Koprivnica');
  await expect(cjenik).toContainText('+15 €');

  const href = await cjenik.locator('a[data-wa-source="cjenik"]').getAttribute('href');
  expect(href).toContain('wa.me/385953765343');
  const body = decodeURIComponent(href!.split('text=')[1]!);
  expect(body).toBe('Bok! Gledam cjenik i želim dogovoriti čišćenje.');
});

test('homepage has no calculator and hero points at the cjenik', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#kalkulator')).toHaveCount(0);
  await expect(page.locator('a[href="#cjenik"]').first()).toBeVisible();
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

  const split = await page.locator('#ba-split').boundingBox();
  expect(split!.width).toBeGreaterThan(200);
  expect(split!.height).toBeGreaterThan(200);
  const loaded = await page.locator('#ba-before-img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
  expect(loaded).toBe(true);

  await handle.focus();
  const before = Number(await handle.getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowRight');
  const after = Number(await handle.getAttribute('aria-valuenow'));
  expect(after).toBeGreaterThan(before);
});
