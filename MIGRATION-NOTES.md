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
- `/home` returns a full duplicate of the homepage (HTTP 200) and is listed in the live sitemap. It is now a 301 to `/` (see Redirects).
- `og:image` / `twitter:image` point to an `http://static1.squarespace.com/...` URL. They are kept exactly as instructed, but **they will break when the Squarespace site is cancelled** (open question 4).

### Open questions

1. **Contrast:** the "ECOSYSTEM ENGAGEMENT" label (green `#59FF66` on `#ECF6F2`, about 1.3:1) and "IDEATION" (blue `#0099FF`, about 2.9:1) fail WCAG AA (4.5:1). Keep as live, or darken only the label text and keep the dots in the brand colors?
2. **Probable live-site mistakes, kept as-is for now:**
   - The Tech Beans "LEARN MORE" button links to `/tech-on-tap`.
   - In "Product Jam" and "Growth Jam", only the first word is linked.
3. **Mobile order and content:** on phones the live explore cards show Space, Programs, Events; the rebuild uses the desktop order (Programs, Space, Events) on every screen, per the "same order on every screen" rule. The Day Pass description is also hidden on phones on the live site, and that is preserved.
4. **og:image hosting:** keep the Squarespace URL until launch and switch to a self-hosted copy of the same image at launch?
5. ~~**Hosting:**~~ Answered: Cloudflare (Workers static assets, deployed from `main`). Redirects live in `public/_redirects` (see Redirects).
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
13. **Tech on Tap** needs its next date and Eventbrite event; until then it doesn't show (its Oct 22 date has passed). The live Tech on Tap page now has November 19; see question 16.

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

## Events redesign (approved by Kennedy, 2026-10-28)

The Events page was rebuilt from concept A ("Series + agenda") on the design canvas, replacing the straight recreation. Reason: the live layout of big image cards looked empty with only one or two dated events, and the recurring series vanished when they had no date.

- **Hero:** the crowd photo is now a faint texture behind the text (no translucent panel or flywheel). "Subscribe to our calendar" is the green main button; "Event rentals" stays as the glass button.
- **Recurring Networking Events:** Tech on Tap, Tech Beans and Silicon Swamp always show, each with its cadence, description and a status line: "Next: Thu, Nov 12 · 6 PM", "Every Tuesday" or "Next date coming soon". When a series' next date passes, the card falls back to "Next date coming soon" by itself, both at build time and in the browser. New subheading: "Hosted at the Boyd Innovation Center, 711 Saluda Ave".
- **Around Columbia** (was "Startup Workshops and Founder Networking Events around Columbia, SC"; that text is now the subheading): an agenda list of dated community events with a generated date block, image, details and button. Events still dim after they end and disappear 48 hours later.
- **Closing band:** the calendar feed ("Sign Up for Our Calendar Feed", live copy) beside a new "Host your event at the BIC" box. Its capacities come from the Space page.
- **Kept from live:** all copy except the new section heading and subheadings, every link and Eventbrite pop-up, the calendar options, the photo strip and the `#calendarfeed` anchor.
- **Accessibility:** the blue date labels that failed contrast are gone. Date blocks have full spoken dates for screen readers (for example "Friday, November 13 – Saturday, November 14, 2026"). Lighthouse accessibility is 100, and performance is 94–97 (LCP 2.2–2.4 s) on the local preview.
- **Content model:** recurring and community events are separate shapes in `src/content/events/`, documented in CONTENT.md.

Open question 15: **Silicon Swamp's cadence** is shown as "THURSDAY EVENINGS". The live site doesn't say how often it meets; confirm with its organizers (`src/content/events/silicon-swamp.yaml`).

## Site-wide fix: canonical and og:url (2026-10-29)

In the production build, every page's canonical link and `og:url` ended in `.html` (for example `https://boydinnovation.org/about.html`, and `/index.html` for the homepage), because the build writes one `.html` file per page. The dev server doesn't show this, which is why the earlier checks missed it. [BaseLayout.astro](src/layouts/BaseLayout.astro) now drops the `.html`, so all pages match live again (`https://boydinnovation.org`, `https://boydinnovation.org/about`, ...). The sitemap was already correct.

## Tech on Tap (`/tech-on-tap`)

Reference: live site captured 2026-10-29 at 1440 and 390px. Title, (empty) meta description, canonical and social tags are copied exactly.

