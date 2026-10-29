# Editing site content

This guide is for people updating text and images on the website. You don't need to know how to code.

## Homepage

All homepage text and images are in one file: **`src/content/home.yaml`**.

It is a plain-text file organized by section, in the same order as the page:

| Section in the file | What it controls on the page |
|---|---|
| `seo` | The page title and description that appear in Google and in link previews. Change these only on purpose. |
| `hero` | The big "THE COLUMBIA TECH STARTUP HUB" headline |
| `explore` | The "What are you looking for?" cards (Programs, Space, Events) |
| `spaces` | The coworking, office, conference room and event space cards, plus the Day Pass box |
| `events` | The dark "Tech Startup Events" section |
| `programs` | The "Programs for Columbia's Tech Founders" timeline |

### Rules for editing the file

- Keep the indentation (the spaces at the start of each line) exactly as it is. Indentation tells the site which items belong together.
- Keep text inside its quotation marks. If your text includes a double quote (`"`), write it as `\"`.
- Lines that start with `#` are notes for editors and don't appear on the site.
- In the hero headline, letters in `[square brackets]` are shown in green. Spaces at the start of a line push it to the right.

### Changing an image

1. Add the new image file to `src/assets/images/home/` (JPG or PNG; at least 1600px wide for large photos).
2. In `home.yaml`, change the image path to point to the new file, for example `../assets/images/home/new-photo.jpg`.
3. Update the matching `alt` text. It should describe what's in the picture for people who can't see it.

The site automatically creates smaller, faster versions of every image, so you don't need to resize or compress anything.

### Adding a program to the timeline

Copy an existing program under the right stage and change its text:

```yaml
          - title: "New Program Name"
            href: /programs
            description: "One or two sentences about the program."
```

## Programs page

Everything on the Programs page is in **`src/content/programs.yaml`**, including every program card. The same editing rules as the homepage apply.

### Changing a program

Each program sits under its stage (Ecosystem Engagement, Ideation, Launch, Traction):

```yaml
        - title: "Product Jam"
          badge: "FALL 2026"
          description:
            - "First paragraph."
            - "**Bold sentence.** Normal text."
          actions:
            - { label: "APPLY", hubspotCta: programInterest }
            - { label: "LEARN MORE", href: /some-page }
```

- **badge** is the small label in the card's corner, such as a date or "COMING SOON". Leave it out to show no badge.
- **description** is a list of paragraphs. Wrap words in `**double stars**` for bold or `*single stars*` for italic.
- **actions** are the buttons. Buttons whose label starts with "Apply" are shown as the main green button. Each button needs either:
  - `href:` a page to link to, or
  - `hubspotCta:` a HubSpot pop-up form: `programInterest`, `eventSpaceInquiry` or `carolinaVenturesApplication`.

To add a program, copy an existing one within its stage. Two programs per stage looks best on wide screens, but any number works.

The stage names and taglines in the `stages` list also fill the four stage cards at the top of the page.

## Space page

Everything on the Space page is in **`src/content/space.yaml`**: prices, plan features, office availability, amenities, conference rooms, event venues and the virtual tour link.

Common edits:

- **Office availability:** change `availability` (for example `"1 Available"`) and `availabilityNote`. The note can be plain text (`"Starting Nov 1"`) or a link (`{ label: "JOIN WAITLIST", href: /contact }`).
- **Prices:** change `price` (the text shown on the page). Also update `amount` (the number only, such as `179`), which tells search engines the monthly price.
- **Features:** each line under `features` is one ">" bullet.
- **Amenity icons:** `icon` is the name of a file in `src/assets/images/icons/amenities` (without `.svg`). To add a new one, download it from Google's Material Symbols as SVG and put it in that folder.

## Member companies

Member logos are in **`src/content/members.yaml`**, one entry per company:

```yaml
- id: new-company
  name: "New Company"
  order: 9
  logo: ../assets/images/members/new-company.png
  url: "https://newcompany.com"
  description: "One sentence about what they do."
```

- Put the logo file in `src/assets/images/members/`. White logos on a transparent background look best on the dark tiles.
- `order` sets the position (lowest first).
- `url` and `description` are optional. With a `url`, the logo becomes a link to the company's site.

## Events

Each event on the Events page is its own file in **`src/content/events/`**. There are two kinds.

### Recurring series (Tech on Tap, Tech Beans, Silicon Swamp)

These always show in "Recurring Networking Events", even between sessions.

