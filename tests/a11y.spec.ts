import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/podrucje-pokrivenosti', '/dubinsko-ciscenje-krizevci']) {
  test(`a11y: ${path} has no serious/critical violations`, async ({ page }) => {
    await page.goto(path);
    // Decorative WebGL mesh can paint a light frame mid-init; axe would then flake
    // color-contrast. Sample the solid CSS fallback instead (canvas is aria-hidden).
    await page.addStyleTag({ content: 'canvas.shader-canvas{visibility:hidden!important}' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const summary = serious.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));
    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}
