/**
 * Astro integration: keeps URLs with a "+" (Squarespace tag pages such as
 * /blog/tag/Tech+Incubator) working on Cloudflare without a redirect.
 *
 * Cloudflare redirects /blog/tag/Tech+Incubator to /blog/tag/Tech%2BIncubator
 * (307) before serving it. The live site serves the "+" address directly, and
 * that's the address in the sitemap and the canonical tag. After each build
 * this appends a rewrite (status 200: same address, file served from the
 * encoded path) to dist/_redirects for every built page with "+" in its path.
 */
import { appendFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, sep } from 'node:path';

async function htmlFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((e) => (e.isDirectory() ? htmlFiles(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : [])),
	);
	return nested.flat();
}

export default function plusSignRewrites() {
	return {
		name: 'plus-sign-rewrites',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const root = fileURLToPath(dir);
				const paths = (await htmlFiles(root))
					.map((file) => '/' + relative(root, file).split(sep).join('/').replace(/\.html$/, ''))
					.filter((path) => path.includes('+'));
				if (!paths.length) return;
				const lines = paths.map((path) => `${path} ${path.replaceAll('+', '%2B')} 200`);
				await appendFile(
					join(root, '_redirects'),
					`\n# --- Added at build time (src/lib/plus-sign-rewrites.mjs): serve "+" URLs without a redirect ---\n${lines.join('\n')}\n`,
				);
				logger.info(`Added ${lines.length} rewrites for URLs with "+" to _redirects`);
			},
		},
	};
}
