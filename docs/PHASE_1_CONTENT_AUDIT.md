# Phase 1 Content Audit

Audit date: 2026-08-04  
Scope: `src/content/docs/chapter-01.md` through `chapter-14.md`  
Content edits made: none

## Status legend

- **Existing / 已有** — substantive coverage exists in an owning chapter.
- **Partial / 部分** — the topic is named or explained, but lacks one or more of workflow, example, verification, troubleshooting, or appropriate depth.
- **Missing / 缺失** — no usable content exists; a label or wishlist alone does not count.
- **Repeated / 重复** — materially similar guidance appears in more than one location and needs a clear owner plus cross-links.
- **Potentially stale / 可能过时** — the claim depends on current pricing, product UI, availability, commands, integrations, or third-party behavior and requires official verification before release.

Statuses are not mutually exclusive. A theme can be substantive, repeated, and potentially stale at the same time.

## Executive result

- All 14 chapter files and chapter boundaries are present and ordered correctly.
- All 18 requested topic groups have an assigned owning chapter.
- Five groups contain at least one substantive base: getting started, files and artifacts, GitHub and verification, policy and security, and cross-cutting checks. Each still has identified gaps.
- Sixteen groups are marked partial: most requested Codex material currently appears as short summaries or inventory bullets rather than complete guide sections.
- The reference-material group is missing as usable content; Chapter 6 only lists the references that should eventually exist.
- Seven groups have notable thematic repetition.
- Eight groups contain volatile claims that require later official verification.
- Chapters 7–12 contain 48 numbered section labels that are plain paragraphs rather than Markdown headings.
- The chapter body contains only one editorial Markdown link. Current product claims generally have no adjacent official citations.

This audit satisfies the Phase 1 inventory requirement, but it does not approve any chapter for publication.

## Chapter boundary and structure audit

| Chapter | Boundary | Structure | Main audit result |
| --- | --- | --- | --- |
| 1 | Confirmed | H2/H3 present | Substantive introduction; pricing, product UI, and competitor comparisons need verification; multiple visible copy/import errors |
| 2 | Confirmed | H2/H3 present | Coherent super-app explanation; mostly stable conceptual content |
| 3 | Confirmed | H2/H3 present | Strong surface orientation; product labels and availability are volatile; learning paths overlap Chapter 5 |
| 4 | Confirmed | H2/H3 present | Strong task-framing foundation; agent/context/tool additions are concise overviews rather than complete workflows |
| 5 | Confirmed | H2/H3 present | Strong beginner coding material; learning paths are present but shallow; Sites claims require verification |
| 6 | Confirmed | H2/H3 present | Core developer material is substantial; Sections 6.11–6.14 are mostly topic inventories awaiting guide depth |
| 7 | Confirmed | Partial | Sections 7.1–7.5 are plain paragraphs, not headings; file/artifact coverage is useful but compressed |
| 8 | Confirmed | Defective | Sections 8.1–8.9 and four closing pattern labels are plain paragraphs, not headings |
| 9 | Confirmed | Defective | Sections 9.1–9.9 and four closing pattern labels are plain paragraphs; source-verification advice has no actual cited example |
| 10 | Confirmed | Partial | Sections 10.1–10.7 are plain paragraphs; Scheduled behavior is detailed but volatile |
| 11 | Confirmed | Defective | Sections 11.1–11.9 and four closing pattern labels are plain paragraphs; named third-party product claims need verification |
| 12 | Confirmed | Defective | Sections 12.1–12.9 and four closing pattern labels are plain paragraphs; governance overlaps Chapter 13 |
| 13 | Confirmed | H2/H3 present | Requested trust themes exist; several are high-level summaries and repeat warnings from earlier chapters |
| 14 | Confirmed | H2/H3 present | Coherent conclusion; current product surfaces are presented as future primitives and may age quickly |

## Requested-theme audit

### 1. Getting started

**Status: Existing / 已有 · Partial / 部分 · Repeated / 重复**

Evidence:

- Chapter 3 explains choosing a surface, starting a chat, Projects, files, and moving into Codex.
- Chapter 4 explains outcomes, context, instruction styles, feedback, and step-by-step work.
- Chapter 5 explains the beginner coding loop and names the sequence “talk, files, clear task, review, first project.”

Gap and disposition:

- “Complete the first small project” is not yet one continuous tutorial with setup, files, actions, review evidence, and a final handoff.
- Keep navigation in Chapter 3, working method in Chapter 4, and the end-to-end first project in Chapter 5.

### 2. Beginner, creator, developer, and team paths

**Status: Partial / 部分 · Repeated / 重复**

Evidence:

- Chapter 3.11 and Chapter 5.11 both name the four paths.

Gap and disposition:

