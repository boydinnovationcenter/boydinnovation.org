# Migration notes

Running log of deviations, flagged tradeoffs, open questions and integrations, kept page by page. See [INTEGRATIONS.md](INTEGRATIONS.md) for third-party code.

## Homepage (`/`)

Reference: live site captured 2026-10-27 at 1440px and 390px.

### Rebuilt Squarespace workarounds

| Live workaround | Rebuild |
|---|---|
| Hero overlap cluster: 13 blocks moved with `translate: 0 500px` (`0 300px` on mobile), plus an empty white spacer section and `overflow: visible` overrides | One `explore` section pulled up over the hero with a negative margin ([Hero.astro](src/components/home/Hero.astro)). Same visual overlap, no transforms, no spacer section, no overflow at any width. |
| Day Pass: card hidden on mobile, a separate "BOOK A DAY PASS ▶" block hidden on desktop | Same behavior, done with one media query in [SpaceOptions.astro](src/components/home/SpaceOptions.astro). The link appears twice in the HTML, and the description is still hidden on phones. See open question 3. |
| Hero video: Squarespace HLS stream played at 0.75× by JavaScript, at 65% opacity over navy | **Re-edited from the original footage (approved by Kennedy, 2026-10-27);** see "Hero video edit" below. Silent MP4, 1080p (4.8 MB) and 720p for phones (2.5 MB), with any slow motion baked in so no JS is needed for speed. The 65% opacity is matched with a CSS overlay. A WebP poster loads first and is the LCP element. The video doesn't play for visitors with reduced motion or data saver turned on. |
| Gradient underline under the Programs heading: a 2253px PNG | CSS gradient in the brand colors |
| Swirl texture "Learn more" button: image block stacked under a button block, with a hover scale animation | One link with the texture as its background; the hover scale is kept and switched off under reduced motion |
| Image hover fade (`opacity: .75`) via block IDs in custom CSS | Same effect on the explore cards |

### Hero video edit

The live loop is a heavily compressed Squarespace stream. It was rebuilt from the originals in `~/Desktop/BIC Video`, which are not in the repo. The loop is 21.25 s at 24 fps, silent. Interviews, people talking to camera, name captions, title cards and slide text are left out because the video plays without sound behind the headline.

| # | Source | In–out (s) | Speed | Shot | Exposure trim |
|---|---|---|---|---|---|
| 1 | C1822.MP4 | 1.6–4.6 | 0.75× | Office hallway push-in | none |
| 2 | Alpha Boyd Innovation Center 2 copy.MP4 | 24.0–26.9 | 1× | Networking crowd, wide | none |
| 3 | Launchpad Pitch Night Full Recap.mp4 | 70.5–72.3 | 1× | Audience filming a pitch on a phone | gamma 0.62 |
| 4 | Alpha… | 54.8–56.6 | 1× | Crowd at an event | none |
| 5 | C1820.MP4 | 2.0–5.2 | 0.75× | Coworking room | none |
| 6 | Alpha… | 68.0–70.6 | 1× | High-five while networking | gamma 0.60 |
| 7 | Launchpad… | 100.8–102.2 | 1× | Pitch-night food table | none |
| 8 | Alpha… | 123.7–126.0 | 1× | Full-house crowd | gamma 0.84 |

The exposure trims bring the bright daytime shots down to the brightness range of the old loop, so the white headline stays readable without making the overlay darker than live. The encode is H.264 at CRF 28 (1080p and 720p, `-movflags +faststart`); the poster is the first frame.

### Small-screen fixes (no approval needed per AGENTS.md)

| Widths | Problem on the live site | Change |
|---|---|---|
| 768–1023px | Programs timeline squeezes 4 columns into ~150px each, so titles break to one word per line | 2×2 grid from 768px; the 4-column staircase starts at 1024px |
| 768–1023px | Space cards and the Day Pass card share a row, so descriptions wrap to 5+ lines | Day Pass card sits below the list until 1024px |
| 768–1023px | "Tech Startup Events" text box and event series box side by side, cramped | Stacked until 1024px; the two event series stay side by side |