**Kept as it is on live, at Kennedy's request (2026-10-29):** the "Recent Event: October Tech on Tap" recap is out of date. It will be the first thing updated after launch, as a trial of the editing workflow. Everything is in `src/content/tech-on-tap.yaml` (see CONTENT.md).

### Rebuilt and fixed

- **Video:** on live it was a Squarespace-hosted stream (2 min 20 s, with sound, click to play). It's now a self-hosted MP4 (`public/video/tech-on-tap.mp4`, 1080p, 23 MB, under the 25 MiB per-file limit some hosts set). It downloads only when someone presses play; until then only the poster loads. The poster now fills the frame as on live (it's a 3:2 photo in a 16:9 player).
- **Captions added (needs review):** the video is an interview with no captions on live, which fails WCAG 1.2.2. A captions track (`public/video/tech-on-tap.en.vtt`) was made from a machine transcript. It is off until a viewer turns on CC, so nothing looks different. **Someone should proofread it before launch**; in particular 0:33 reads "people led to hand", probably "people lent a hand".
- **Speakers:** photos link to LinkedIn and logos to each company, as on live. On live every one of those images had empty alt text, so the links had no names. They now read, for example, "Laura Boccanfuso on LinkedIn (opens in a new tab)" and "VAN Robotics website (opens in a new tab)". Speaker order is the visible order (Laura, Ben, Dan); the live HTML order was different.
- **Headings:** the recap heading was two `<h2>`s; it's now one heading on two lines. Speaker names are `<h3>`s, and "Tech on Tap is for you if:" and "Event Details" are `<h2>`s instead of bold paragraphs. The look doesn't change.
- **Register buttons:** both are real links to the Eventbrite event and open Eventbrite's checkout pop-up, as on live. On live the two buttons shared one element id and `eb_widgets.js` loaded twice, blocking rendering. Now the script loads once when the page is idle, and each button works on its own. The pop-up code is shared with the Events page ([EventbriteCheckout.astro](src/components/EventbriteCheckout.astro)).
- The ➡️ markers in Event Details are decorative, so screen readers skip them.
- In the right-hand box, the Register button lines up with the text. On live it was indented about 25px.

### Small-screen fixes

| Widths | Problem on the live site | Change |
|---|---|---|
| under 768px | Speaker photo and name cards zig-zagged in a cramped 2-column grid; the VAN Robotics logo was cut off and "Laura Boccanfuso" broke over two lines | Each speaker is a row of photo and card; three across from 576px |
| under 768px | The intro box had a fixed height with a large empty area below the text | Boxes fit their text |
| under 768px | The second Register button sat outside its box | Inside the box, as on desktop |
| 768–1023px | (Two boxes side by side would be cramped) | Boxes stacked until 1024px |

Checked every 8px from 320 to 1440 with no horizontal scroll; screenshots at 320, 390, 768, 1024 and 1440.

### Structured data

`BreadcrumbList`, plus an `Event` for the session in the hero (date, times, BIC as place and organizer, Eventbrite link) while that date is still ahead.

### Performance (Lighthouse, mobile, 2026-10-29)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 27 / 27 | 94 / 94 / 94 |
| LCP | 25.2–25.3 s | 2.7–2.8 s |
| FCP | 10.8–11.1 s | 1.1 s |
| Total blocking time | 2,610–2,640 ms | 120–150 ms |
| Accessibility | 97 (unnamed image links) | 97 (blue "Thank you" line, question 19) |
| Page weight | 56.7 MB | 1.8–2.0 MB |

On live, Squarespace's player downloads the whole video as soon as the page opens; that's most of the 56.7 MB. The LCP element is now the video poster (960px WebP, 84 KB, preloaded). What's left of its time is bandwidth shared with the site-wide Google scripts, as on the Events page.

### Open questions

16. **The two live pages disagree about the next Tech on Tap.** This page says Thursday, November 19 (Eventbrite event `2003836042545`). The live Events page still shows October 22 (`2001623057447`), so on the rebuilt Events page the card says "Next date coming soon". Each page is kept as it is on live. Should the Events card get November 19 too?
17. **The November Eventbrite event isn't live.** Its page returns 404, and the Register pop-up says "the page or event you are looking for was not found". This happens on the live site too. Publish the event on Eventbrite, or update the link.
18. **Empty band below the boxes:** on live there's about 290px of empty navy below the two boxes on desktop (left over from Squarespace's grid). It's kept for fidelity. Tighten it to match the space above (about 95px)?
19. **Contrast:** "Thank you to our panel speakers!" is brand blue on the light background (2.7:1; large text needs 3:1). It's the same issue as question 10.