- Each path is only one sentence and has no prerequisites, recommended sequence, milestone, or completion evidence.
- Make Chapter 5.11 the full owner. Reduce Chapter 3.11 to surface selection and cross-link to Chapter 5.

### 3. Planning, progress, subagents, handoff, and recovery

**Status: Partial / 部分**

Evidence:

- Chapter 4.10 names all four elements and defines their purpose.

Gap and disposition:

- No decision rule for when to plan, when to use a subagent, how to reconcile parallel output, or how to format a recoverable handoff.
- Expand Chapter 4.10 into an overview plus bounded subsections and one worked example.

### 4. CLI

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapter 3.11 identifies the CLI as a working surface.
- Chapter 6.12 mentions installation, updates, interactive and non-interactive use, configuration, shortcuts, approvals, sandboxing, troubleshooting, and `codex exec`.

Missing detail:

- No installation or update commands.
- No interactive-mode walkthrough.
- No non-interactive command examples.
- No configuration file locations or examples.
- No command/shortcut reference.
- No approval/sandbox examples.
- No troubleshooting cases.

Disposition: retain one CLI overview in Chapter 6, then add task-oriented subsections after current official verification.

### 5. Context

**Status: Partial / 部分 · Repeated / 重复**

Evidence:

- Chapter 4.10 covers project, file/directory, and conversation context; precedence, compression, focus, and sensitive context are all named.
- Chapters 3, 6, and 13 repeat project and permission boundaries.

Gap and disposition:

- Priority is described only as “make precedence explicit.” There is no concrete precedence example, compaction checklist, or sensitive-context handling example.
- Keep the operational model in Chapter 4; keep project instructions in Chapter 6 and risk controls in Chapter 13.

### 6. Writing and contributing documentation

**Status: Partial / 部分**

Evidence:

- Chapter 6.14 names focused guide pages, realistic prompt examples, and authoritative technical verification.

Gap and disposition:

- No page template, prompt-example anatomy, source policy example, review workflow, or contribution checklist.
- Expand under Chapter 6.14 rather than creating a second documentation handbook.

### 7. AGENTS.md

**Status: Partial / 部分**

Evidence:

- Chapter 6.11 explains purpose, scope, precedence, operational instructions, monorepo placement, and the distinction between project documentation and AGENTS.md.

Gap and disposition:

- No complete example, nested-scope example, conflict-resolution example, or quality checklist.
- The conceptual coverage is sound enough to serve as the base for a future guide section.

### 8. Configuration, profiles, rules, memory, and preferences

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapter 6.11 distinguishes profiles, allow/deny rules, command rules, team policy, persistent context, and personal preferences.

Missing detail:

- No configuration locations, field examples, profile selection workflow, rule syntax, precedence behavior, or team-policy example.
- Memory and persistent context are described conceptually but not by supported mechanism.

Disposition: expand only after current configuration behavior is verified.

### 9. Desktop app

**Status: Partial / 部分 · Repeated / 重复 · Potentially stale / 可能过时**

Evidence:

- Chapters 1 and 3 describe the desktop interface and workspaces.
- Chapters 3.11 and 6.13 list projects/tasks, parallel agents, worktrees, diffs, comments, terminal, local/cloud tasks, notifications, settings, and troubleshooting.

Gap and disposition:

- Most requested items are labels, not instructions. Installation, interface workflow, worktree lifecycle, diff commenting, notifications, settings, and troubleshooting lack procedures.
- Own task-oriented developer guidance in Chapter 6. Retain only orientation in Chapters 1 and 3.

### 10. Automation, `codex exec`, SDK, and webhooks

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapter 6.12 names automated review, `codex exec`, pipelines, structured output, exit codes, retries, SDK embedding, and webhook triggers.

Gap and disposition:

- There are no commands, schemas, sample outputs, exit-code cases, retry boundaries, SDK examples, webhook payload examples, or CI workflow.
- Treat the current section as an outline awaiting official technical verification and executable examples.

### 11. Files and generated artifacts

**Status: Existing / 已有 · Partial / 部分**

Evidence:

- Chapter 7.11 covers text/code, images/screenshots, PDFs/documents, tables/spreadsheets, presentations, and artifact acceptance.

Gap and disposition:

- Coverage is a useful acceptance checklist but does not explain how to create, inspect, or hand off each format.
- Add one overview and format-specific subsections in Chapter 7 during Phase 5.

### 12. IDE extension

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapters 3.11 and 6.13 list supported editors, installation, editor context, selections/open files, local/cloud work, review, settings, and troubleshooting.

Gap and disposition:

- Every requested IDE item is only an inventory phrase. No supported-editor list, installation procedure, context behavior, workflow, setting, or troubleshooting example is present.
- Own all detailed IDE material in Chapter 6.13.

### 13. GitHub integration and verification

