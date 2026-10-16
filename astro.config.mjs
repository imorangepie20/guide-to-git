// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages: site = https://<github-user>.github.io, base = /<repo-name>
	site: 'https://imorangepie20.github.io',
	base: '/guide-to-git',
	integrations: [
		starlight({
			title: 'Guide to Git',
			defaultLocale: 'root',
			locales: {
				root: { label: '한국어', lang: 'ko' },
				en: { label: 'English', lang: 'en' },
			},
			plugins: [starlightLinksValidator()],
			sidebar: [
				{
					label: '가이드',
					translations: { en: 'Guides' },
					items: [{ autogenerate: { directory: 'guides' } }],
				},
			],
		}),
	],
});