## Startup Sprint (`/startup-sprint`)

Reference: live site captured 2026-10-29 at 1440 and 390px. Title, meta description, canonical and social tags are copied exactly.

### Rebuilt and fixed

- **Sponsor logos:** on live, a code block of JavaScript built the scrolling logos. They're now plain HTML with a CSS animation, at the same speed (35px per second), with no script.
  - **The live logo links were broken:** each pointed to placeholder text (`SWEETWATERS_SITE_URL`, `INTEGER_SITE_URL`, ...), which leads to a 404 page. Until real addresses are added, the logos aren't links. Add a `url` to each sponsor in `startup-sprint.yaml` to link them (see question 20).
  - The scroll pauses on mouse hover and when a keyboard user tabs into it. Visitors who have reduced motion turned on see one still, centered row. On live the animation simply stopped, leaving logos cut off at the edges.
  - Screen readers hear each sponsor once. The repeated copies that make the loop seamless are hidden from them.
- **Application form:** the same HubSpot form (`08b4d195-…`) at `#application`. Its height is reserved before it loads (882px on desktop, 1114px on phones, as measured on live), so the page doesn't jump. HubSpot's form script was loaded twice on live (in this embed and in the newsletter); it's now loaded once.
- **Apply Now** links to `#application`. On live it linked to `/startup-sprint#application`, which goes to the same place.
- **Alt text:** every image on live had empty alt text. The CIU × BIC logo now reads "Columbia International University × Boyd Innovation Center", and the photos are described. The flywheel graphic stays decorative.
- **Headings:** h1, then h2 for each section, with "Startup Sprint is for you if:" kept as an h3 as on live (no levels skipped).
- **Images:** the team photo was a 1.1 MB PNG; it's stored as a JPEG and served as responsive WebP like the rest of the site.

### Small-screen fixes

| Widths | Problem on the live site | Change |
|---|---|---|
| under 768px | The CIU × BIC logo was placed above the page title | Desktop order: title and tagline first, then the logo, with the flywheel in the bottom corner (same order on every screen, and the h1 comes first for screen readers) |
| 320px | (The title would break onto two lines) | Title size lowered at the narrowest widths so "Startup Sprint" stays on one line |

Checked every 8px from 320 to 1440 with no horizontal scroll; screenshots at 320, 390, 768, 1024 and 1440.

### Structured data

`BreadcrumbList`, plus an `Event` for November 13–14 (5:30 pm Friday to 5 pm Saturday, from the Day 1 and Day 2 text): description, team photo, BIC as place and organizer, and the four sponsors. The start and end are in `event` in `startup-sprint.yaml`; update them with the dates in the text (see CONTENT.md).

### Performance (Lighthouse, mobile, 2026-10-29)

| | Live | Astro (local preview) |
|---|---|---|
| Performance | 53 / 55 | 98 / 99 |
| LCP | 23.7–24.6 s | 1.1 s |
| FCP | 5.7–5.8 s | 1.1 s |
| Total blocking time | 190–230 ms | 120–130 ms |
| Accessibility | 100 | 100 |
| Page weight | 3.9–4.1 MB | 1.7–1.9 MB |

### Open questions

20. **Sponsor website addresses:** what are the links for Sweetwaters Coffee & Tea, Integer Technologies, Security Federal Bank and Snaply Sites? Their logos become links once these are added.
21. **Pausing the sponsor scroll (WCAG 2.2.2):** moving content that runs longer than 5 seconds needs a way to pause it. Hover and keyboard focus now pause it, but phone users have no way to. A small pause button beside the logos would fully meet the guideline. It would be a visible addition, so it needs approval.

## Redirects (2026-10-29)

All redirects are in [public/_redirects](public/_redirects), which Cloudflare reads at deploy time. 343 rules (as of 2026-10-30), tested against `wrangler dev`. Sources:

- **Squarespace URL Mappings** (export pasted by Kennedy, 2026-10-29): all 29 rules carried over unchanged, including the two external ones (`/showcase` to Eventbrite and `/friendsgiving` to a Google Sheet, which stays a 302). Squarespace redirected to `http://`; the new rules go to relative paths, so visitors stay on `https` with no extra hop.
- **Trailing slashes:** Squarespace matched `/about-us` and `/about-us/` alike, but Cloudflare matches exactly. Each mapping therefore has a second line with the slash, plus `/events/` to `/events`. Real pages need no rule, because `/about/` already redirects to `/about` (Cloudflare uses a 307 there).
- **Leftover duplicates:** `/home` to `/` and `/programs-1-1` to `/programs`. Live serves full copies of those pages at these URLs. `/programs-1` was already in the URL Mappings.
- **Search Console "Not found (404)" export** (last crawled through 2026-10-23): 149 rows, 111 unique paths once `www`, `http` and tracking parameters are removed.
  - 56 are event pages that moved from `/events/<slug>` to `/event-calendar/<slug>`. These are handled by a single `/events/*` pattern rule, which also catches old event links Google hasn't reported.
  - 42 have Squarespace duplicate suffixes (`-xxxxx`, sometimes chained). 16 blog ones were already in the URL Mappings. The 26 event ones were generated from the export, each pointing to the page that exists in the live sitemap.
  - `/events/startups-on-tap-july-22-2026` went to its renamed page, `/event-calendar/startups-on-tap-2026-07-22`. That page wasn't kept (see "Past event pages"), so it now goes to `/tech-on-tap`.
  - Unused event-page drafts (`/meetups`, `/trial-event-coworks`, per Kennedy) and four deleted events go to `/events`. Google may report these as soft 404s, which is harmless.
  - `/blog/category/*` goes to `/blog`.
  - The deleted sponsorship PDF `/s/startup-sprint-sponsorhsip-bic.pdf` goes to `/startup-sprint`. If the PDF turns up, host it at that path and remove the rule.
  - `/events/tech-`, `/office-` and `/new-dropdown` are half-typed drafts and are left as 404s on purpose.
  - Result: 109 of the 111 paths redirect to a URL in the live sitemap; the other 2 return 404.
- **Not handled here:** `www.boydinnovation.org` to `boydinnovation.org`. Squarespace does this today; on Cloudflare it is a domain-level redirect rule, set up at launch.
- **Old event pages (2026-10-30):** see "Past event pages" below. The 26 suffix rules that pointed at an event page that wasn't kept now go straight to its final target.
- **Order matters:** the first matching rule wins, and Cloudflare checks plain rules before rules with `*`, so the two pattern rules stay at the bottom of the file.


## Blog (`/blog`, 44 posts, tag pages) (2026-10-29)

All 50 live blog URLs (the list, 44 posts and 5 tag pages) are rebuilt and return 200 on the Cloudflare build, with the live titles and canonicals. Descriptions, social images and some page structure were then changed on purpose for SEO (Kennedy approved, 2026-10-29; see "SEO changes" below).

### How it's built

- **One folder per post:** `src/content/blog/<slug>/index.mdx` (Markdown plus two components), with that post's images next to it. A new post is a copy of `src/content/blog/_template`. CONTENT.md explains this for the team, and `.claude/skills/new-blog-post/SKILL.md` tells Claude Code (including in the browser) how to add one.
- **Imported, not retyped:** a one-off script read Squarespace's JSON export of all 44 posts, converted the text to Markdown, and downloaded 205 images (at most 1500px wide). It also checked every computed `<title>` against live, with no differences. The script stays in the session scratchpad and isn't part of the site. **Don't re-run it**: the posts have since been edited by hand (typos, descriptions, tags), and new posts go through the template.
- **Post components:** `<Figure>` (full width, floated left or right, or centered at a set width, with the Squarespace crop and corner radius where live has them) and `<Gallery>` (the recap slideshows: 9 galleries, photo counts identical to live).
- **List pages:** 10 posts per page, as on Squarespace. Squarespace's "Older Posts" went to `/blog?offset=…`, which a static site can't serve, so later pages are now `/blog/page/2`…`/5`, and `/blog/tag/<Tag>/page/2` for tags. `?offset=` links still open `/blog`, which shows page 1.
- **Tag URLs with `+`** (`/blog/tag/Tech+Incubator`): Cloudflare would redirect these to `%2B`. A small build step (`src/lib/plus-sign-rewrites.mjs`) adds rewrites so they're served at the live address with a 200.
- **Markdown settings:** "smart" punctuation is off (it changed `--` in a press release to `—`), and so is automatic linking of plain email addresses and URLs (live shows several founder emails as plain text).

