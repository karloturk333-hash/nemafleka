import { defineConfig, devices } from '@playwright/test';

// Runs against a static server of `dist/` (default :8088). In CI/Docker pass BASE_URL.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8088',
    trace: 'off',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