Checked at 320, 390, 768, 1024 and 1440px with no horizontal scroll.

### Technical and accessibility changes (no visible difference)

- One `<h1>`; heading levels run h1 → h2 → h3 with no skips. The newsletter subtitle was an `<h3>` on the live site and is now a `<p>` with the same style, because it isn't a heading.
- Footer column titles ("BIC Community", etc.) are now `<h2>`s instead of bold text, so screen-reader users can jump to them.
- Explore cards: the whole card is clickable as before, but the link text is now the card title instead of an unlabeled image link (Lighthouse flagged "Links do not have a discernible name" on the live site).
- "LEARN MORE ▶" links carry hidden text naming their target (e.g. "about Office Space") for screen readers.
- Links that open a new tab say so to screen readers.
- Mobile menu: a real `<button>` with `aria-expanded`. Escape closes it, and focus stays inside the menu while it's open.
- Added a "Skip to content" link, shown on keyboard focus.
- Phone number in the footer is now a `tel:` link.
- Footer logo has `alt="Boyd Innovation Center"` (it was empty on the live site).
- Images are served as responsive WebP with explicit dimensions. Everything below the hero lazy-loads.
- Fonts (Space Grotesk, Space Mono) are self-hosted by Astro with preload and metric-matched fallbacks, instead of the Google Fonts `@import` and Squarespace font loader.
- The HubSpot tracking script was loaded twice and the LinkedIn loader twice; each now loads once (same IDs).
- Preview builds output `noindex` and a `robots.txt` that blocks crawlers. Building with `PUBLIC_SITE_ENV=production` removes both.

### Structured data

The live site had a hand-written `LocalBusiness` JSON-LD block that claimed **24/7 opening hours** (not shown anywhere on the site), used `https://www.boydinnovation.org/` (www), and pointed `logo` at an image in a different Squarespace site's library. It has been replaced by an `@graph` with:

- `NGO` (`nonprofitStatus: Nonprofit501c3`), legal name GrowCo Columbia, Inc., alternate name BIC, logo, address, phone, and `sameAs` for the three footer social profiles
- `Place` for 711 Saluda Ave in Five Points (no hours)
- `WebSite`

It still needs a run through Google's Rich Results Test and the Schema.org validator once a public preview URL exists.

### Performance (Lighthouse, mobile, 2026-10-27)

| | Live (Squarespace) | Astro build (local preview) |
|---|---|---|
| Performance | 32 / 45 / 47 | 72 / 98 / 98 / 98 |
| LCP | 19.3–21.3 s | 1.8–1.9 s (one outlier run at 4.2 s) |
| FCP | 5.3–6.6 s | 0.9 s |
| Total blocking time | 430–1,290 ms | 130–160 ms (one run at 520 ms) |
| CLS | 0–0.039 | 0 |
| Page weight | 10.4 MB | 2.9 MB (1.2 MB of it is the hero video) |
| Accessibility | 96 | 96 (remaining issue: label contrast, open question 1) |

The Astro numbers come from a local server, so they will shift on real hosting. They will be re-measured on the preview deployment. Most of the remaining weight and blocking time is third-party scripts (HubSpot, Google, LinkedIn), whose timing is unchanged on purpose.

### Live-site issues noticed, not changed

- The HubSpot reCAPTCHA shows "This reCAPTCHA is for testing purposes only" on the live site too. This is a HubSpot account setting.
- `/home` returns a full duplicate of the homepage (HTTP 200) and is listed in the live sitemap. It should become a 301 to `/` at launch (to confirm).
- `og:image` / `twitter:image` point to an `http://static1.squarespace.com/...` URL. They are kept exactly as instructed, but **they will break when the Squarespace site is cancelled** (open question 4).

### Open questions

