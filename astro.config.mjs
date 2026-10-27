// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://boydinnovation.org',
	// Live Squarespace URLs have no trailing slash (e.g. /space, /programs).
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	integrations: [sitemap()],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Space Grotesk',
			cssVariable: '--font-sans',
			weights: ['300 700'],
			styles: ['normal'],
			fallbacks: ['sans-serif'],
		},
		{
			// Used only for the hero headline, as on the live site.
			provider: fontProviders.google(),
			name: 'Space Mono',
			cssVariable: '--font-mono',
			weights: [400],
			styles: ['normal'],
			fallbacks: ['monospace'],
		},
	],
});
