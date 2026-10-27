import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
	label: z.string(),
	href: z.string(),
});

/**
 * Homepage copy and images. One entry ("home") in src/content/home.yaml.
 * See CONTENT.md for how to edit it.
 */
const home = defineCollection({
	loader: file('src/content/home.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({
				title: z.string(),
				description: z.string(),
				ogImage: z.url(),
			}),
			hero: z.object({
				/** Headline lines, shown one per line. Wrap letters in [brackets] to color them green. */
				headline: z.array(z.string()),
				poster: image(),
			}),
			explore: z.object({
				heading: z.string(),
				cards: z.array(
					z.object({
						title: z.string(),
						href: z.string(),
						image: image(),
						alt: z.string(),
					}),
				),
			}),
			spaces: z.object({
				heading: z.string(),
				options: z.array(
					z.object({
						title: z.string(),
						description: z.string(),
						icon: image(),
						iconAlt: z.string(),
						link: link,
					}),
				),
				dayPass: z.object({
					title: z.string(),
					description: z.string(),
					link: link,
					/** Shorter link shown under the section heading on phones instead of the card. */
					mobileLinkLabel: z.string(),
				}),
			}),
			events: z.object({
				heading: z.string(),
				tagline: z.string(),
				paragraphs: z.array(z.string()),
				cta: link,
				series: z.array(
					z.object({
						title: z.string(),
						description: z.string(),
						image: image(),
						alt: z.string(),
						link: link,
					}),
				),
			}),
			programs: z.object({
				heading: z.string(),
				cta: link,
				stages: z.array(
					z.object({
						label: z.string(),
						color: z.enum(['green', 'blue', 'navy', 'black']),
						programs: z.array(
							z.object({
								title: z.string(),
								/** Part of the title that is linked; defaults to the whole title. */
								linkText: z.string().optional(),
								href: z.string(),
								description: z.string(),
							}),
						),
					}),
				),
			}),
		}),
});

const stageColor = z.enum(['green', 'blue', 'navy', 'black']);

/** A button: either a link (`href`) or a HubSpot pop-up (`hubspotCta`, a key of `tracking.hubspotCtas`). */
const action = z
	.object({
		label: z.string(),
		href: z.string().optional(),
		hubspotCta: z.enum(['programInterest', 'eventSpaceInquiry', 'carolinaVenturesApplication']).optional(),
	})
	.refine((a) => !!a.href !== !!a.hubspotCta, { message: 'Give a button exactly one of href or hubspotCta.' });

/**
 * Programs page copy and every program listed on it. One entry ("programs")
 * in src/content/programs.yaml. See CONTENT.md for how to edit it.
 */
const programs = defineCollection({
	loader: file('src/content/programs.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({
				title: z.string(),
				description: z.string(),
				ogImage: z.url(),
			}),
			hero: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				cta: action,
				image: image(),
				alt: z.string(),
			}),
			stages: z.array(
				z.object({
					/** Used for the #anchor the hero's stage cards link to. */
					id: z.string().regex(/^[a-z0-9-]+$/),
					name: z.string(),
					tagline: z.string(),
					color: stageColor,
					programs: z.array(
						z.object({
							title: z.string(),
							/** Short label in the card's corner, e.g. "MONTHLY" or "FALL 2026". */
							badge: z.string().optional(),
							/** Paragraphs. **bold** and *italic* are supported. */
							description: z.array(z.string()).min(1),
							actions: z.array(action).default([]),
						}),
					),
				}),
			),
			recurring: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				items: z.array(z.object({ title: z.string(), description: z.string() })),
			}),
			photos: z.array(z.object({ image: image(), alt: z.string() })),
			closing: z.object({
				heading: z.string(),
				cta: action,
			}),
		}),
});

export const collections = { home, programs };
