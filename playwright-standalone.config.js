import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3007',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'design-capture',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        screenshot: 'on',
        video: 'on',
      },
      testMatch: /design-capture\.spec\.js/,
    },
  ],
});