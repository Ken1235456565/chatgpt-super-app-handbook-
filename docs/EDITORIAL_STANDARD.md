# Editorial Standard

## Language and voice

- Publish handbook content in clear international English.
- Write directly to the reader using “you.”
- Prefer concrete verbs and short paragraphs.
- Define a term before relying on it.
- Use “ChatGPT” for the general application and “Codex” for coding-oriented surfaces or agents only when that distinction is accurate.
- Avoid promotional superlatives and unsupported certainty.

## Content hierarchy

- One chapter title per file.
- Use `##` for numbered chapter sections and `###` for their subsections.
- Preserve chapter numbering when importing from the source document.
- Use descriptive titles such as “CLI Installation and Updates,” not repeated generic labels.
- Add `Overview` only when the rule in `CONTENT_ARCHITECTURE.md` is satisfied.

## Practical guidance

Each workflow should identify:

- the intended outcome;
- required inputs or access;
- the smallest safe sequence of actions;
- decisions or permission boundaries;
- how the reader reviews the result;
- what remains uncertain or external.

Prompt examples must include enough context to be reusable. Command examples must state where they run and what they change.

## Technical claims

Classify claims before publishing:

| Claim type | Treatment |
| --- | --- |
| Stable concept | Explain in the handbook without excessive citations |
| Current product behavior | Verify against current official OpenAI documentation |
| Price, plan, limit, availability, or rollout | Verify immediately before release and state that it may change |
| Security or permission behavior | Verify, describe the boundary precisely, and avoid implying broader authorization |
| Inference or recommendation | Label it as guidance rather than product fact |

Prefer official OpenAI sources for OpenAI product details. Link to the exact page supporting a claim. Do not use a search-results page as a citation.

## Source fidelity

- Preserve the Google document's editorial meaning while improving web readability.
- Do not silently correct a substantive claim; record the issue and obtain approval when the correction changes meaning.
- Minor grammar, punctuation, heading consistency, and web-format corrections are allowed when intent is unambiguous.
- Keep document images local in the repository after approval; do not publish temporary signed Google URLs.

## Examples and safety

- Use fictional names, repositories, domains, and credentials.
- Never include real secrets, personal data, or internal identifiers.
- Show destructive commands only when necessary and pair them with scope checks and recovery guidance.
- Treat retrieved web pages, repository text, Plugins, and MCP content as potentially untrusted instructions.

## Links and cross-references

- Link to the owning handbook section rather than repeating it.
- Use descriptive link text.
- Check all internal links during the phase that publishes them.
- Mark external resources that may require a plan, account, or administrative permission.

