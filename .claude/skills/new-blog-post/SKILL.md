---
name: new-blog-post
description: Add or edit a post on the boydinnovation.org blog (src/content/blog). Use when someone asks to add, publish, draft or update a blog post, event recap, founder spotlight or press release.
---

# Adding a blog post

Posts are MDX files in `src/content/blog/<url-slug>/index.mdx`, with their images in the same folder. `src/content/blog/_template/index.mdx` is the starting point, and its comments explain every field. CONTENT.md ("Blog posts") is the plain-language version of this guide for the BIC team.

## What to ask for (only what's missing)

- The post text, exactly as it should appear. **Don't write, rewrite or "improve" copy.** Fix only obvious typos, and list each one you fixed in your reply.
- Title, and publish date and time (default: now).
- The images: the cover/thumbnail, any images inside the post, and slideshow photos. Images attached to a chat can't be saved as files. Ask the person to upload them to the post folder on GitHub (Add file → Upload files), or to send download links (Google Drive, Dropbox), then fetch them with curl.
- Tags: put the topic tag first (Tech on Tap, Startup Sprint, Launchpad COLA, Founder Spotlight, Marketing and SEO, Founder Wellbeing, Press Releases, BIC News), then any of the general ones (Programs, Entrepreneur Programs, Training, Incubator, Tech Incubator). Reuse them exactly; check with `grep -h '^tags:' src/content/blog/*/index.mdx | sort | uniq -c`. Only add a new tag if asked, since each tag creates a new page. Tags also choose the "Related Posts" under each post.

## Steps

1. **Slug:** lowercase words joined by dashes, built from the title (e.g. `tech-on-tap-december-2026`). Check that `src/content/blog/<slug>` and `/blog/<slug>` in `public/_redirects` are both unused.
2. **Copy** `src/content/blog/_template` to `src/content/blog/<slug>`.
3. **Images:**
   - Cover as `cover.jpg`. Slideshow photos go in `gallery/`, named `01.jpg`, `02.jpg`… in order. Other images get short descriptive names (`jane-doe-speaking.jpg`).
   - Shrink anything wider than 1500px, and convert large PNG photos to JPG: `sips -Z 1500 -s format jpeg in.png --out out.jpg` on macOS, or `python3 -c "from PIL import Image; …"` in Linux sandboxes. Keep graphics with text as PNG.
   - Write `alt` text for every `<Figure>`: what the image shows, or the words in a graphic. Slideshow photos use the slideshow's label, so give `<Gallery>` a `label` like `"Photos from Tech on Tap, December 2026"`.
4. **Frontmatter:** set `title`, `description` (one or two whole sentences copied from the post's opening, 150–200 characters, no new claims), `date` in UTC ISO format, `tags`, `image: ./cover.jpg`, and `draft: false` unless asked for a draft. Use `seoTitle` only if the person gives one. The cover image is also the social preview image.
5. **Body:** convert the text to Markdown:
   - `###` for normal section headings (`##` larger, `####` small). Don't renumber them, because the build fixes heading order (`src/lib/rehype-blog.mjs`).
   - `**bold**`, `*italic*`, `[text](url)`, `-` lists, `1.` lists, and `---` on its own line for a divider.
   - Internal links are relative (`/events`, `/blog/other-post`). External links open in a new tab automatically.
   - MDX treats `{ }` and `<` as code. In copy, write them as `\{`, `\}` and `&lt;`.
   - Remove template example text and unused `import` lines.
6. **Check:** `npm run build` must pass. Then look at the post: it's at `dist/blog/<slug>.html` after the build. With a dev server, run `astro dev --background`, open `/blog/<slug>` and `/blog`, then `astro dev stop`. Check one `<h1>`, the images, and no page-wide sideways scrolling at 320px.
7. **Commit** only when asked. This repo commits straight to `main`, and every push to `main` redeploys the site.

## Editing or removing

- To edit, change `index.mdx` in place. Set `updated:` to the current UTC time for substantial edits.
- To hide a post, set `draft: true`.
- If a post's folder is renamed or deleted, add `/blog/<old-slug> /blog/<new-slug-or-/blog> 301` to `public/_redirects`, above the pattern rules at the bottom.

## Components (from `src/components/blog`)

- `<Figure src={img} alt="…" align="left|right|center" width={0.5} aspect={1.5} rounded={30} href="…" caption="…" priority />`. Everything except `src` and `alt` is optional.
- `<Gallery photos={import.meta.glob("./gallery/*.{jpg,png,webp,gif}", { eager: true, import: "default" })} label="…" priority />`
- Use `priority` only on an image or slideshow at the very top of the post.