**Status: Existing / 已有 · Partial / 部分 · Repeated / 重复 · Potentially stale / 可能过时**

Evidence:

- Chapter 6.6 covers diffs, code review, and pull requests.
- Chapters 5.10 and 6.10 cover tests, fake data, and false verification.
- Chapter 6.14 covers sources, uncertainty, and definition of done.
- Chapter 9.7 covers source verification.
- Chapter 13.7 and 13.9 cover repository risk and evidence.

Gap and disposition:

- GitHub connection/setup, in-product review workflow, and concrete pull-request operations are missing.
- Fake-test-data guidance in Chapters 5 and 6 overlaps substantially. Keep the detailed engineering version in Chapter 6 and a short beginner warning in Chapter 5.
- Keep source methodology in Chapter 9 and security boundaries in Chapter 13.

### 14. Reference material

**Status: Missing / 缺失**

Evidence:

- Chapter 6.14 lists a glossary, FAQ, feature comparison, slash commands, CLI/configuration references, permission matrix, environment variables, shortcuts, error reference, troubleshooting index, and official resources.

Gap and disposition:

- None of those references actually exists as usable handbook content.
- The current paragraph is a backlog inventory, not a reference section.
- Build concise reference material only after the narrative workflows and official technical verification are stable.

### 15. Acceptable use, threat model, Plugin/MCP risk, and prompt injection

**Status: Existing / 已有 · Partial / 部分 · Repeated / 重复**

Evidence:

- Chapter 13.11 explicitly covers all four requested topics.
- Chapters 3, 10, and 12 also discuss Plugin permissions and external-service boundaries.

Gap and disposition:

- Acceptable use and threat modeling are one-line definitions, not actionable policies or worked examples.
- Plugin/MCP risk and prompt injection need trust-boundary examples and response procedures.
- Keep the full treatment in Chapter 13 and replace repeated security explanations elsewhere with short reminders and links.

### 16. Tool selection

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapter 4.11 names shell/terminal, web search, browser tools, Computer Use, image generation, and voice, and maps each to an evidence type.

Gap and disposition:

- No selection matrix, permissions discussion, failure cases, or worked example exists.
- Chapter 4 should own selection and evidence; Chapter 13 should own tool risk.

### 17. Cloud workflow

**Status: Partial / 部分 · Potentially stale / 可能过时**

Evidence:

- Chapters 3.11 and 6.13 name GitHub connection, cloud environments, secrets/environment variables, pull requests, cloud review, delegation, follow-up, internet access, and troubleshooting.

Gap and disposition:

- All requested cloud topics remain inventory phrases. There is no environment setup, secret-handling example, internet policy, delegation lifecycle, PR workflow, or troubleshooting case.
- Own detailed cloud guidance in Chapter 6.13; cross-link security consequences to Chapter 13.

### 18. Permissions, context/files, verification, and troubleshooting

**Status: Existing / 已有 · Repeated / 重复**

Evidence:

- Chapter 13.12 gives a concise four-part cross-cutting checklist.
- The same principles recur across Chapters 1, 3–7, 9, 10, and 12.

Disposition:

- Keep Chapter 13.12 as the canonical checklist.
- Let other chapters add only domain-specific evidence or failure handling and link back to the canonical section.

## Overview placement audit

Every chapter has an opening paragraph that functions as a chapter overview. No chapter currently uses a dedicated `Overview` heading.

Dedicated overview treatment is justified for these multi-part sections when they are expanded:

- Chapter 4.10 — Agent Work and Context.
- Chapter 4.11 — Tools and Inputs.
- Chapter 5.11 — Reader and learning paths.
- Chapter 6.12 — CLI, Automation, and Developer Platform.
- Chapter 6.13 — Desktop, IDE, GitHub, and Cloud.
- Chapter 6.14 — Quality, Contribution, Reference, and Troubleshooting.
- Chapter 7.11 — Files and Generated Artifacts.
- Chapter 13.11 — Team Governance and Secure Tool Use.

The overview may be an introductory paragraph under the descriptive section title; it does not need to be literally titled “Overview” when the descriptive title is clearer.

## Repetition audit

No long paragraph is duplicated verbatim across different chapter files. The repetition is thematic:

1. **ChatGPT versus Codex** — repeated in Chapters 1, 3, 5, 6, 12, and 14.
2. **Learning paths** — repeated in Chapters 3.11 and 5.11.
3. **Permissions and review boundaries** — repeated across Chapters 1, 3–7, 10, 12, and 13.
4. **Sites, Scheduled, and Plugins definitions** — introduced or redefined in Chapters 1, 3, 5, 7, 10, 13, and 14.
5. **Tests, fake data, and verification** — repeated in Chapters 1.7, 5.10, 6.10, and 13.9.
6. **Collaboration Pattern / Field Note / Review Checklist / Handoff Prompt** — useful repeated structure, but Chapter 8, 9, 11, and 12 labels are not headings and therefore do not function consistently.

