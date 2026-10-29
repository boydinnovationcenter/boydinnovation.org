import { getCollection, type CollectionEntry } from 'astro:content';
import { site } from '../config/site';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const postUrl = (post: Post) => `/blog/${post.id}`;

/** Squarespace tag URLs use + for spaces: "Tech Incubator" → /blog/tag/Tech+Incubator. */
export const tagSlug = (tag: string) => tag.replace(/ /g, '+');
export const tagUrl = (tag: string) => `/blog/tag/${tagSlug(tag)}`;

/** Browser-tab title, as Squarespace builds it. */
export const postTitle = (post: Post) => `${post.data.seoTitle ?? post.data.title} | Boyd Innovation`;

/** "7/22/26", in Eastern time like the live site. */
export function shortDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		month: 'numeric',
		day: 'numeric',
		year: '2-digit',
	}).format(date);
}

/** "July 22, 2026", in Eastern time. */
export function longDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: 'America/New_York',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	}).format(date);
}

/**
 * Posts most like `post`, for the "Related Posts" links under it. Shared tags
 * count for more the rarer the tag is (sharing "Tech on Tap" says more than
 * sharing "Programs"); ties go to the post closest in date. `exclude` skips
 * posts already linked nearby (the previous/next links).
 */
export function relatedPosts(post: Post, posts: Post[], count = 2, exclude: (Post | undefined)[] = []): Post[] {
	const skip = new Set([post.id, ...exclude.map((p) => p?.id)]);
	const tagCounts = new Map<string, number>();
	for (const p of posts) for (const t of p.data.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
	const score = (other: Post) =>
		other.data.tags.filter((t) => post.data.tags.includes(t)).reduce((sum, t) => sum + 1 / (tagCounts.get(t) ?? 1), 0);
	const distance = (other: Post) => Math.abs(other.data.date.getTime() - post.data.date.getTime());
	return posts
		.filter((p) => !skip.has(p.id))
		.sort((a, b) => score(b) - score(a) || distance(a) - distance(b))
		.slice(0, count);
}

/** Split posts into list pages: page 1 at `base`, then `base/page/2`, … */
export function paginate(posts: Post[], pageSize: number, base: string) {
	const pages = Math.max(1, Math.ceil(posts.length / pageSize));
	const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
	return Array.from({ length: pages }, (_, i) => ({
		number: i + 1,
		posts: posts.slice(i * pageSize, (i + 1) * pageSize),
		newer: i > 0 ? href(i) : undefined,
		older: i < pages - 1 ? href(i + 2) : undefined,
	}));
}

export type ListPage = ReturnType<typeof paginate>[number];

/** JSON-LD for a list page (the blog or a tag). */
export function listStructuredData(name: string, path: string, posts: Post[], crumbs: { name: string; path: string }[]) {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{ '@type': 'Blog', '@id': `${site.url}/blog#blog`, url: `${site.url}/blog`, publisher: { '@id': `${site.url}/#organization` } },
			{
				'@type': 'CollectionPage',
				name,
				url: `${site.url}${path}`,
				isPartOf: { '@id': `${site.url}/blog#blog` },
				mainEntity: {
					'@type': 'ItemList',
					itemListElement: posts.map((post, i) => ({
						'@type': 'ListItem',
						position: i + 1,
						url: `${site.url}${postUrl(post)}`,
						name: post.data.title,
					})),
				},
			},
			{
				'@type': 'BreadcrumbList',
				itemListElement: crumbs.map((c, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: c.name,
					item: `${site.url}${c.path}`.replace(/\/$/, ''),
				})),
			},
		],
	};
}