### Fixes (no visible change, or small-screen only)

- **Heading structure:** live posts jump from the title `<h1>` straight to `<h3>`, and some go back up to `<h2>` later. A build step renumbers each post's headings so they run 2, 3, 4 with no skipped levels. Each heading keeps the size the author chose, through a class. Blog list cards were each an `<h1>` on live; they're now `<h2>`.
- **Invisible text on live:** some headings and links use Squarespace's "dark accent" color, which is the same navy as the background. Examples are the seven "Sprint Block #1–7" headings in the Spring 2026 Startup Sprint recap, and the Bivvy and Pathly links in a press release. **They're shown in the normal text color in the rebuild.** This makes text visible that live hides by accident. Revert it if that was intentional (see question 22).
- **Alt text:** live has none on images inside posts. All 33 now have it, mostly the words in each "Founder Spotlight" graphic. Slideshows are labeled ("Photos: <post title>"), and each thumbnail is a button ("Show photo 3 of 15").
- **Links:** links to other sites open in a new tab, as on live, and now tell screen readers so. "Read More" links include the post title for screen readers. 22 internal links that went through a redirect (`/launchpad-cola`, `/membership`, `/donate`, old `/events/…` addresses) now go straight to the final page.
- **Small screens:**
  - Blog hero, about 320–414px: live breaks "Highlightin-g" across lines. The headline now shrinks just enough to keep its longest word whole.
  - Post titles at all widths: same rule, so long words never break mid-word.
  - Post pages at 320–360px: the previous/next links hyphenate long words instead of widening the page. One post's long URL link text now wraps.
  - All 59 blog pages were checked at 320, 360, 375, 414, 768 and 1024px. The ten most varied were also checked every 8px from 320 to 1440. No sideways scrolling.

### Deviations

- **Slideshow thumbnails** are equal-width squares in one strip, scrollable on phones. Live's strip sizes them unevenly.
- **Squarespace spacer blocks** (26, mostly between entries in the cohort posts) aren't carried over, so those posts are a little tighter vertically. Text, order and dividers are unchanged.
- **Scroll fade-in animations** on live aren't recreated, as on the other pages.

### Structured data

Posts: `BlogPosting` (headline, published and modified dates, image, tags, with BIC as author and publisher) and `BreadcrumbList`. List and tag pages: `Blog`, `CollectionPage` with an `ItemList` of the posts shown, and `BreadcrumbList`.

### Performance (Lighthouse, mobile, 2026-10-29)

| Page | Live | Astro (local Cloudflare) |
|---|---|---|
| `/blog` | 51 perf, LCP 24.0 s, 5.6 MB, a11y 96 | 96 perf, LCP 2.4 s, 1.9 MB, a11y 100 |
| `/blog/tech-on-tap-july-2026` | 48 perf, LCP 25.3 s, 3.8 MB, a11y 98 | 98 perf, LCP 1.9 s, 2.1 MB, a11y 100 |

### SEO changes (approved by Kennedy, 2026-10-29: "make the SEO improvements you think make the most sense")

- **Meta descriptions:** 5 posts had one on live, and those are kept word for word. The other 39 were blank on live, so Google wrote its own snippet. Each now has a description copied from the post's own opening sentences (150–200 characters). No new wording, except the Fall 2025 cohort post, whose description lists the first eight companies by name. These also become `og:description` and appear in the RSS feed.
- **Visible publish date** under each post title ("July 22, 2026"). Live showed dates only on the blog list.
- **Topic tags:** 8 new tags group the series: Tech on Tap, Startup Sprint, Launchpad COLA, Founder Spotlight, Marketing and SEO, Founder Wellbeing, Press Releases and BIC News. Each gets a tag page (for example `/blog/tag/Tech+on+Tap`). The 5 live tags are unchanged and still list the same posts. Tag pages show the tag above the headline ("BLOG / TECH ON TAP") and have a short description. Later list pages say "Page 2" in their titles, so no two pages share a title.
- **Tag links and "Related Posts" under each post:** two posts chosen by shared tags (rarer tags count more), never the two already linked by the previous/next links. Previously, older posts could only be reached through four or five "Older Posts" pages.
- **Social images:** posts now use their own cover image, served from this site at 1200px (`og:image`, `twitter:image`), with `summary_large_image` cards, instead of Squarespace CDN links that stop working when Squarespace is cancelled. They're absolute `https://boydinnovation.org/_astro/…` URLs, so they only resolve once the domain points at Cloudflare. The blog list and other pages still use the Squarespace URL (question 4).
- **RSS feed** at `/blog/rss.xml`, listed in every page's `<head>`. The old Squarespace feed (`/blog?format=rss`) can't be redirected, because Cloudflare redirects can't match on query strings.

