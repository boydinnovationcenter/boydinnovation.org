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

/** A Register / Learn more button: a link, or Eventbrite's checkout pop-up (`url` is the fallback without JavaScript). */
const eventAction = z.union([
	z.object({ label: z.string(), href: z.string() }),
	z.object({ label: z.string(), eventbrite: z.object({ id: z.string(), url: z.url() }) }),
]);

const eventBase = (image: () => z.ZodType<ImageMetadata>) => ({
	title: z.string(),
	description: z.string(),
	image: image(),
	imageAlt: z.string(),
	actions: z.array(eventAction).default([]),
});

/**
 * Events on /events, one YAML file each in src/content/events/.
 * - "recurring": a BIC series (Tech Beans, Tech on Tap...). Always shown.
 *   With a future `next` date it shows that date; otherwise `ongoing`
 *   (e.g. "Every Tuesday") or "Next date coming soon".
 * - "community": a dated event. Dims after it ends, disappears 48 hours later.
 */
const events = defineCollection({
	loader: glob({ pattern: '*.yaml', base: './src/content/events' }),
	schema: ({ image }) =>
		z.discriminatedUnion('section', [
			z.object({
				section: z.literal('recurring'),
				...eventBase(image),
				/** Order among the series (lowest first). */
				order: z.number(),
				/** How often it meets, e.g. "WEEKLY · TUESDAYS · 8–9 AM". */
				cadence: z.string(),
				/** The next session. Leave out or let it pass to show `ongoing` / "Next date coming soon". */
				next: z.object({ start: localDateTime, end: localDateTime.optional() }).optional(),
				/** Status shown when there's no upcoming date, e.g. "Every Tuesday". */
				ongoing: z.string().optional(),
			}),
			z.object({
				section: z.literal('community'),
				...eventBase(image),
				start: localDateTime,
				/** For multi-day events. */
				end: localDateTime.optional(),
				location: z.string(),
			}),
		]),
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
			recurring: z.object({ heading: z.string(), subheading: z.string() }),
			community: z.object({ heading: z.string(), subheading: z.string() }),
			calendar: z.object({
				heading: z.string(),
				intro: z.string(),
				buttonLabel: z.string(),
				links: z.array(link),
			}),
			host: z.object({ heading: z.string(), text: z.string(), cta: link }),
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

/** Tech on Tap page. One entry ("techOnTap") in src/content/tech-on-tap.yaml. */
const techOnTap = defineCollection({
	loader: file('src/content/tech-on-tap.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				/** The next session. The date and times shown on the page are written out from these. */
				start: localDateTime,
				end: localDateTime,
				/** Venue lines, e.g. name then street address. */
				location: z.array(z.string()),
				/** The Register button (both on the page). `url` is the fallback without JavaScript. */
				register: z.object({ label: z.string(), eventbrite: z.object({ id: z.string(), url: z.url() }) }),
				video: z.object({
					/** File in public/video/, e.g. /video/tech-on-tap.mp4 */
					src: z.string(),
					/** Captions file (WebVTT) in public/video/. */
					captions: z.string().optional(),
					poster: image(),
					/** Name read out by screen readers. */
					label: z.string(),
				}),
			}),
			recent: z.object({
				/** Shown as one heading on two lines. */
				heading: z.tuple([z.string(), z.string()]),
				thanks: z.string(),
				speakers: z.array(
					z.object({
						name: z.string(),
						role: z.string(),
						photo: image(),
						linkedin: z.url(),
						company: z.string(),
						logo: image(),
						companyUrl: z.url(),
					}),
				),
			}),
			about: z.object({
				/** Paragraphs in the left box. **bold** and *italic* are supported. */
				paragraphs: z.array(z.string()),
				audienceHeading: z.string(),
				audience: z.array(z.string()),
				detailsHeading: z.string(),
				details: z.array(z.string()),
			}),
			photos: z.array(z.object({ image: image(), alt: z.string() })),
		}),
});

/** Startup Sprint page. One entry ("startupSprint") in src/content/startup-sprint.yaml. */
const startupSprint = defineCollection({
	loader: file('src/content/startup-sprint.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				heading: z.string(),
				tagline: z.string(),
				partnerLogo: image(),
				partnerLogoAlt: z.string(),
			}),
			/** Start and end, for search engines only; the dates people see are in the text below. */
			event: z.object({ start: localDateTime, end: localDateTime }),
			intro: z.object({ heading: z.string(), paragraphs: z.array(z.string()) }),
			callout: z.object({ text: z.string(), cta: link }),
			audience: z.object({ heading: z.string(), items: z.array(z.string()), image: image(), alt: z.string() }),
			application: z.object({
				heading: z.string(),
				intro: z.string(),
				/** HubSpot form ID for the application form. */
				hubspotFormId: z.string(),
			}),
			sponsors: z.object({
				heading: z.string(),
				items: z.array(
					z.object({
						name: z.string(),
						/** White logo on a transparent background. */
						logo: image(),
						/** The logo becomes a link once this is filled in. */
						url: z.url().optional(),
						/** For stacked logos that need more height to look balanced. */
						tall: z.boolean().default(false),
					}),
				),
			}),
			photos: z.array(z.object({ image: image(), alt: z.string() })),
		}),
});

/**
 * Blog posts. One folder per post in src/content/blog/<url-slug>/ with an
 * index.mdx and the post's images; the folder name is the URL
 * (/blog/<url-slug>). Folders starting with "_" (the template) are skipped.
 * See CONTENT.md ("Blog posts").
 */
