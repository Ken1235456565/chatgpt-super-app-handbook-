# Project Status

## Current phase

**Public trial — live and accepting reader feedback**

## Current state

The Astro/Starlight site is live in a public trial with 14 chapter pages, local images, navigation, search, sitemap, and Vercel configuration. The governance workflow (Phase 0), content audit, and audit remediation (Phase 1) are complete; their records remain in `docs/PHASE_1_CONTENT_AUDIT.md` and `docs/CONTENT_ARCHITECTURE.md`.

During the trial the project accepts reader comments and feedback. The reader guestbook (`docs/COMMENT_FEATURE_DESIGN.md`) is implemented and verified locally; it is not yet connected to production services or deployed. Feedback is triaged into bounded increments: content corrections go to the owning chapter, and site improvements follow `docs/SITE_STANDARD.md`.

## Allowed next increment

- Collect and triage reader comments and feedback.
- Apply content corrections and site improvements the user approves, one bounded increment at a time.
- Continue roadmap phases when the user chooses to start them.
- Configure Supabase, OpenAI, and Turnstile for the guestbook and deploy it when the user authorizes.

## Deferred work

- Do not push to GitHub or deploy to Vercel without explicit authorization.

## Phase log

| Date | Phase | Result |
| --- | --- | --- |
| 2026-08-04 | Prototype | Static build passed; editorial acceptance not assessed |
| 2026-08-04 | Phase 0 | Governance documents completed and skill validated |
| 2026-08-04 | Phase 1 | Fourteen chapters audited; topic, repetition, staleness, and structure findings recorded; awaiting acceptance |
| 2026-08-04 | Phase 1 remediation | Five topics consolidated; pricing plans and desktop UI removed; build passed |
| 2026-10-12 | Public trial | Site entered public trial; reader comments and feedback accepted |
| 2026-10-13 | Trial increment: guestbook | Guestbook implemented; build passed; posting, rate limit, admin sign-in, and deletion verified in `pnpm dev` with local fallbacks |