1. **Contrast:** the "ECOSYSTEM ENGAGEMENT" label (green `#59FF66` on `#ECF6F2`, about 1.3:1) and "IDEATION" (blue `#0099FF`, about 2.9:1) fail WCAG AA (4.5:1). Keep as live, or darken only the label text and keep the dots in the brand colors?
2. **Probable live-site mistakes, kept as-is for now:**
   - The Tech Beans "LEARN MORE" button links to `/tech-on-tap`.
   - In "Product Jam" and "Growth Jam", only the first word is linked.
3. **Mobile order and content:** on phones the live explore cards show Space, Programs, Events; the rebuild uses the desktop order (Programs, Space, Events) on every screen, per the "same order on every screen" rule. The Day Pass description is also hidden on phones on the live site, and that is preserved.
4. **og:image hosting:** keep the Squarespace URL until launch and switch to a self-hosted copy of the same image at launch?
5. **Hosting:** where will the site be deployed (e.g. Cloudflare Pages, Netlify, Vercel)? This decides how redirects (Squarespace URL Mappings) and trailing-slash handling are configured.
6. **Tracking:** does GTM already fire GA4 `G-PEHD1QDBW8`? Is LinkedIn partner `7841314` or `7872946` obsolete? (See INTEGRATIONS.md.)
7. **CMS:** editing `home.yaml` requires Git. If non-technical editors need a web UI, the Git-based options that fit this setup are Decap CMS (free), TinaCMS and CloudCannon. The choice can wait until more pages are migrated.

## Programs (`/programs`)

Reference: live site captured 2026-10-27 at 1440px and 390px. Title, meta description, canonical and social tags are copied exactly.

### Approved redesign of the program timeline (Kennedy, 2026-10-27)

The light "programs by stage" section was rebuilt as a **tidied timeline**. It keeps the same programs, copy, order, stage colors and color rail. What changed:

- Each stage is an even two-column grid with equal card heights. On the live site, card widths changed from row to row and the rows were ragged.
- Every card has the same layout: title and corner badge on one row, description, then buttons at the bottom. The live site had a large gap above each title and a two-line "Next cohort: Spring 2027" badge.
- **Apply is the main button** (filled green) and Learn more is outlined beside it. Apply now comes first; on the live site the two were identical outlined buttons stacked with Learn more on top.
- The rail runs continuously to the end of the Traction cards. On the live site it stopped partway, and it was made of five images; it's now CSS.
- Card text stays at the live size (about 12.5px), as chosen.
- **Hero stage cards now link** to their stage (`#ecosystem-engagement`, `#ideation`, `#launch`, `#traction`).
- **Hero "Book a Tour" fixed:** on the live site it had no link and no pop-up, so it did nothing. It now goes to `/book-a-tour`, like the header button.

### Fixes and technical changes

- **Mobile badge mix-up fixed:** on phones the live site showed Growth Jam as "Coming soon" and the Traction cohort as "Fall 2026", the reverse of desktop. Desktop is correct, and each badge now belongs to its card, so this can't happen again.
- HubSpot pop-ups are real `<button>`s carrying HubSpot's `hs-cta-trigger-button-<id>` class, set in content (`hubspotCta: programInterest`). The site-wide footer script that added those classes to Squarespace block IDs is no longer needed.
- Headings: h1 → h2 per stage → h3 per program, then h2 Recurring Programs. "Interested in upcoming programs at the BIC?" stays an h3, as on the live page. Lighthouse flagged a heading-order issue on the live page; the rebuild passes.
- The hero photo had `alt=""` on the live site; it now has a plain description.
- "Members only" cards no longer have a fixed height on phones (the live site left a large empty area under the text).
- Photo strip: same five photos edge to edge on desktop (2:3:3:3:2 widths); a two-column collage on phones.
- Structured data: `BreadcrumbList` (Home > Programs) and an `ItemList` of the ten programs with their visible descriptions.
- The hero's texture background is 800px wide on phones and 1920px on larger screens, so it doesn't slow the hero photo.

