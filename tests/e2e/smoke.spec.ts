import { expect, test } from '@playwright/test';

test('한국어 홈에서 시작하기 페이지로 이동한다', async ({ page }) => {
	await page.goto('./');
	await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
	await page.getByRole('link', { name: '시작하기' }).first().click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('시작하기');
});

test('영어 홈에서 Getting started 페이지로 이동한다', async ({ page }) => {
	await page.goto('./en/');
	await expect(page.locator('html')).toHaveAttribute('lang', 'en');
	await page.getByRole('link', { name: 'Get started' }).click();
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
});
