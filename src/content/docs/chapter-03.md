---
title: "Chapter 3: Navigating the ChatGPT Workspace"
description: "Organize work by outcome, project context, files, connected capabilities, publishing, and recurring tasks."
sidebar:
  order: 3
  label: "Navigating the ChatGPT Workspace"
---

<!-- Generated from https://docs.google.com/document/d/1h-7OtxJBAktYswMUojZBh2NJ2gB9SaNH0hhRCtcb1po/edit. Edit the source document or this file deliberately. -->

Treat ChatGPT as a work environment rather than one endless conversation. Organize work by outcome, persistent project context, task-specific files, connected capabilities, publishing needs, and recurring work.

## 3.1 Start With the Task

First identify what must be produced, what context is required, and how the result will be reviewed. The core distinction between ChatGPT and Codex is defined once in [Chapter 1](/chapter-01/#11-chatgpt-in-plain-english); this chapter focuses on organizing the work around that choice.

## 3.2 Separate Distinct Outcomes

Start a separate conversation or task for each distinct outcome. Keep research, drafting, implementation, review, and follow-up separate when combining them would make decisions or evidence difficult to recover.

Let a Project preserve durable shared context instead of copying the same background into every task. Before beginning, confirm the intended outcome, relevant Project, supplied files, and review method.

## 3.3 Choose Context Before Tools

Select the smallest useful context before adding tools: the current conversation for one-off work, a Project for durable shared material, and a local folder or repository when the task depends on actual files. Tool access does not compensate for missing or irrelevant context.

## 3.4 Working in Projects

A Project groups related work and durable context. It may carry shared files, instructions, and connected sources across related conversations; development work may also depend on a selected local folder or repository.

A Project organizes context; it does not grant authority. Apply the canonical permission and sandbox guidance in [Chapter 13](/chapter-13/#1312-permissions-sandboxes-and-cross-cutting-checks).

## 3.5 Working With Files and Images

Attach a file or image directly when it applies only to one task. Add material to a Project when it should be available across related work. Use a local project when the task depends on files or a repository on the computer.

## 3.6 Using Plugins, Skills, Connectors, and Apps

Plugins are installable capability bundles. A Plugin may combine reusable skills, authenticated connectors, MCP tools, hooks, resources, and workflow instructions.

A skill provides reusable instructions and supporting resources for a workflow. A connector provides authenticated access to an external service or data source. An app can provide tools or a task-specific interface. Installing a Plugin does not necessarily complete authentication for every connector it contains.

Review the Plugin's contents and connect each external service deliberately. [Chapter 13](/chapter-13/#133-plugin-permissions) owns the security and permission guidance.

## 3.7 Creating and Publishing With Sites

Sites lets ChatGPT create, host, refine, and share websites, web apps, and games. A Site can begin from a prompt or a compatible local project. Describe the audience, purpose, required behavior, data, authentication, and file-storage needs before building.

Sites separates saving a version from deploying it. Treat every deployment URL as a production deployment. When review is required, save a version without deploying it; then inspect content, links, forms, authentication, permissions, data behavior, and sensitive information before publishing.

## 3.8 Creating Recurring Work With Scheduled

Scheduled is a persistent surface for recurring or delayed tasks. A standalone scheduled task can create a separate run each time. A scheduled task inside a chat can return to the same conversation and its existing context. Supported local-project tasks can run in the project directory or an isolated Git worktree.

Test a prompt manually before scheduling it. Review the first runs and define when the task should stop, report uncertainty, or ask for human input. A local task also depends on its required machine and project resources remaining available.

## 3.9 Moving Into Software Implementation

When the work enters a real repository, continue with the beginner workflow in [Chapter 5](/chapter-05/) or the developer workflow in [Chapter 6](/chapter-06/). Preserve the goal, relevant files, decisions, and acceptance criteria during the handoff.

## 3.10 Moving From Questions to Finished Work

A complete workflow may cross several surfaces. ChatGPT can research users and draft requirements; a Project can preserve interviews and brand material; a Plugin can retrieve approved Drive or Slack information; Sites can build and host a first version; Codex can implement custom code and tests; Pull requests can organize review; and Scheduled can check the site, tests, or feedback later.

The goal is not to use every feature. Choose the smallest surface that supplies the required context, tools, persistence, and review boundary.

## 3.11 Choosing a Codex Surface

Choose the working surface by the task rather than by habit. The CLI is efficient for terminal users and automation; the IDE extension is useful when editor context matters; Web and Cloud are useful for repository-connected work that should run away from the local machine.

Reference structure adapted from the [Codex Handbook guide](https://codexhandbook.com/guide/).

### Working surfaces at a glance

- CLI: installation and updates, interactive and non-interactive modes, configuration, commands, shortcuts, approvals, sandboxing, and troubleshooting.
- IDE extension: supported editors, installation, editor context, selections and open files, local workflow, Cloud tasks, review, settings, and troubleshooting.
- Web and Cloud: GitHub connection, Cloud environments, Secrets and environment variables, pull requests, Cloud code review, delegation, internet access, and troubleshooting.

Detailed learning paths live in [Chapter 5](/chapter-05/#511-beginner-creator-developer-and-team-paths). Detailed permissions and acceptance checks live in [Chapter 13](/chapter-13/#1312-permissions-sandboxes-and-cross-cutting-checks).