Small-screen check: 320, 390, 768, 1024 and 1440px with no horizontal scroll.

### Performance (Lighthouse, mobile, 2026-10-27)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 55 / 56 | 98 / 99 / 99 |
| LCP | 20.4–20.5 s | 1.7 s |
| FCP | 4.9 s | 0.9 s |
| Accessibility | 98 | 100 |
| Page weight | 3.3–4.0 MB | 2.1 MB |

### Open questions

8. **HubSpot "Program Interest" form names don't match the page:** the form offers "Product Seminar", "Growth Seminar", "Stage-Based Mastermind Groups" and "Advisor Office Hours", but the page says Product Jam, Growth Jam, Stage Based Peer Groups and Advisor Fridays. This needs updating in HubSpot.
9. **Stage label contrast** (see question 1): the green "ECOSYSTEM ENGAGEMENT" heading and the white-on-blue badges have the same contrast issue as the homepage labels.

## Space (`/space`)

Reference: live site captured 2026-10-27 at 1440, 1024, 768 and 390px. Title, meta description, canonical and social tags are copied exactly. Section anchors are kept: `#coworkingplans`, `#officerentals`, `#conferencerooms`, `#eventspace`, `#virtualtour`. The homepage links to the first four.

### Layout fixes (Kennedy asked for layout issues to be fixed, 2026-10-27)

| Area | Problem on the live site | Rebuild |
|---|---|---|
| Office Space, 768px and up | The 3–6 Person card overlapped the 1–3 Person card; the zig-zag rows had different heights | **Approved:** alternating rows (details + photo, photo + details) of equal height that never overlap |
| Office Space, 768–1023px | The availability tags wrapped one letter per line ("Availab / le") | The tag sizes to its text |
| Office Space, phones | Large empty space under each card (fixed heights) | Cards size to their content; photo above each card |
| Coworking Plans, all widths | The "10 day per month" callout covered the last line of the Coworking Membership card (and two lines at 768px) | The callout still straddles the card's bottom edge, but space is reserved so it never covers text |
| Coworking Plans, 768–1023px | Three plan cards squeezed into narrow columns | Stacked until 1024px |
| Amenities, 768px | The heading broke as "Amenitie / s" | Fixed |
| Amenities icons | 35px PNGs, blurry on retina screens | The same Google Material Symbols as crisp inline SVG, in brand blue |
| Conference Rooms, 768–1023px | Rates box alone in a half-width row | Full width under the two rooms |
| Member logos | Tiles of different heights at some widths | Equal tiles |
| "Book a Tour" (plans and offices) | Two separate buttons, one shown on desktop and one on phones | One button that moves (beside the heading on desktop, after the list on phones) |

### Other changes

- **Member companies** are a content collection (`src/content/members.yaml`), one entry each with name, logo and order. Optional `url` makes the logo a link (labeled "website, opens in a new tab"); optional `description` is read by screen readers. Logo alt text is the company name, per AGENTS.md. No links yet, as on live (approved).
- **Event venue accordion** uses native `<details>`, so it works with the keyboard and screen readers without JavaScript.
- **Inquire** opens the HubSpot event space inquiry pop-up (CTA `217149021356`) from a real `<button>`.
- **Virtual tour** iframe (`3d.emrynvs.com`) is kept, loaded lazily, with the same title.
- **Images:** six photos were served as 5–8 MB PNG files named `.jpg`. They are converted to JPEG sources and served as responsive WebP. The duplicate large conference room photo is stored once.
- **Structured data:** `BreadcrumbList`; the building's `Place` with its amenities, two `MeetingRoom`s and two `EventVenue`s (capacities as shown); and an `OfferCatalog` of the three memberships and three offices with their monthly prices.
- Plan and office prices were `<h4>` headings on the live site; they're now plain text styled the same, so the heading order is h1 → h2 → h3 with no skips.

Small-screen check: 320, 390, 768, 1024 and 1440px with no horizontal scroll.

