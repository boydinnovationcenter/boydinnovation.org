// @ts-check
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import plusSignRewrites from './src/lib/plus-sign-rewrites.mjs';
import rehypeBlog from './src/lib/rehype-blog.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://boydinnovation.org',
	// Live Squarespace URLs have no trailing slash (e.g. /space, /programs).
	trailingSlash: 'never',
	build: {
		format: 'file',
	},
	integrations: [mdx(), sitemap(), plusSignRewrites()],
	markdown: {
		// Blog posts (MDX). The plugin fixes heading levels and external links (see the file).
		// gfm off: plain email addresses and URLs in post text stay plain text, as on live.
		// smartypants off: copy is kept character for character ("--" stays "--").
		processor: unified({ gfm: false, smartypants: false, rehypePlugins: [rehypeBlog] }),
	},
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
