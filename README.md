# boydinnovation.org

Astro rebuild of the Boyd Innovation Center website, migrating from Squarespace. See [AGENTS.md](AGENTS.md) for scope and goals.

## Commands

| Command | Action |
|---|---|
| `npm install` | Install dependencies (Node 22.23.4+) |
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build a preview site to `dist/` (blocks search engines) |
| `PUBLIC_SITE_ENV=production npm run build` | Build for launch (allows indexing) |
| `npm run preview` | Serve the built site locally |
| `npx astro check` | Type-check components and content |

## Where things live

```text
src/
├── config/site.ts       Navigation, footer links, address, tracking IDs
├── content/home.yaml    Homepage copy and images (see CONTENT.md)
├── content.config.ts    Content schemas
├── components/          Site-wide components (header, footer, analytics, newsletter)
│   └── home/            Homepage sections
├── layouts/BaseLayout.astro   <head>, SEO tags, structured data, page shell
├── pages/               One file per URL
└── styles/              Design tokens (tokens.css) and base styles
public/video/            Hero background video
```

## Docs

- [CONTENT.md](CONTENT.md): how to edit content (for non-developers)
- [MIGRATION-NOTES.md](MIGRATION-NOTES.md): deviations, fixes and open questions, page by page
- [INTEGRATIONS.md](INTEGRATIONS.md): third-party scripts and embeds