```yaml
section: recurring
order: 1                                   # position among the series
title: "Tech on Tap"
cadence: "MONTHLY · THIRD THURSDAY · EVENINGS"
next: { start: "2026-01-21T17:00" }        # the next session (optional)
description: "One or two sentences."
image: ../../assets/images/events/tech-on-tap.jpg
imageAlt: "Tech on Tap"
actions:
  - label: "Register"
    eventbrite: { id: "1234567890", url: "https://www.eventbrite.com/e/..." }
  - { label: "Learn more", href: /tech-on-tap }
```

The line at the bottom of the card updates itself:
- With a `next` date still ahead, it reads "Next: Wed, Jan 21 · 5 PM" and the first button turns green.
- Once that date passes, or with no `next` at all, it reads "Next date coming soon".
- For a series that meets on a fixed schedule with no single date (Tech Beans), set `ongoing: "Every Tuesday"` instead of `next`.

So when a series takes a break, there's nothing to remove. When it's back, add the new `next` date and Register link.

### Community events (Around Columbia)

```yaml
section: community
title: "Pitch Night"
start: "2027-01-14T18:00"     # Columbia time, 24-hour clock
end: "2027-01-14T20:00"       # optional; use a date alone for multi-day events
location: "The Boyd Innovation Center"
description: "One or two sentences."
image: ../../assets/images/events/pitch-night.jpg
imageAlt: "Pitch Night"
actions:
  - { label: "Register", href: "https://..." }
```

- The date block (for example "NOV 13 · –14 · FRI–SAT") is made from `start` and `end`, so there's no date text to type.
- Events appear in date order. They dim after they end and disappear 48 hours later; you can delete the file afterwards or leave it.
- To add one, copy an existing file and rename it (for example `pitch-night-2027.yaml`).

### Images and buttons

- Images go in `src/assets/images/events/`, ideally 16:9 (for example 1920×1080).
- A button is either `{ label, href }` (a link) or `{ label, eventbrite: { id, url } }`, which opens Eventbrite's checkout pop-up. The id is the number at the end of the Eventbrite link.

The hero, section headings, calendar links, "Host your event" box and photo strip are in `src/content/events-page.yaml`.

## About page: team and board

- **Staff** are in **`src/content/team.yaml`**: name, role, order, photo, photo description, and optional email and LinkedIn link.
- **Board members** are in **`src/content/board.yaml`**: name, affiliation (title and organization), order and photo.
- Put photos in `src/assets/images/team/` or `src/assets/images/board/`. Square photos work best; they're shown in a circle.
- To add someone, copy an existing entry and give it a new `id` (for example `jane-doe`). To remove someone, delete their entry.
- Mission text and the four stats are in `src/content/about.yaml`.

## Book a Tour

The tour scheduler link is `meetingsUrl` in **`src/content/book-a-tour.yaml`**. To send tour bookings to a different HubSpot calendar, replace that link (keep `?embed=true` at the end).

## Tech on Tap page

Everything on the Tech on Tap page is in **`src/content/tech-on-tap.yaml`**.

For the next session, change these in `hero`:

- **`start` and `end`**: the date and times, in Columbia time on a 24-hour clock (`"2026-12-17T17:00"`). The page writes them out as "Thursday, December 17, 2026" and "5:00 PM to 6:30 PM", so there's no date text to type.
- **`register`**: the Eventbrite event. The `id` is the number at the end of the Eventbrite link. Both Register buttons on the page use it.

The **"Recent Event"** section is `recent`: the two heading lines, the thank-you line, and one entry per speaker (name, role, photo, LinkedIn link, company name, logo and company website). Put speaker photos and logos in `src/assets/images/tech-on-tap/`. Square photos work best.

The video file lives in `public/video/`. Its captions are in `tech-on-tap.en.vtt` in the same folder. If you replace the video, replace or remove the captions too.

The page doesn't hide itself when the date passes. It shows whatever is in the file. The Tech on Tap card on the Events page is a separate file (`src/content/events/tech-on-tap.yaml`), so update both.

## Startup Sprint page

Everything on the Startup Sprint page is in **`src/content/startup-sprint.yaml`**.

- **Dates** appear in the text in three places: the Day 1 and Day 2 paragraphs and the "will be back" box (`callout`). Also update `event` (start and end, Columbia time), which tells Google when the event is.
- **Application form**: `application.hubspotFormId` is the HubSpot form. To use a different form, paste its ID from HubSpot.
- **Sponsors**: one entry each under `sponsors.items`, with name and logo (white on transparent; put the file in `src/assets/images/startup-sprint/sponsors/`). Add `url: "https://..."` to make a logo a link. Add `tall: true` for logos that are stacked over several lines, so they don't look small. The logos scroll on their own; there's no speed or copy count to adjust.

## Blog posts

