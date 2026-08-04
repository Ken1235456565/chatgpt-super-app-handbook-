---
name: maintain-chatgpt-handbook
description: Plan, author, audit, implement, verify, and release the Understanding ChatGPT handbook and its Astro/Starlight website. Use for any task that changes handbook Markdown, integrates Codex topics into the 14 English chapters, imports the Google document, edits navigation or presentation, reviews technical accuracy, prepares GitHub/Vercel delivery, or reports project phase status.
---

# Maintain the ChatGPT Handbook

Work content-first and advance one accepted increment at a time. Treat the current site as a prototype until the governing status document marks the relevant phase accepted.

## Establish the active phase

1. Resolve the repository root from the location of this skill.
2. Read `AGENTS.md` and `docs/STATUS.md`.
3. Read the governing documents required for the request:
   - content placement: `docs/CONTENT_ARCHITECTURE.md`
   - prose or examples: `docs/EDITORIAL_STANDARD.md`
   - UI, build, or deployment: `docs/SITE_STANDARD.md`
   - completion claims: `docs/ACCEPTANCE.md`
   - phase sequencing: `docs/ROADMAP.md`
   - scope or source authority: `docs/PROJECT_CHARTER.md`
4. Restrict work to the allowed next increment. Ask for approval before crossing into a later phase.

## Classify the task

- For a **content task**, identify one owning chapter before drafting.
- For an **audit task**, report present, partial, missing, duplicated, and stale content without redesigning unrelated pages.
- For a **site task**, require accepted Markdown or an explicit user decision before changing presentation.
- For an **import task**, inspect the diff before accepting generated chapter changes.
- For a **release task**, apply every release-candidate gate and require explicit push or deployment authorization.

## Follow the content-first sequence

1. Map the requested topic to the owning English chapter.
2. Record any architecture change in `docs/CONTENT_ARCHITECTURE.md` before implementation.
3. Draft or revise the chapter Markdown.
4. Verify current product claims using official OpenAI sources.
5. Check for duplication and replace repeated explanations with cross-links.
6. Implement only the presentation needed by the accepted content.
7. Run the relevant acceptance gates.
8. Update `docs/STATUS.md` only after the increment actually passes.

## Place overviews deliberately

- Add an `Overview` only when introducing at least three related subsections, a new reader path, or a complex workflow.
- Make the overview identify the audience, scope, sequence, and expected outcome.
- Prefer a descriptive heading when a section only needs a short introduction.
- Keep the 14-chapter top-level structure unless the user explicitly approves a change.

## Handle sources and imports

- Treat the linked Google document as the editorial source and the checked-in Markdown as the published web edition.
- Treat official OpenAI documentation as authoritative for current product behavior.
- Treat the CodexHandbook repository as structural inspiration only.
- Run `scripts/import-google-doc.mjs` only with a fresh trusted document read.
- Preserve local images and never publish temporary signed Google image URLs.
- Review generated diffs before overwriting hand-edited content. If the importer and published Markdown diverge, stop and identify which source should win.

## Verify claims and examples

- Browse current official sources for prices, plans, availability, commands, configuration, limits, permissions, security, SDKs, and integrations.
- Place citations near the claim they support.
- Label inference and recommendation as guidance.
- Use fictional names, domains, repositories, and credentials.
- State the working directory and effect of command examples.
- Include a review or validation step for every practical workflow.

## Implement the site increment

- Preserve Astro/Starlight static output unless an approved requirement demands otherwise.
- Keep chapter content in `src/content/docs/` and approved figures in `public/images/`.
- Avoid unrelated redesigns, new runtimes, databases, analytics, and third-party scripts.
- Preserve semantic headings, keyboard access, contrast, responsive tables, and local search.
- Configure the production origin with `SITE_URL`; do not hardcode an unapproved final domain.

## Apply acceptance gates

For content-only work, validate headings, links, ownership, evidence, examples, and duplication.

For site work, run at minimum:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
```

Then verify the routes and assets introduced by the increment. Apply the additional release gates in `docs/ACCEPTANCE.md` only for a release candidate.

## Report and stop

- Report the content change, site change, verification evidence, and deferred work separately.
- Distinguish a successful build from editorial acceptance.
- Stop at the current increment. Do not push, deploy, publish, purchase, or mutate an external service without explicit authorization.