### Performance (Lighthouse, mobile, 2026-10-27)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | Couldn't be scored (4 runs; no LCP recorded) | 97 / 98 |
| LCP | — | 2.1–2.2 s |
| FCP | 13.1–13.3 s | 0.9 s |
| Accessibility | 98 | 96 (contrast, open question 10) |
| Page weight | 5.0–5.2 MB | 2.4–2.8 MB |

### Open questions

10. **Contrast:** the white text on the blue availability tags and the blue office prices (`#0099FF` on light backgrounds, about 2.9:1) fail WCAG AA, the same issue as questions 1 and 9. One decision could cover all three pages: keep brand blue/green for shapes and fills, and use a darker shade for small text on light backgrounds.
11. **Office availability changes often** ("0/1 Available", "Starting Nov 1"). It's in `space.yaml` now. If it changes weekly, it may belong in the CMS (question 7).

## Events (`/events`)

Reference: live site captured 2026-10-27 at 1440, 768 and 390px. The title (`Events | Boyd Innovation`) and og:image are copied exactly. Anchors `#calendarfeed` and `#newsletter` are kept; the newsletter section on every page now has `id="newsletter"`, as on live.

### Events as content

Each event is one file in `src/content/events/` (title, date label, start/end time, location, description, image, buttons, and section: recurring or upcoming). This replaces two hand-edited Squarespace code blocks of HTML.

**Past events (approved, 2026-10-27):** the live page's script dims an event once it ends and removes it 48 hours later. Two events had malformed dates (`2026-010-10`), so Palmetto Hacks (Oct 10) and Speak Up Lab (Oct 12) were still showing. The rule now applies to every event:
- At build time, events more than 48 hours past are left out of the HTML.
- In the browser, a small script dims and removes events that pass after the last build. A section with nothing left disappears.
- Times are compared as Columbia, SC (Eastern) wall-clock time, as on live.
- The two past events' files stay in the repo so they can be reused or deleted. Tech on Tap (Oct 22) is also past and hidden; its file needs the next date and Eventbrite event.

The site should be **rebuilt daily** once hosted (a scheduled deploy), so the HTML stays current between edits.

### Fixes

- Image alt text: Palmetto Hacks was labeled "Speak Up Lab" and Startup Sprint "Next Venture Summit". Each now uses its event's name.
- Hero headline broke as "communit / y" on phones; fixed.
- Calendar section: the live page reserved a large empty area under the button for the dropdown. It's removed; the menu overlays the content instead.
- A lone event in a section is capped at two-column width instead of stretching across the page.
- The calendar dropdown is a disclosure button (`aria-expanded`) with a list of links. Escape closes it and returns focus; a click outside closes it. The live version used `role="menu"` without arrow-key support.

### Eventbrite

- Register buttons for Tech Beans and Tech on Tap open Eventbrite's checkout pop-up, as on live. They are real links to the Eventbrite event page, so they still work before the widget loads or without JavaScript. This replaces the live page's `<noscript>` fallback links.
- `eb_widgets.js` loads only on pages that have such a button, once the page is idle. On live it loaded synchronously and blocked rendering. This doesn't change tracking: Eventbrite isn't a tracking tag.
- **Testing note:** Eventbrite's checkout returns a 403 when the page is served from `localhost`. It works under a real hostname (tested with a mapped domain), so test it on the preview deployment.

### Structured data

`BreadcrumbList`, plus an `Event` for each dated event that hasn't happened yet: name, description, image, start and end with the Eastern UTC offset, in-person, scheduled. Location is the BIC `Place`, or the named venue. Recurring events without a date get no `Event`.

### Performance (Lighthouse, mobile, 2026-10-27)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 55 / 55 | 92–93 (one cold run at 76) |
| LCP | 30.9–31.2 s | 2.9 s |
| FCP | 3.7 s | 0.9 s |
| Accessibility | 96 | 96 (blue date labels, open question 10) |
| Page weight | 8.0–8.2 MB | 1.9 MB |

