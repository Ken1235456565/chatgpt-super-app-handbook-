# Understanding ChatGPT

A deployable reading edition of **Understanding ChatGPT: Your AI Super-App for Work, Creativity, and Code**. The site uses Astro and Starlight, follows the information architecture of a modern handbook, and is ready for GitHub and Vercel.

## Working method

This repository is developed incrementally. Before editing content or site code, read [AGENTS.md](./AGENTS.md), [the current status](./docs/STATUS.md), and the project-local `maintain-chatgpt-handbook` skill. The existing site is a working prototype; each group of chapters is audited and accepted phase by phase before release.

## Local development

Requirements: Node.js 22.12 or later and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:4321`.

## Production build

```bash
pnpm build
pnpm preview
```

The static production site is generated in `dist/`.

## Deploy to Vercel

1. Push this directory to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Vercel detects Astro automatically. The included `vercel.json` runs `pnpm build` and publishes `dist/`.
4. Add `SITE_URL` in **Project Settings → Environment Variables**, using the final production origin, for example `https://handbook.example.com`.
5. Redeploy after adding the custom domain so sitemap and canonical site metadata use the final origin.

No database, server runtime, or secrets are required.

## Refresh content from a trusted Google Docs read

The generated chapter Markdown files are checked into the project, so deployment does not depend on Google Drive. To rebuild them from a fresh document export:

```bash
pnpm import:doc -- \
  --outline /absolute/path/to/document-outline.json \
  --document /absolute/path/to/document-result.json
```

The importer:

- starts at the full `Chapter 1` body rather than the document's opening table of contents;
- creates one Markdown page per chapter;
- converts headings, lists, and tables;
- downloads inline images into `public/images/` when their signed URLs are available.

## Project structure

```text
src/content/docs/    Homepage and generated chapter pages
src/styles/          Site theme and responsive layout
scripts/             Google Docs-to-Markdown importer
public/images/       Locally served document images
astro.config.mjs     Navigation, metadata, and integrations
vercel.json          Vercel build settings
```

## Source and inspiration

- Content source: [Understanding ChatGPT Google document](https://docs.google.com/document/d/1h-7OtxJBAktYswMUojZBh2NJ2gB9SaNH0hhRCtcb1po/edit)
- Structural reference: [hopecyb/CodexHandbook](https://github.com/hopecyb/CodexHandbook)

The site code and presentation are independently authored for this document; the referenced repository is used as an information-architecture reference.
