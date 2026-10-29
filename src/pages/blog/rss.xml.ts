/** RSS feed of the blog (/blog/rss.xml), newest first, for feed readers and newsletter tools. */
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getEntry } from 'astro:content';
import { site } from '../../config/site';
import { getPosts, postUrl } from '../../lib/blog';

export async function GET(context: APIContext) {
	const page = await getEntry('blogPage', 'blog');
	const posts = await getPosts();
	return rss({
		title: `${site.name} Blog`,
		description: page!.data.seo.description,
		site: `${context.site?.origin ?? site.url}/blog`,
		// Site URLs have no trailing slash (/blog/tech-on-tap-july-2026).
		trailingSlash: false,
		items: posts.map((post) => ({
			title: post.data.title,
			link: `${site.url}${postUrl(post)}`,
			pubDate: post.data.date,
			description: post.data.description,
			categories: post.data.tags,
		})),
		customData: '<language>en-us</language>',
	});
}