What's left of the LCP time is render delay from the site-wide third-party scripts (HubSpot analytics, reCAPTCHA, Google tag).

### Open questions

12. **Meta description is empty** on the live Events page. AGENTS.md says to keep meta tags exactly, so it's empty here too, but this is the one page where writing one would clearly help SEO. Want me to draft one for approval?
13. **Tech on Tap** needs its next date and Eventbrite event; until then it doesn't show (its Oct 22 date has passed).

## About (`/about`)

Reference: live site captured 2026-10-27 at 1440, 768 and 390px. Title, meta description, canonical and social tags are copied exactly.

### Content

- **Team** (`src/content/team.yaml`) and **Board of Directors** (`src/content/board.yaml`) are content collections, one entry per person, as AGENTS.md asks. Each person's order on the page is set by `order`.
- Mission copy, stats and hero text are in `src/content/about.yaml`.

### Fixes and technical changes

- **One `<h1>`:** the live headline was three separate `<h1>` elements. It's now one heading with three styled lines; the hand-drawn green underline under "scalable tech companies" is redrawn as an inline SVG.
- **"OUR MISSION" was huge on phones** (Squarespace scaled text); it's now the same small label at every width.
- **Email and LinkedIn icons:** the live icons were unlabeled image links (Lighthouse flagged "Links do not have a discernible name"). They're now crisp SVG icons with labels such as "Email Sam Herskovitz (sam@boydinnovation.org)" and "Sam Herskovitz on LinkedIn (opens in a new tab)". The email links no longer end in a stray `?`.
- **Stats** (1000+, 120+, 1.80M+, 230+) are a description list, so screen readers read each number with its label.
- **Board grid:** the centered short last row is kept, built with flexbox so it adapts to any number of directors. On phones it's two per row, as on live.
- **Alt text:** Melissa Pegus's photo had none and now names her. Joe Wilczewski's placeholder is a stock silhouette, not his photo, so it's now decorative (`alt=""`); his name is right beside it.
- **Structured data:** `BreadcrumbList`, `AboutPage`, and a `Person` for each team member (job title, email, LinkedIn, works for BIC) and each board member (affiliation, board role).

### Performance (Lighthouse, mobile, 2026-10-27)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 23 / 23 | 97 / 98 |
| LCP | 25.5–26.1 s | 1.9 s |
| FCP | 12.8–13.0 s | 0.9 s |
| Accessibility | 96 | 100 |
| Page weight | 3.4 MB | 1.9–2.0 MB |

## Book a Tour (`/book-a-tour`)

Reference: live site captured 2026-10-27. Title, meta description, canonical and social tags are copied exactly.

- Same photo hero as Space; the two pages now share one `PhotoHero` component. The headline weight matches live (medium here, bold on Space).
- **HubSpot Meetings scheduler** (`meetings.hubspot.com/kennedy-marren`) is embedded the same way as live, with HubSpot's embed script. Its link is in `src/content/book-a-tour.yaml`. On desktop HubSpot shows a narrow list of times rather than a calendar; that's HubSpot's own layout and matches live.
- **Fixed:** at 320px the scheduler made the page scroll sideways (HubSpot sets a 312px minimum width). On the narrowest phones the scheduler now uses the side margins.
- Space for the scheduler is reserved before it loads, so the page doesn't jump.
- Without JavaScript, a link to the scheduling page appears instead.

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 51 / 51 | 96 / 96 |
| LCP | 21.8–29.3 s | 2.0 s |
| Accessibility | 100 | 100 |
| Page weight | 4.4–4.8 MB | 2.7–3.3 MB (most of it is HubSpot's scheduler) |

### Open questions

14. **Tour bookings go to Kennedy's personal HubSpot meetings link.** If tours should rotate across the team or survive a staffing change, a HubSpot team (round-robin) meetings link would be sturdier. It's a one-line change in `book-a-tour.yaml`.