Future editing should preserve short reminders where the domain changes the advice, but assign one canonical explanation and use links elsewhere.

## Potentially stale claim clusters

“Potentially stale” means “requires official verification,” not “confirmed false.”

1. **Plans and prices — Chapter 1.5.** The Free, Go, Plus, Pro, Business, and Enterprise tables contain exact plan names, prices, billing terms, and capabilities.
2. **Current desktop UI — Chapters 1 and 3.** Workspace selectors, Chat/Work/Quick Chat modes, sidebar labels, Projects, Pull requests, Sites, Scheduled, and Plugins may change by platform, plan, or rollout.
3. **Plugin packaging and availability — Chapters 3, 10, 13, and 14.** Claims about skills, connectors, MCP tools, hooks, browser capabilities, supported surfaces, authentication, and templates require current documentation.
4. **Sites behavior — Chapters 3, 5, 7, 13, and 14.** Local-project compatibility, version saving, deployment, hosting, authentication, data, analytics, and production semantics require verification.
5. **Scheduled behavior — Chapters 3, 10, 13, and 14.** Standalone/chat runs, retained context, local-project schedules, worktrees, computer/app availability, and run states are current product details.
6. **Codex surfaces and platform features — Chapters 3 and 6.** CLI, IDE, desktop, web/cloud, SDK, webhooks, structured output, review automation, and cloud behavior are only summarized and uncited.
7. **Competitor comparisons — Chapter 1.9.** Claude Code and Google Antigravity capabilities and safety models are time-sensitive and need primary-source verification or removal from the OpenAI-focused guide.
8. **Creative-production tools — Chapter 11.** HeyGen, HyperFrames, and Remotion capability statements need current primary-source verification before release.

## Copy and import defects

The following visible defects should be corrected during the owning chapter's editing phase, not during this audit:

- Chapter 1: `information, .`
- Chapter 1: stray `C:` before the connected-Apps sentence.
- Chapter 1: `newNew`, `organizesorganizes`, `maycan`, and `reflectreflects`.
- Chapter 1: suspicious plan labels such as `Pro $100`, `Pro $200`, and `Business ChatGPT and ChatGPT`.
- Chapter 1: repeated replacement artifacts such as `ChatGPT and ChatGPT`.
- Chapters 7–12: 48 numbered section labels are plain paragraphs instead of Markdown headings.
- Chapters 8, 9, 11, and 12: `Collaboration Pattern`, `Field Note`, `Review Checklist`, and `Handoff Prompt` are plain paragraphs instead of consistent subheadings.
- Several figures use the generic alt text “Illustration from the source document,” which is not sufficiently descriptive for publication.

## Prioritized issue list for later phases

### Priority 0 — Structural integrity

- Convert the 48 plain numbered labels in Chapters 7–12 to `##` headings.
- Convert repeated closing pattern labels to consistent `###` headings.
- Correct visible import/copy defects in Chapter 1.

### Priority 1 — Reader foundation

- Consolidate learning-path ownership in Chapter 5.
- Build one complete beginner project with review evidence.
- Separate orientation in Chapter 3 from working method in Chapter 4.

### Priority 2 — Developer depth

- Expand Chapter 6.11–6.14 from inventories into verified workflows.
- Add CLI, IDE, cloud, configuration, automation, and GitHub examples only after official verification.
- Keep reference material deferred until commands and configuration stabilize.

### Priority 3 — Canonical cross-cutting guidance

- Make Chapter 13 the canonical location for permissions, sandboxing, Plugin/MCP risk, prompt injection, and cross-cutting checks.
- Make Chapter 9 the canonical location for source methodology.
- Replace repeated full explanations elsewhere with domain-specific summaries and links.

## Phase 1 exit-gate result

- Fourteen chapter boundaries: **confirmed**.
- Requested topics: **all assigned an owner and disposition**.
- Partial and missing content: **identified**.
- Repetition: **identified by theme**.
- Potentially stale claims: **identified for later official verification**.
- Website code or chapter prose changed: **no**.

Phase 1 is complete as an audit artifact and awaits user review. The next roadmap phase must not begin automatically.

## Approved post-audit decisions

The user approved the following remediation after reviewing this audit:

- Deduplicate learning paths, the ChatGPT/Codex distinction, permission boundaries, Plugins/Sites/Scheduled definitions, and tests/verification.
- Delete product pricing-plan content.
- Delete desktop-interface descriptions.

Canonical ownership is recorded in `docs/CONTENT_ARCHITECTURE.md`. The audit findings above remain as the historical description of the pre-remediation Markdown.

The remediation was implemented in the chapter Markdown. Astro content validation and the production build completed successfully; no homepage or presentation code changed.