### Typos fixed (2026-10-29, approved by Kennedy)

Found with a dictionary check plus checks for repeated words and common slips. Names and URLs weren't changed.

| Post | Was | Now |
|---|---|---|
| nautiq-ai-launchpad-spotlight | busienss; a valueable asset | business; a valuable asset |
| meet-launchpad-cola-fall-2025 | electromanetic | electromagnetic |
| tech-on-tap-july-2026 | from planing and establishing | from planning and establishing |
| tech-on-tap-july-2026, tech-on-tap-may-2026 | Our check out our events calendar | Or check out our events calendar |
| tech-on-tap-may-2026 | but but he can | but he can |
| launchpad-cola-halfway | 7 AM and and leave; Shriha Ganesh Babu | 7 AM and leave; Shrihan Ganesh Babu (as spelled in the cohort post) |
| startup-sprint-spring-2026 | Goruchos; helped contributed to | Groucho’s; helped contribute to |
| founder-spotlight-jade-pruett-of-helloseo | Linkedin | LinkedIn |

Left as-is: the misspelled URL `/blog/tech-on-tap-novemeber-2025`, which is live and indexed; and "Yuri", which is used throughout the NeedNoMore spotlight while the cohort list says "Yurii" (it may be a nickname).

### Decisions

22. **"Dark accent" text:** shown in the normal text color (not hidden as on live).
23. **Slideshow photos:** labeled per slideshow ("Photos: <post title>"). The 128 photos don't get individual descriptions (Kennedy, 2026-10-29).

### Testing note

On 320px phones, HubSpot's popup overlay (`#hs-interactives-modal-overlay`, injected on every page) is 3px wider than the window. That makes `scrollWidth` report up to 341px, but the page can't be scrolled sideways, because `body { overflow-x: clip }` contains it (checked by trying to scroll). No change is needed. Remember this when an automated width check flags a page only some of the time.

## Contact, Deep Dive Workshops, Carolina Ventures, Event Guide, Links (2026-10-29)

All five live URLs are rebuilt. Titles, canonicals and social images match live, as do descriptions where live has one. Copy lives in one YAML file per page (see CONTENT.md). `/5points` and `/uscqr`, the QR code landing pages, are no longer needed (Kennedy, 2026-10-29) and now redirect 301 to `/`.

### Rebuilt and fixed

- **Contact:** the same HubSpot form, with its rendered height (532px desktop) reserved so the page doesn't jump. Adds `ContactPage` and breadcrumb structured data.
- **Deep Dive Workshops:** the Apply button is a real `<button>` that opens the same HubSpot Program Interest pop-up. Live wires a link with an empty `href` through the footer script.
- **Carolina Ventures:** Apply Now opens the Carolina Ventures application pop-up, the same way. On live, "Faber Center for Entrepreneurship" is an `<h2>` above the page's `<h1>`; it's now a styled line with the same look, so the `<h1>` comes first. The six schedule boxes are an ordered list in date order. Live's markup has them out of order, though they display in order.
- **Carolina Ventures description:** live has none. It now has one taken from the page's own first two sentences, as with the blog.
- **Links:** a logo `<h1>`, the three social icons (from the site config) and eight buttons. The live page has no heading.
- **Event Guide:** the quick-facts tiles are a description list (`<dl>`), and the AV photos keep live's overlapping pair. The parking section's background is the brand light mint `#ECF6F2` instead of live's off-brand gray `#F1F5F9`; the two are nearly identical.
- **Typos fixed (Event Guide):** "heres everything" is now "here’s everything". "The BIC team will coordinator will confirm" is now "The BIC team coordinator will confirm".
- **Alt text** written for every photo and the parking map. The map's alt text lists the parking spots it shows.

### Small-screen fixes

