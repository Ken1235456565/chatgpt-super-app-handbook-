# Content Architecture

## Structural rule

Keep the existing 14 top-level chapters. Add requested Codex material as sections inside the chapter that owns the reader's question. Create a new top-level chapter only after explicit approval.

Use an `Overview` section when it does real orientation work: it should define the topic, identify the intended reader, explain the section sequence, and point to a concrete outcome. Do not add an empty or repetitive `Overview` before every subsection.

## Reader paths

| Path | Entry point | Core chapters | First outcome |
| --- | --- | --- | --- |
| Beginner | Chapter 1 | 1, 3, 4, 5 | Complete and review a small task |
| Creator | Chapter 4 | 4, 7, 8, 9, 11 | Produce and verify a useful artifact |
| Developer | Chapter 5 | 5, 6, 7, 13 | Change a project and validate the diff |
| Team | Chapter 4 | 4, 6, 12, 13 | Establish a governed shared workflow |

## Chapter ownership

| Chapter | Primary responsibility |
| --- | --- |
| 1. Understanding the Application | Product mental model, access, capabilities, limitations |
| 2. What Is a Super-App? | Super-app concept, ecosystem effects, AI super-app distinction |
| 3. Navigating the Workspace | Projects, tasks, files, connected capabilities, and basic reader orientation |
| 4. How to Work With ChatGPT | Task framing, planning, context, delegation, tools, review |
| 5. Coding With ChatGPT and Codex | Beginner coding path and first small development project |
| 6. Codex for Developers | CLI, configuration, AGENTS.md, IDE, GitHub, cloud, automation |
| 7. Building Websites and Apps | Artifact workflow, generated files, acceptance and publishing readiness |
| 8. Writing and Communication | Drafting, revision, tone, document workflows |
| 9. Research and Learning | Search, sources, uncertainty, study workflows |
| 10. Everyday Productivity | Scheduled and recurring work, personal organization |
| 11. Creativity | Ideation, image and media workflows, creative iteration |
| 12. Business and Work | Team and operational workflows, decision support |
| 13. Trust, Safety, and Responsibility | Governance, permissions, sandboxing, injection, verification |
| 14. The Future of AI Super-Apps | Direction, implications, enduring mental models |

## Integration map for requested Codex topics

This map converts the requested topic inventory into chapter-owned English sections.

| Theme | Topics to integrate | Owning location |
| --- | --- | --- |
| Getting started | Talk with Codex; work with files; give clear tasks; review results; complete a first small project | Chapters 3–5; overview in Chapter 5 |
| Learning paths | Creator, developer, and team paths | Chapter 5 path overview; homepage links only summarize it |
| Agent workflow | Planning; progress and guidance; subagents; handoff and recovery | Chapter 4, under agent work and context |
| CLI | Install/update; interactive and non-interactive modes; configuration; commands; approvals; sandbox; troubleshooting | Chapter 6, one CLI overview followed by task-oriented subsections |
| Context | Project, file/directory, conversation, priority, compression, focus, sensitive context | Chapter 4 for working practice; Chapter 6 for project instructions |
| Documentation contribution | Write guide pages; add prompt examples; verify technical content | Chapter 6, contribution and quality section |
| AGENTS.md | Purpose; scope and priority; writing project instructions; monorepo patterns | Chapter 6, project configuration section |
| Configuration | Basics; profiles; project explanation; allowed/denied rules; command rules; team policies; memory | Chapter 6; security consequences cross-linked to Chapter 13 |
| Automation platform | Automated code review; `codex exec`; scripts/pipelines; structured output; exit codes/retries; SDK; webhooks | Chapter 6, automation and developer platform |
| Files and artifacts | Text/code; images/screenshots; PDFs/documents; spreadsheets; presentations; artifact acceptance | Chapter 7, files and acceptance |
| IDE | Supported editors; installation; editor context; selection/open files; local/cloud work; review; settings; troubleshooting | Chapter 6, IDE workflow |
| GitHub and verification | Integration; diff review; tests; artifact validation; source verification; uncertainty; completion definition | Chapter 6, with principles cross-linked to Chapters 9 and 13 |
| Reference material | Glossary; FAQ; feature comparison; slash commands; CLI/config/permission/env/shortcut/error references; troubleshooting index; official resources | Chapter 6 concise reference section; link outward rather than duplicating unstable specifications |
| Policy and security | Acceptable use; threat model; Plugin/MCP risk; prompt injection | Chapter 13 |
| Tool selection | Shell; web search; browser; computer use; image generation; voice | Chapter 4, tool-choice section; risks in Chapter 13 |
| Cloud | GitHub connection; environment; secrets; pull requests; cloud review; delegation; internet; troubleshooting | Chapter 6, cloud workflow; permissions in Chapter 13 |
| Cross-cutting checks | Permissions/sandbox; context/files; verification; troubleshooting | Summarize in Chapters 4 and 13; avoid repeating full instructions in every chapter |

## Section design

For a substantial section, prefer this sequence:

1. **Overview** — who it is for, what it covers, and the expected outcome.
2. **Core model** — the minimum concept needed to reason correctly.
3. **Workflow** — ordered actions with inputs and boundaries.
4. **Example** — a realistic prompt, command, or artifact.
5. **Review** — how to inspect and validate the result.
6. **Troubleshooting or handoff** — what to do when the path fails or pauses.

## Duplication policy

- Explain a concept fully once in its owning chapter.
- Elsewhere, give a one-sentence reminder and a link.
- Keep command references short and defer volatile details to official documentation.
- Let the homepage route readers; do not turn it into another table of contents.

## Canonical ownership decisions

The following decisions were approved after the Phase 1 audit:

| Topic | Canonical owner | Treatment elsewhere |
| --- | --- | --- |
| Learning paths | Chapter 5.11 | Link from orientation or role-specific chapters |
| ChatGPT/Codex distinction | Chapter 1.1 | Refer to the distinction without redefining it |
| Permissions and authorization boundaries | Chapter 13 | Keep only domain-specific risk notes and link back |
| Plugins, Sites, and Scheduled definitions | Chapter 3.6–3.8 | Describe only the chapter-specific application or risk |
| Test authenticity and false verification | Chapter 6.10 | Keep beginner summary in Chapter 5 and general evidence standard in Chapter 13 |

Product pricing plans and desktop-interface descriptions are excluded from the handbook. Platform-neutral access and workflow guidance may remain.
