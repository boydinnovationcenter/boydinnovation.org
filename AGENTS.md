## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project Overview and Goals

The Boyd Innovation Center (BIC) is Columbia, South Carolina's tech startup hub. It helps founders build scalable technology companies in the greater Columbia area through coworking, private offices, an event venue, startup programs (including the Carolina Ventures student founder cohort), community infrastructure, and early-stage investment through the GrowCo Fund. BIC is a dba of GrowCo Columbia, Inc., a South Carolina 501(c)(3) nonprofit.

This project migrates boydinnovation.org from Squarespace 7.1 (Fluid Engine) to Astro. The goal is to faithfully recreate the existing website while improving its underlying technical foundation.

Success means delivering a visually and functionally accurate recreation of the current website, with clean, maintainable, well-documented code, reduced page weight, improved loading performance, and strong technical SEO and AEO foundations. Particular emphasis should be placed on making the site's content (programs, membership and workspace options, events, member companies, and the organization itself) accessible, semantically structured, and understandable to both traditional search engines and AI-powered search systems.

This project is strictly a migration, not a redesign. The scope does not include changing existing copy, branding, website structure, layout, visual design, or functionality. Behind-the-scenes technical improvements are encouraged as long as they preserve the existing user experience.

When technical improvements conflict with visual or functional fidelity, flag the tradeoff and request approval rather than independently changing the website.

The final deliverable should be production-ready and available for review, but must not replace the live Squarespace website until the BIC team explicitly approves the transition. Do not change DNS, domain settings, or anything on the live Squarespace site.

## Brand and Design System

- Colors: #00031F, #041E33, #03304D, #0099FF, #59FF66, #DEF0EA, #ECF6F2
- Typeface: Space Grotesk
- Define colors, type scale, and spacing as CSS custom properties in one place so they stay consistent across pages.
- The live site uses a custom CSS layer on top of Squarespace. Recreate its effects, including:
  - the hero overlap cluster, which is built with `translate` transforms;
  - sections that show only on mobile or only on desktop (rebuild these as one responsive layout where possible so content isn't duplicated in the HTML; if that isn't possible without changing what users see, flag it);
  - branded styling for Eventbrite buttons.
- Do not carry over Squarespace's generated class names, wrapper markup, or unused CSS and JS. Rebuild with clean, semantic components.

## Responsive Design and Cross-Device Fidelity

The desktop layout of the live site is the visual reference. On tablet and mobile, the goal is a layout that works well at every width, not a pixel-for-pixel copy of what Squarespace currently produces. Some live pages and sections break or feel cramped on smaller screens. Fixing those problems is in scope.

Keep the same content, copy, branding, and section order on every screen size. Within that, you may change how layouts adapt to smaller screens: stacking, column counts, spacing, image cropping, type sizes, and where layouts change at breakpoints. Build layouts to be fluid between breakpoints (flexbox, grid, clamp(), relative units) rather than tuned only for a few fixed widths. Do not assume mobile layouts should simply be scaled-down desktop layouts.

Fluid Engine places blocks separately on desktop and mobile, so the live mobile layout may differ from desktop in order and spacing. Where the live mobile layout works well, match it. Where it doesn't, use the desktop layout as the guide for what the section should communicate, and design a small-screen version that keeps that intent.

Treat any of the following as a breakage to fix: content that scrolls the page sideways, text or images that overlap or get clipped, text too small to read, tap targets under 24×24 CSS pixels, elements that overflow their containers, layouts that collapse awkwardly between breakpoints, and navigation that is hard to use on touch screens. The hero overlap cluster's translate transforms are a likely source of overflow on narrow screens; keep the overlapping effect where it fits and simplify it where it doesn't.

Test every page at a range of widths, at minimum 320, 375, 414, 768, 1024, 1280, and 1440 pixels, and also drag through the widths between them. Check landscape on phones and tablets, and check that pages still work with browser zoom at 200% and text spacing increased (WCAG 1.4.4, 1.4.10, 1.4.12).

You can fix small-screen breakages without asking first. Record each one in MIGRATION-NOTES.md with the page, the viewport widths affected, what was broken on the live site, and what you changed. Ask for approval before any change that alters the desktop layout, changes content order, hides or removes content on any screen size, or substantially redesigns a section rather than fixing it. When proposing a larger change, describe the problem and the options, and include before and after screenshots where possible.

## Content Management

The site was built on Squarespace partly so non-technical team members could edit content. The Astro build must keep routine updates manageable without touching component code.

- Store frequently updated content (events, programs, member companies, team, FAQs) in Astro content collections with typed schemas, as Markdown or JSON files.
- Keep page copy out of component logic wherever practical.
- Document how to add or edit each content type in a `CONTENT.md` written for non-developers.
- If a headless CMS would be needed for the team to edit content without Git, flag it and recommend options rather than choosing one.

