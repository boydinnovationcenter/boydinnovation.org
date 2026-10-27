import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
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

/**
 * BIC member companies, one entry each in src/content/members.yaml.
 * A logo becomes a link once `url` is filled in.
 */
const members = defineCollection({
	loader: file('src/content/members.yaml'),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			logo: image(),
			/** Position on the page (lowest first). */
			order: z.number(),
			url: z.url().optional(),
			description: z.string().optional(),
		}),
});

/** Space page copy, prices and availability. One entry ("space") in src/content/space.yaml. */
const space = defineCollection({
	loader: file('src/content/space.yaml'),
	schema: ({ image }) => {
		const photo = () => z.object({ image: image(), alt: z.string() });
		return z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({ heading: z.string(), cta: link, image: image() }),
			spaces: z.object({
				heading: z.string(),
				options: z.array(
					z.object({ title: z.string(), description: z.string(), icon: image(), iconAlt: z.string(), link }),
				),
				dayPass: z.object({ title: z.string(), description: z.string(), link, mobileLinkLabel: z.string() }),
			}),
			membersHeading: z.string(),
			photos: z.array(photo()),
			plans: z.object({
				heading: z.string(),
				cta: link,
				items: z.array(
					z.object({
						name: z.string(),
						price: z.string(),
						/** Monthly price in dollars, for search engines. */
						amount: z.number(),
						includes: z.string().optional(),
						features: z.array(z.string()),
						/** Highlighted note shown at the bottom of the card. */
						callout: z.array(z.string()).optional(),
						featured: z.boolean().default(false),
					}),
				),
			}),
			offices: z.object({
				heading: z.string(),
				cta: link,
				items: z.array(
					z.object({
						name: z.string(),
						price: z.string(),
						amount: z.number(),
						/** Availability tag, e.g. "0/1 Available" or "1 Available". */
						availability: z.string(),
						/** Second line of the tag: a link (e.g. Join waitlist) or plain text (e.g. Starting Nov 1). */
						availabilityNote: z.union([link, z.string()]).optional(),
						features: z.array(z.string()),
						photo: photo(),
					}),
				),
			}),
			amenities: z.object({
				heading: z.string(),
				items: z.array(z.object({ icon: z.string(), text: z.string() })),
			}),
			conference: z.object({
				heading: z.string(),
				subheading: z.string(),
				cta: link,
				rooms: z.array(z.object({ name: z.string(), capacity: z.number(), rate: z.string(), photo: photo() })),
				features: z.array(z.string()),
			}),
			events: z.object({
				heading: z.string(),
				cta: z.object({ label: z.string(), hubspotCta: z.literal('eventSpaceInquiry') }),
				photos: z.array(photo()),
				venues: z.array(z.object({ name: z.string(), details: z.array(z.string()) })),
			}),
			tour: z.object({ eyebrow: z.string(), heading: z.string(), embedUrl: z.url(), title: z.string() }),
		});
	},
});

/** Eastern (Columbia, SC) local time: "2026-11-12T18:00", or a date alone, "2026-11-13". */
const localDateTime = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/, 'Use YYYY-MM-DD or YYYY-MM-DDTHH:MM, e.g. 2026-11-12T18:00');

/**
 * Events shown on /events, one YAML file each in src/content/events/.
 * Dated events dim after they end and disappear 48 hours later.
 */
const events = defineCollection({
	loader: glob({ pattern: '*.yaml', base: './src/content/events' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			/** "recurring" (Recurring Networking Events) or "upcoming" (Startup Workshops and Founder Networking Events). */
			section: z.enum(['recurring', 'upcoming']),
			/** Date and time as shown on the card, e.g. "Thu · Nov 12, 2026 · 6:00 PM". */
			dateLabel: z.string(),
			/** When it starts. Leave out for recurring events with no single date. */
			start: localDateTime.optional(),
			/** When it ends, for multi-day events. Defaults to `start`. */
			end: localDateTime.optional(),
			location: z.string(),
			description: z.string(),
			image: image(),
			imageAlt: z.string(),
			/** Order within its section when events have no date (lowest first). */
			order: z.number().default(0),
			actions: z
				.array(
					z.union([
						z.object({ label: z.string(), href: z.string() }),
						/** Opens Eventbrite's checkout pop-up; `url` is the fallback without JavaScript. */
						z.object({ label: z.string(), eventbrite: z.object({ id: z.string(), url: z.url() }) }),
					]),
				)
				.default([]),
		}),
});

/** Events page copy (the events themselves are in src/content/events/). */
const eventsPage = defineCollection({
	loader: file('src/content/events-page.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				heading: z.string(),
				intro: z.string(),
				image: image(),
				actions: z.array(link),
			}),
			recurringHeading: z.string(),
			upcomingHeading: z.string(),
			calendar: z.object({
				heading: z.string(),
				intro: z.string(),
				buttonLabel: z.string(),
				links: z.array(link),
			}),
			photos: z.array(z.object({ image: image(), alt: z.string() })),
		}),
});

/** Staff shown under "Our Team" on /about, one entry each in src/content/team.yaml. */
const team = defineCollection({
	loader: file('src/content/team.yaml'),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string(),
			order: z.number(),
			photo: image(),
			photoAlt: z.string(),
			email: z.email().optional(),
			linkedin: z.url().optional(),
		}),
});

/** Board of Directors on /about, one entry each in src/content/board.yaml. */
const board = defineCollection({
	loader: file('src/content/board.yaml'),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			/** Title and organization, e.g. "Founder, HuntStand". */
			affiliation: z.string(),
			order: z.number(),
			photo: image(),
			photoAlt: z.string(),
		}),
});

/** About page copy. One entry ("about") in src/content/about.yaml. */
const about = defineCollection({
	loader: file('src/content/about.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				eyebrow: z.string(),
				/** Three lines; the middle one gets the green hand-drawn underline. */
				headline: z.tuple([z.string(), z.string(), z.string()]),
				actions: z.array(link),
				drawing: image(),
			}),
			story: z.object({
				image: image(),
				alt: z.string(),
				paragraphs: z.array(z.string()),
				stats: z.array(z.object({ value: z.string(), label: z.string() })),
			}),
			teamHeading: z.string(),
			boardHeading: z.string(),
		}),
});

/** Book a Tour page. One entry ("bookATour") in src/content/book-a-tour.yaml. */
const bookATour = defineCollection({
	loader: file('src/content/book-a-tour.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			heading: z.string(),
			image: image(),
			/** HubSpot Meetings scheduling link. */
			meetingsUrl: z.url(),
		}),
});

export const collections = { home, programs, members, space, events, eventsPage, team, board, about, bookATour };
