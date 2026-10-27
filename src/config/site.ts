/**
 * Site-wide settings: navigation, contact details, social profiles and the
 * public tracking IDs used by third-party integrations. See INTEGRATIONS.md
 * for what each ID does.
 */

export const site = {
	url: 'https://boydinnovation.org',
	name: 'Boyd Innovation Center',
	alternateName: 'BIC',
	legalName: 'GrowCo Columbia, Inc.',
	/** og:site_name as set in Squarespace. */
	ogSiteName: 'Boyd Innovation',
	telephone: '803-529-1112',
	address: {
		streetAddress: '711 Saluda Ave',
		addressLocality: 'Columbia',
		addressRegion: 'SC',
		postalCode: '29205',
		addressCountry: 'US',
	},
	dayPassUrl: 'https://boydinnovation.coworksapp.com/day-pass-signup/429?plan=8033',
};

export type NavLink = { label: string; href: string; external?: boolean };

export const mainNav: NavLink[] = [
	{ label: 'Programs', href: '/programs' },
	{ label: 'Space', href: '/space' },
	{ label: 'Events', href: '/events' },
	{ label: 'About', href: '/about' },
	{ label: 'Partnerships', href: 'https://partnerships.boydinnovation.org' },
];

export const headerCta: NavLink = { label: 'Book a Tour', href: '/book-a-tour' };

export const footerNav: { heading: string; links: NavLink[] }[] = [
	{
		heading: 'BIC Community',
		links: [
			{ label: 'Space', href: '/space' },
			{ label: 'Programs', href: '/programs' },
			{ label: 'Events', href: '/events' },
			{ label: 'About', href: '/about' },
			{ label: 'Contact', href: '/contact' },
			{ label: 'Blog', href: '/blog' },
		],
	},
	{
		heading: 'Come to the BIC',
		links: [
			{ label: 'Book a Tour', href: '/book-a-tour' },
			{ label: 'Book a Day Pass', href: site.dayPassUrl, external: true },
		],
	},
	{
		heading: 'Statewide Reciprocal Access',
		links: [
			{ label: 'Harbor Entrepreneurship Center', href: 'https://harborec.org/', external: true },
			{ label: 'NextGen Greenville', href: 'https://nextgengvl.org/', external: true },
			{ label: 'Emyrge Myrtle Beach', href: 'https://www.emyrge.org/', external: true },
		],
	},
];

export const socialLinks = [
	{ network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/boydinnovationcenter' },
	{ network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/boydinnovationcenter/' },
	{ network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/boydinnovationcenter/' },
] as const;

/** Public tracking IDs. These are not secrets; they appear in every page's HTML. */
export const tracking = {
	gtmId: 'GTM-KKRR74S3',
	ga4Id: 'G-PEHD1QDBW8',
	googleAdsId: 'AW-18304813097',
	/** Google Ads conversion fired when the newsletter form is submitted. */
	newsletterConversion: 'AW-18304813097/hQMsCNu--OMcEKmQtZhE',
	hubspotPortalId: '50188189',
	hubspotNewsletterFormId: 'ff76cdbb-e8b9-45fc-aae5-51f52e8ce847',
	/**
	 * HubSpot CTA pop-ups, opened by any element with the class
	 * `hs-cta-trigger-button-<id>` (see CtaButton.astro).
	 */
	hubspotCtas: {
		programInterest: '217138433433',
		eventSpaceInquiry: '217149021356',
		carolinaVenturesApplication: '218290064008',
	},
	linkedinPartnerIds: ['7841314', '7872946'],
};