- **Deep Dive, phones:** live leaves about 150px of empty space above the Apply button. It now follows the text directly.
- **Carolina Ventures, ≤414px:** the headline is sized to stay on one line, as on live's phone layout.
- **Event Guide, phones:** the hero starts below the flywheel mark, so the mark doesn't overlap the headline.
- All five pages checked every 8px from 320 to 1440: no sideways scrolling.

### Deviations

- **Links button order:** the phone layout on live shows the buttons in a different order (Tech on Tap first). The rebuild uses the desktop order on every screen, per "same order on every screen". The order is in `links.yaml`.
- **Event Guide reading order:** on wide screens the photo sits on the left as on live, but the HTML (and screen readers) has the text first, which also matches live's phone layout.

### Performance (Lighthouse, mobile, 2026-10-29)

| Page | Live | Astro (local Cloudflare) |
|---|---|---|
| /contact | 48 perf, LCP 24.8 s, 3.3 MB | 97 perf, LCP 1.3 s, 1.6 MB |
| /programs/carolina-ventures | 50 perf, LCP 21.7 s, 4.2 MB | 97 perf, LCP 2.1 s, 2.2 MB |
| /deep-dive-workshops | 53 perf, LCP 23.8 s, 3.4 MB | 98 perf, LCP 1.5 s, 2.1 MB |
| /event-guide | 53 perf, LCP 23.8 s, 3.5 MB, a11y 96 | 96 perf, LCP 2.5 s, 1.8 MB, a11y 97 |
| /links | (live run failed) | 98 perf, LCP 1.5 s, 1.7 MB |

Accessibility is 100 on all except the Event Guide (97). Its one failure is the brand blue `#0099FF` on the light background ("PARKING AND GETTING HERE", the Passport Parking link), at 2.7:1, the same as live. See open question 1.

### Open questions

24. **Event Guide blue text contrast (2.7:1):** darken it, as asked in question 1 for the homepage labels?
25. **Links page:** "STARTUP SPRINT NOV 13-14" will go out of date after November 14; update or remove that button then.



## Past event pages (`/event-calendar/<slug>`) (2026-10-30)

Squarespace's event calendar had 79 event pages, all for past events (May 2025 to August 2026; it shows 0 upcoming). Kennedy decided (2026-10-30) to rebuild the significant ones and redirect the rest, instead of migrating all 79 or none.

### Kept (20 pages)

- **Tech on Tap:** all 11 (July 2025 to August 2026, with no session in December, April or June). Each names its speaker.
- **Launchpad COLA:** Pitch Night (Dec 2025) and the Spring '26 Startup Showcase.
- **Startup Sprint:** Fall 2025 and Spring 2026.
- **One-off events:** Carolina Entrepreneurship Summit, Gridlock Hackathon, Finance Deep Dive (Lanford Holloway), SEO Power Hour (HelloSEO) and Seeds vs. Silos (Adina Maynard). The rule for these "your call" events was to keep the ones whose page names a speaker or member host.

### Redirected (59 pages)

Repeated sessions whose pages share the same description: Tech Beans (13), Silicon Swamp (8), the AI workshops, the AWS, WordPress and Coffee & Connections meetups, and the remaining one-offs (BIC intro webinar, Founder Friday, Nelson Mullins office hours, Pitch It for Filmmakers, the Veteran workshop, SCRA fundraising workshop and USC internship fair). These go to `/events`. Advisor Fridays (13) and the Launchpad COLA sessions, application and kickoff pages (10) go to `/programs`, where Advisor Fridays is listed. Startups on Tap goes to `/tech-on-tap`. `/event-calendar` itself goes to `/events`.

Each slug has four rules (`/event-calendar/x`, `/events/x`, and both with a trailing slash), so no old link takes two hops. All 387 old event URLs were tested on `wrangler dev`: 20 return 200, and the rest reach a 200 page in one redirect.

**Changed from the list agreed on 2026-10-29**, after reading the pages:
- **BCSIA Cohort 5 Demo Day:** redirected. Its live description is a copy of the AWS User Group text, so there's nothing about the demo day to rebuild. If the real description turns up, it can be added back.
- **Startups on Tap (July 22, 2026):** redirected to `/tech-on-tap`. Its page is 30 words of generic series copy with no speaker.
- **Launchpad COLA Cohort 1 Kickoff:** redirected to `/programs`. Its text is the same as the Launchpad application pages.

### How it's built