### Member companies

The site is being updated to showcase BIC member companies (logo, link, and description, collected through a HubSpot form). Model these as a content collection so new members can be added as single entries. Member logos need descriptive `alt` text (the company name), and outbound links should be clearly labeled.

## Third-Party Integrations

Preserve every integration on the live site. Inventory the live site's Code Injection (site-wide header and footer, and per-page) before building, and list what you find in `INTEGRATIONS.md`.

- **HubSpot:** tracking code and CTA popup forms. On the live site, JavaScript in Code Injection wires several Squarespace button blocks to HubSpot popups. Rebuild this with real `<button>` elements and a small, documented script, and keep the same forms, triggers, and behavior.
- **Google Tag Manager** and the **LinkedIn Insight Tag:** keep the same container and partner IDs. Load them so they don't block rendering, and don't duplicate any tag GTM already fires.
- **Eventbrite:** keep the embedded checkout widgets and branded buttons working.
- **Google Calendar:** keep the calendar subscription button.
- Any other embeds found in the inventory.

Third-party scripts are the biggest threat to page weight. Load them as late as their function allows, but flag any change in timing that could affect tracking or conversion data before making it.

## URLs, Redirects, and SEO

- Keep every existing URL exactly as it is on the live site, including slugs and trailing-slash behavior. Crawl the live sitemap (`/sitemap.xml`) to build the full URL list, and confirm every URL resolves on the Astro build.
- Carry over every 301 redirect currently configured in Squarespace (including those from the earlier slug cleanup) into Astro's redirect config or the host's redirect file. Ask for an export of the Squarespace URL Mappings if you can't read them.
- Preserve each page's title, meta description, canonical URL, Open Graph and Twitter image tags exactly as they are. Do not rewrite them.
- Generate `sitemap.xml` and `robots.txt`. Keep `robots.txt` blocking all crawlers on the preview deployment so it is not indexed before launch.
- Each page has exactly one `<h1>` and no skipped heading levels. The Programs and Space pages have already been audited and fixed for this; match their corrected structure, and flag any other page where the live headings break these rules.

## AEO and Structured Data

Add JSON-LD structured data that describes what is already on the page. Do not add claims, copy, or facts that aren't visible on the site.

- `Organization` (with `NGO` or `nonprofitStatus` set to `Nonprofit501c3`): legal name GrowCo Columbia, Inc., name Boyd Innovation Center, alternate name BIC, URL https://boydinnovation.org, logo, and `sameAs` links to the social profiles linked in the site footer.
- `Place` or `LocalBusiness` for the building at 711 Saluda Ave, Five Points, Columbia, SC 29205, with hours only if they appear on the site.
- `Event` for event listings, `FAQPage` only where a visible FAQ exists, and `BreadcrumbList` where it fits the site structure.
- Validate all structured data with Google's Rich Results Test and the Schema.org validator.

## Performance

- Ship zero client-side JavaScript by default. Use Astro islands only where interactivity requires it.
- Use Astro's `<Image />` / `<Picture />` for responsive, modern-format images with explicit dimensions. Lazy-load below-the-fold images and do not lazy-load the hero image.
- Target good Core Web Vitals on mobile (LCP < 2.5s, CLS < 0.1, INP < 200ms). Record Lighthouse scores for the live site and the Astro build on the same pages and include the comparison in your report.

## Accessibility

Accessibility is a priority and must be built into the site's code, not added on afterward. Target WCAG 2.2 AA.

- Use semantic HTML: native elements (`<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<footer>`) and a logical heading order, not generic `<div>`s with click handlers. Reach for ARIA only when no native element fits.
- Every interactive element must work with a keyboard and show a visible focus state. Menus, popups (including the HubSpot popups) and dialogs must manage focus and close with Escape.
- Give meaningful images descriptive `alt` text and decorative images `alt=""`. Every form field needs a programmatically associated label, and errors must be announced, not shown only by color.
- Check color contrast for every text and background pairing, particularly the brand green `#59FF66` used on light backgrounds.
- Respect `prefers-reduced-motion` for animation, video autoplay and smooth scrolling.
- Do not add accessibility overlay widgets (e.g. accessiBe, UserWay). They don't fix the underlying code, often conflict with screen readers, and provide no ADA or WCAG compliance.
- Where the live site has an accessibility problem, fixing it in code is encouraged as long as the visible design and behavior stay the same. If a fix would change the visual design or behavior, flag it for approval, as with any other deviation.

## Working Agreements

- Work page by page and confirm each page against the live site at desktop, tablet, and mobile widths before moving on.
- Keep a running `MIGRATION-NOTES.md` listing every deviation, flagged tradeoff, open question, and integration found.
- Never commit secrets or API keys. Public tracking IDs may live in a single config file.
- Do not invent copy, images, or data. If something on the live site can't be accessed or recreated, stop and ask.