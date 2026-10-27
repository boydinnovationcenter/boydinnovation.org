import type { APIRoute } from 'astro';

// Preview builds block all crawlers. Set PUBLIC_SITE_ENV=production only for the launch build.
const isProduction = import.meta.env.PUBLIC_SITE_ENV === 'production';

export const GET: APIRoute = ({ site }) => {
	const body = isProduction
		? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
		: 'User-agent: *\nDisallow: /\n';

	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
