# Acceptance Criteria

## Content increment

A content increment is complete when:

- its topic has one owning chapter in `CONTENT_ARCHITECTURE.md`;
- the English Markdown is structurally complete;
- examples include an outcome, context, and review step;
- unstable technical claims have current official support;
- duplicated guidance has been replaced with cross-links;
- headings, tables, images, and links render correctly.

## Site increment

A site increment is complete when:

- it implements only the approved content increment;
- keyboard and narrow-screen behavior remain usable;
- light and dark themes remain readable;
- metadata and navigation match the content;
- `pnpm build` succeeds;
- Astro reports no type or content errors;
- the expected routes and local assets exist in `dist/`.

## Release candidate

A release candidate additionally requires:

- all 14 chapters present and ordered;
- search index generated;
- sitemap and `robots.txt` generated;
- no temporary signed asset URLs in published output;
- no secrets or personal data in tracked files;
- internal links checked;
- current product claims sampled against official sources;
- deployment instructions tested or reviewed for the selected GitHub/Vercel layout;
- the user explicitly authorizes any push or deployment.

## Completion report

Report:

1. What content changed.
2. What site behavior changed.
3. What was verified and with which command or source.
4. What remains unverified, deferred, or outside the phase.

Do not describe a prototype as complete merely because it builds.

