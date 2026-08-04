# Repository Instructions

These instructions apply to the entire `chatgpt-super-app-handbook` project.

## Required skill

Before planning, editing, reviewing, or deploying this handbook, read and follow:

`.codex/skills/maintain-chatgpt-handbook/SKILL.md`

## Required project documents

Read only the documents relevant to the task, in this order:

1. `docs/STATUS.md` — current phase and allowed next increment.
2. `docs/PROJECT_CHARTER.md` — goals, boundaries, and source authority.
3. `docs/CONTENT_ARCHITECTURE.md` — chapter ownership and topic placement.
4. `docs/EDITORIAL_STANDARD.md` — content and citation rules.
5. `docs/SITE_STANDARD.md` — implementation and UX rules.
6. `docs/ACCEPTANCE.md` — completion gates.
7. `docs/ROADMAP.md` — phased delivery order.

## Non-negotiable workflow

- Treat the current site as a prototype until its phase is accepted in `docs/STATUS.md`.
- Work content-first: update the relevant Markdown plan or chapter before changing presentation code.
- Implement one bounded increment at a time. Do not silently expand into later roadmap phases.
- Preserve the 14-chapter book structure unless the user explicitly approves a structural change.
- Integrate new topics into the owning English chapter; do not create duplicate standalone pages by default.
- Use descriptive section titles. Add an `Overview` only when it introduces at least three related subsections or a new reader path.
- Verify volatile OpenAI product claims against current official sources before publishing them as facts.
- Run the acceptance checks relevant to the increment before reporting completion.
- Do not push, publish, deploy, purchase, or change external services without explicit user authorization.
