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

## Site-wide details

The navigation menu, footer links, address, phone number and social media links are in **`src/config/site.ts`**. Edit the text between the quotation marks and leave the rest alone.

## Checking your change

The site checks every content file when it builds. If a required field is missing or misspelled, the build stops with a message naming the file and the field, so a mistake can't reach the live site.

Editing these files currently requires Git. If the team needs to edit without Git, see the CMS note in MIGRATION-NOTES.md.
