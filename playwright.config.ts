import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;

export default defineConfig({
	testDir: './tests/e2e',
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? 'github' : 'list',
	use: { baseURL: `http://localhost:${PORT}/guide-to-git/` },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: `npm run build && npm run preview -- --port ${PORT}`,
		url: `http://localhost:${PORT}/guide-to-git/`,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