Each post is a folder in **`src/content/blog/`**. The folder name is the post's address: `src/content/blog/tech-on-tap-july-2026/` is boydinnovation.org/blog/tech-on-tap-july-2026. Inside the folder:

- **`index.mdx`**: the post, in Markdown (plain text with a few symbols for bold, links and headings).
- **`cover.jpg`**: the thumbnail on the blog page, also used when the post is shared on social media.
- Any other images in the post, and a **`gallery/`** folder for a photo slideshow.

The blog page, its "Older Posts" pages, the tag pages (such as /blog/tag/Tech+on+Tap), the "Related Posts" under each post and the RSS feed (/blog/rss.xml) all update by themselves from the posts.

### Adding a post

1. Copy **`src/content/blog/_template`**, and rename the copy to the new address (lowercase, words joined by dashes). Folders that start with `_` never appear on the site.
2. Add the images to the new folder. JPG or PNG, up to about 1500px wide. For a slideshow, put the photos in `gallery/` and name them `01.jpg`, `02.jpg`, … in the order they should appear.
3. Fill in the top of `index.mdx` (between the `---` lines): `title`, `description`, `date`, `tags` and `image`. Each line in the template explains itself.
   - **`description`** is what Google shows under the title. Copy the post's first sentence or two (150–200 characters).
   - **`tags`**: start with the topic (Tech on Tap, Startup Sprint, Launchpad COLA, Founder Spotlight, Marketing and SEO, Founder Wellbeing, Press Releases, BIC News). Spell them exactly as listed. Tags show as links under the post and decide its "Related Posts".
   - **`image`** is also the picture shown when the post is shared on social media.
4. Replace the example text with the post. The template shows headings, bold, links, lists, dividers, images and the slideshow.
5. Change `draft: true` to `draft: false` to publish.

**With Claude Code in the browser:** ask it to "add a blog post", then paste the text and give it the photos. Claude can't save images attached to a chat as files, so either upload them to the post's folder on GitHub first (**Add file → Upload files**), or send links it can download (for example a shared Google Drive folder). It follows the steps in `.claude/skills/new-blog-post/SKILL.md`.

### Images in a post

- `<Figure src={photo} alt="…" />` is a full-width image. Add `align="left"` or `align="right"` with `width={0.5}` to wrap the text around it, or `align="center"` with a `width` for a smaller centered image.
- Every image needs an `alt` that says what it shows, for people using screen readers and for Google. For graphics with words on them, type out the words.
- Each image used with `<Figure>` needs its own `import` line at the top of the post, as in the template.

### Headings

Pick the size you want, as in Squarespace: `##` large, `###` normal (most posts), `####` small. The site sets the heading order for search engines and screen readers automatically, so the size you choose is only about looks.

### Editing or removing a post

Edit its `index.mdx`. To take a post down without deleting it, set `draft: true`. If you delete a post or rename its folder, add a line to `public/_redirects` sending the old address to a new one, so links to it keep working.

## Contact, Deep Dive Workshops, Carolina Ventures, Event Guide and Links

Each of these pages has one content file in `src/content/`:

| Page | File | What's in it |
|---|---|---|
| /contact | `contact.yaml` | Heading, intro line, and the HubSpot form ID (`hubspotFormId`). |
| /deep-dive-workshops | `deep-dive-workshops.yaml` | Hero, the workshop text (`*Returning Fall 2026!*` is in italics), the Apply button and the five strip photos. |
| /programs/carolina-ventures | `carolina-ventures.yaml` | Hero, intro and photo, and the cohort schedule. Each session is one line under `schedule.sessions` with a `date` and `label`; add, remove or reorder lines for a new semester. |
| /event-guide | `event-guide.yaml` | Quick facts (address, phone, Wi-Fi), parking options, arrival notes, AV and kitchen info. In parking options, `**bold**` and `[link text](https://…)` work. |
| /links | `links.yaml` | The buttons on the "link in bio" page, top to bottom. Each has a `label` and an `href`; links starting with `http` open in a new tab. Update the Startup Sprint button's date when the next one is announced. |

The Apply buttons on Deep Dive and Carolina Ventures open HubSpot pop-up forms. `hubspotCta` names which one (`programInterest`, `eventSpaceInquiry` or `carolinaVenturesApplication`). The pop-ups themselves are edited in HubSpot.

## Site-wide details

The navigation menu, footer links, address, phone number and social media links are in **`src/config/site.ts`**. Edit the text between the quotation marks and leave the rest alone.

## Checking your change

The site checks every content file when it builds. If a required field is missing or misspelled, the build stops with a message naming the file and the field, so a mistake can't reach the live site.

Editing these files currently requires Git. If the team needs to edit without Git, see the CMS note in MIGRATION-NOTES.md.
