#!/usr/bin/env node
/**
 * responsive-check — build the Astro site, serve dist/, and inspect the two
 * pages across the project's 4 reference viewports with a real (system)
 * Chromium so the WebGL hero shader actually renders.
 *
 * Run from the project root:  node .claude/skills/responsive-check/responsive-check.mjs
 *
 * For each viewport it:
 *   - takes a full-page screenshot into /tmp
 *   - logs horizontal overflow (scrollWidth - clientWidth) — must be 0
 *   - logs the computed font-size of the key type ramp elements
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..', '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 8099);

// System Chromium that ships WebGL/SwiftShader in this environment.
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const CHROME_ARGS = [
  '--use-gl=angle',
  '--use-angle=swiftshader',
  '--enable-unsafe-swiftshader',
  '--ignore-gpu-blocklist',
];

const VIEWPORTS = [
  { name: 'pixel',   width: 393,  height: 851 },
  { name: 'iphone13', width: 390, height: 844 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'coverage', path: '/podrucje-pokrivenosti/' },
];

const TYPE_SELECTORS = ['.hero-h1', '.hero-sub', '.section-h2', '.section-sub', '.price-group-title'];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function tryFiles(urlPath) {
  // Astro static: map / -> index.html, /foo/ -> foo/index.html, else file.
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  const candidates = [];
  if (clean.endsWith('/')) {
    candidates.push(join(DIST, clean, 'index.html'));
  } else {
    candidates.push(join(DIST, clean));
    candidates.push(join(DIST, clean, 'index.html'));
    candidates.push(join(DIST, clean + '.html'));
  }
  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

function startServer() {
  const server = createServer(async (req, res) => {
    const file = await tryFiles(req.url || '/');
    if (!file) { res.statusCode = 404; res.end('not found'); return; }
    try {
      const buf = await readFile(file);
      res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] || 'application/octet-stream');
      res.end(buf);
    } catch {
      res.statusCode = 500; res.end('error');
    }
  });
  return new Promise((res) => server.listen(PORT, () => res(server)));
}

async function main() {
  console.log('> npm run build');
  const build = spawnSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' });
  if (build.status !== 0) { console.error('Build failed.'); process.exit(1); }

  const server = await startServer();
  console.log(`> serving dist/ on http://localhost:${PORT}`);

  const browser = await chromium.launch({ executablePath: CHROME, args: CHROME_ARGS });

  let anyOverflow = false;
  for (const page of PAGES) {
    console.log(`\n=== PAGE ${page.name} (${page.path}) ===`);
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const p = await ctx.newPage();
      await p.goto(`http://localhost:${PORT}${page.path}`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(700); // let the shader + fonts settle

      const overflow = await p.evaluate(() => {
        const de = document.documentElement;
        return de.scrollWidth - de.clientWidth;
      });

      const fonts = await p.evaluate((sels) => {
        const out = {};
        for (const sel of sels) {
          const el = document.querySelector(sel);
          out[sel] = el ? getComputedStyle(el).fontSize : 'n/a';
        }
        return out;
      }, TYPE_SELECTORS);

      const shot = `/tmp/rc-${page.name}-${vp.name}.png`;
      await p.screenshot({ path: shot, fullPage: true });

      const flag = overflow > 0 ? '  <-- OVERFLOW' : '';
      if (overflow > 0) anyOverflow = true;
      console.log(`  [${vp.name} ${vp.width}x${vp.height}] overflow=${overflow}px${flag}`);
      const fontStr = Object.entries(fonts).map(([k, v]) => `${k}=${v}`).join('  ');
      console.log(`      type: ${fontStr}`);
      console.log(`      shot: ${shot}`);

      await ctx.close();
    }
  }

  await browser.close();
  server.close();

  if (anyOverflow) {
    console.log('\nRESULT: FAIL — horizontal overflow detected on at least one viewport.');
    process.exit(2);
  }
  console.log('\nRESULT: PASS — no horizontal overflow on any viewport.');
}

main().catch((e) => { console.error(e); process.exit(1); });