- One folder per event, `src/content/event-calendar/<slug>/` with `index.mdx` and the poster (see CONTENT.md, "Past event pages"). Imported by a one-off script from Squarespace's JSON, like the blog. Don't re-run it; the files have been edited since.
- Same layout as live: back link, then details, poster and description in three columns at 1024px and up. Previous/next links run through the kept events in date order.
- Titles, descriptions and canonicals match live exactly (checked against the live HTML).
- `Event` (with the date, the place and the poster) and `BreadcrumbList` structured data.
- The Markdown text styles moved from the blog post page into a shared `.prose` class in `global.css`, used by both. Blog posts render the same (checked with computed styles and page height).

### Deviations

- **Register buttons and Eventbrite checkouts removed:** the events are over. Two non-registration links stay: "See the Recap" (Startup Sprint Spring 2026, to the blog) and "Learn More" on the Carolina Entrepreneurship Summit, because its text refers to "the link below".
- **"Past event" label** under each title, so the removed Register buttons don't leave visitors wondering. It's new text, so remove it in `src/pages/event-calendar/[slug].astro` if unwanted.
- **Copy that still reads as upcoming** ("Space is limited. Reserve your spot now!", live meta descriptions ending "Register now") is kept word for word, as with all migrated copy.
- **Share image:** the event poster, self-hosted. Live's share image is a separate thumbnail that is sometimes wrong (Gridlock's is the internship fair image; July 2025's is August's).
- **"Dark accent" text** (labels like "Tech on Tap is for you if:"), which is navy on navy on live, is visible, as with the blog (decision 22).
- **Tags** (only the Spring '26 showcase has them) are plain text. On live they link to calendar filter pages that no longer exist.
- **Google Calendar / ICS links** are in live's HTML but hidden; not carried over.

### Typos fixed

- Startup Sprint Fall 2025: "build a start in 24 hours" is now "build a startup in 24 hours".
- Gridlock and SEO Power Hour: "inquires" is now "inquiries".
- Carolina Entrepreneurship Summit: "the university of South Carolina" is now "the University of South Carolina".
- Tech on Tap (6 pages): "successful companies ." is now "successful companies." (no space before the period).
- Gridlock: an empty link left over in the "Note" line is removed. Matt Vaadi's LinkedIn link no longer carries HubSpot email tracking parameters.

### Checks

- All 20 pages: one `<h1>`, no skipped heading levels, alt text on every poster (written from the poster text), valid JSON-LD, no sideways scrolling at any width from 320 to 1440 (every 8px).
- Lighthouse, mobile, `/event-calendar/tech-on-tap-mar-2026`: live 52 performance, LCP 17.0 s, CLS 0.12, 3.1 MB, accessibility 95. Astro: 99 performance, LCP 1.7 s, CLS 0, 1.6 MB, accessibility 100. (The preview's SEO score is 69 only because of its intentional `noindex`.)

### Open questions

26. **BCSIA Cohort 5 Demo Day:** is there real copy for this event? Live shows the AWS User Group description by mistake.
27. **Past speakers list:** nothing on the site links to these pages yet. A "Past speakers" list on `/tech-on-tap` would help visitors and search engines find them. It's new content, so it needs approval.

## 404 page (2026-10-30)

Any URL with no page and no redirect now gets `src/pages/404.astro` with a real 404 status (`not_found_handling: "404-page"` in `wrangler.jsonc`). Tested on `wrangler dev`: unknown paths return 404, real pages 200, and redirects still apply first. The page is left out of the sitemap and always has `noindex` and no canonical URL, even after launch (new `noindex` option on `BaseLayout`).

### Deviations

- **Header fixed:** live uses Squarespace's default 404 on a light background, where the white logo and menu are nearly invisible. The text now sits on the navy band used by the blog and event pages, so the header reads as on every other page.
- **Search link removed:** live ends "…or you can try searching for the content you are seeking by clicking here", linking to Squarespace's site search. This site has no search, so the sentence now ends after the homepage link.
- **Title:** "Page Not Found | Boyd Innovation" instead of live's bare "Boyd Innovation", so the browser tab says what happened. The page isn't indexed, so this has no SEO effect.
- **Headings:** live's 404 has none. A visually hidden `<h1>` ("Page not found") gives screen-reader users a heading; nothing visible changes.
- **Link text:** "clicking here" stays as on live, with hidden text added for screen readers ("to go to the homepage").
