# Site Standard

## Technical baseline

- Use Astro and Starlight with static output.
- Keep chapter content in `src/content/docs/` as Markdown or MDX.
- Keep approved images in `public/images/`.
- Keep the production output in `dist/` and exclude it from Git.
- Support Node.js 22.12 or later and use the checked-in pnpm lockfile.
- Avoid adding a framework, server runtime, database, or analytics service without a documented need and approval.

## Information architecture

- Homepage: explain the handbook and route the four reader paths.
- Sidebar: expose all 14 chapters in book order.
- Chapter page: show local table of contents, previous/next navigation, and searchable body content.
- Reference links: remain subordinate to the chapter narrative.

## Visual direction

The site should feel like a calm technical field guide: dense enough for serious reference, but friendly to first-time readers.

- Use typography, spacing, and restrained color for hierarchy.
- Keep the handbook's identity independent from the reference repository.
- Use one accent family consistently.
- Avoid decorative animation that interferes with reading.
- Prefer content diagrams and source-document figures over generic stock imagery.

## Accessibility

- Preserve semantic heading order.
- Provide meaningful alternative text for informative images.
- Ensure interactive elements have keyboard focus states.
- Maintain readable contrast in both light and dark themes.
- Do not encode meaning through color alone.
- Keep tables usable on narrow screens.
- Respect reduced-motion preferences when motion is introduced.

## Performance and resilience

- Generate static pages and a local search index.
- Serve document images locally with dimensions or stable containers to limit layout shift.
- Avoid third-party client scripts by default.
- The deployed site must build without access to Google Drive.
- Use `SITE_URL` at build time for the production origin, sitemap, and canonical URLs.

## SEO and sharing

Each published page needs:

- a unique title;
- a useful description;
- one canonical URL;
- indexable semantic content unless intentionally excluded;
- valid sitemap inclusion;
- accurate Open Graph metadata when a social image is approved.

## Change discipline

- Prefer the smallest change that completes the current roadmap increment.
- Do not redesign unrelated pages during a content task.
- Do not bulk-regenerate chapters after manual edits without first reviewing the diff.
- Record intentional architecture changes in the governing Markdown documents before implementation.

