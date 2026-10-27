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

Each event on the Events page is its own file in **`src/content/events/`**. To add an event, copy an existing file, rename it (for example `pitch-night-2027.yaml`), and edit it:

```yaml
title: "Pitch Night"
section: upcoming            # "recurring" or "upcoming"
dateLabel: "Thu · Jan 14, 2027 · 6:00 PM"   # shown on the card exactly as written
start: "2027-01-14T18:00"    # Columbia time, 24-hour clock
location: "The Boyd Innovation Center"
description: "One or two sentences."
image: ../../assets/images/events/pitch-night.jpg
imageAlt: "Pitch Night"
actions:
  - { label: "Register", href: "https://..." }
```

- **Dates:** `start` is `YYYY-MM-DD` or `YYYY-MM-DDTHH:MM`. For multi-day events, also add `end`. Recurring events with no single date (like Tech Beans) leave both out.
- **Past events dim automatically after they end and disappear 48 hours later.** You don't need to remove them by hand, though you can delete the file.
- **Eventbrite pop-up checkout:** instead of `href`, use `eventbrite: { id: "1234567890", url: "https://www.eventbrite.com/e/..." }`. The id is the number at the end of the Eventbrite event link.
- **Images** go in `src/assets/images/events/`, ideally 16:9 (for example 1920×1080).
- Recurring events appear in the order of their `order` number; upcoming events appear by date.

The hero, calendar links and photo strip are in `src/content/events-page.yaml`.

## About page: team and board

- **Staff** are in **`src/content/team.yaml`**: name, role, order, photo, photo description, and optional email and LinkedIn link.
- **Board members** are in **`src/content/board.yaml`**: name, affiliation (title and organization), order and photo.
- Put photos in `src/assets/images/team/` or `src/assets/images/board/`. Square photos work best; they're shown in a circle.
- To add someone, copy an existing entry and give it a new `id` (for example `jane-doe`). To remove someone, delete their entry.
- Mission text and the four stats are in `src/content/about.yaml`.

## Book a Tour

The tour scheduler link is `meetingsUrl` in **`src/content/book-a-tour.yaml`**. To send tour bookings to a different HubSpot calendar, replace that link (keep `?embed=true` at the end).

## Site-wide details

The navigation menu, footer links, address, phone number and social media links are in **`src/config/site.ts`**. Edit the text between the quotation marks and leave the rest alone.

## Checking your change

The site checks every content file when it builds. If a required field is missing or misspelled, the build stops with a message naming the file and the field, so a mistake can't reach the live site.

Editing these files currently requires Git. If the team needs to edit without Git, see the CMS note in MIGRATION-NOTES.md.