const blog = defineCollection({
	loader: glob({
		pattern: '[!_]*/index.mdx',
		base: './src/content/blog',
		generateId: ({ entry }) => entry.split('/')[0],
	}),
	schema: ({ image }) =>
		z.object({
			/** Headline shown on the post and in the blog list. */
			title: z.string(),
			/** Browser-tab/search title, if different from the headline. " | Boyd Innovation" is added. */
			seoTitle: z.string().optional(),
			/** Search-result snippet. */
			description: z.string().optional(),
			/** Publish date and time (UTC, e.g. 2026-07-22T16:42:13Z). Shown in Eastern time. */
			date: z.coerce.date(),
			/** Last meaningful edit, for search engines. */
			updated: z.coerce.date().optional(),
			/** Each tag gets a page at /blog/tag/<Tag+Name>. */
			tags: z.array(z.string()).default([]),
			/** Thumbnail in the blog list, and the picture shown when the post is shared. */
			image: image(),
			/** true keeps the post off the site. */
			draft: z.boolean().default(false),
		}),
});

/** Blog list page (/blog) copy. One entry ("blog") in src/content/blog-page.yaml. */
const blogPage = defineCollection({
	loader: file('src/content/blog-page.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				eyebrow: z.string(),
				/** Headline lines, shown one per line. */
				headline: z.array(z.string()),
				image: image(),
			}),
			/** Posts per page; matches Squarespace. */
			pageSize: z.number().default(10),
		}),
});

/** Picks one of the HubSpot pop-ups in src/config/site.ts (tracking.hubspotCtas). */
const hubspotCtaName = z.enum(['programInterest', 'eventSpaceInquiry', 'carolinaVenturesApplication']);

/** Contact page. One entry ("contact") in src/content/contact.yaml. */
const contact = defineCollection({
	loader: file('src/content/contact.yaml'),
	schema: z.object({
		seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
		heading: z.string(),
		intro: z.string(),
		/** HubSpot form shown on the page. */
		hubspotFormId: z.string(),
	}),
});

/** Deep Dive Workshops page. One entry ("deepDive") in src/content/deep-dive-workshops.yaml. */
const deepDive = defineCollection({
	loader: file('src/content/deep-dive-workshops.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({ heading: z.string(), tagline: z.string() }),
			intro: z.object({
				heading: z.string(),
				/** Paragraphs; *italics* and **bold** allowed. */
				paragraphs: z.array(z.string()),
				image: image(),
				alt: z.string(),
				/** The button opens a HubSpot pop-up form. */
				cta: z.object({ label: z.string(), hubspotCta: hubspotCtaName, srContext: z.string().optional() }),
			}),
			photos: z.array(z.object({ image: image(), alt: z.string() })).length(5),
		}),
});

/** Carolina Ventures page (/programs/carolina-ventures). One entry ("carolinaVentures") in src/content/carolina-ventures.yaml. */
const carolinaVentures = defineCollection({
	loader: file('src/content/carolina-ventures.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				cta: z.object({ label: z.string(), hubspotCta: hubspotCtaName, srContext: z.string().optional() }),
			}),
			intro: z.object({ heading: z.string(), text: z.string(), image: image(), alt: z.string() }),
			schedule: z.object({
				heading: z.string(),
				/** One box per session, in date order. */
				sessions: z.array(z.object({ date: z.string(), label: z.string() })),
			}),
		}),
});

/** Event Guide page (/event-guide). One entry ("eventGuide") in src/content/event-guide.yaml. */
const eventGuide = defineCollection({
	loader: file('src/content/event-guide.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			hero: z.object({
				heading: z.string(),
				intro: z.string(),
				image: image(),
				/** The four quick-facts tiles (address, contact, Wi-Fi). */
				facts: z.array(z.object({ label: z.string(), value: z.string() })),
			}),
			parking: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				/** One box each; **bold** and [links](https://…) allowed. */
				options: z.array(z.string()),
				map: image(),
				mapAlt: z.string(),
			}),
			arrival: z.object({
				eyebrow: z.string(),
				heading: z.string(),
				cards: z.array(z.object({ title: z.string(), paragraphs: z.array(z.string()) })),
				image: image(),
				alt: z.string(),
			}),
			av: z.object({
				heading: z.string(),
				/** One box each; **bold** allowed. */
				boxes: z.array(z.string()),
				note: z.string(),
				photos: z.array(z.object({ image: image(), alt: z.string() })).length(2),
			}),
			kitchen: z.object({
				heading: z.string(),
				intro: z.string(),
				tips: z.array(z.string()),
				image: image(),
				alt: z.string(),
			}),
		}),
});

/** Links page (/links, the "link in bio" page). One entry ("links") in src/content/links.yaml. */
const links = defineCollection({
	loader: file('src/content/links.yaml'),
	schema: ({ image }) =>
		z.object({
			seo: z.object({ title: z.string(), description: z.string(), ogImage: z.url() }),
			logo: image(),
			logoAlt: z.string(),
			/** One button each, top to bottom. Links starting with http open in a new tab. */
			buttons: z.array(z.object({ label: z.string(), href: z.string() })),
		}),
});

export const collections = {
	home,
	programs,
	members,
	space,
	events,
	eventsPage,
	team,
	board,
	about,
	bookATour,
	techOnTap,
	startupSprint,
	blog,
	blogPage,
	contact,
	deepDive,
	carolinaVentures,
	eventGuide,
	links,
};
