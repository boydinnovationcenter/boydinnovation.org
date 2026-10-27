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
