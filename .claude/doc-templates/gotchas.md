# {{Topic}} Gotchas

Read this when: {{specific tasks or files an agent is touching that should trigger reading this — be concrete}}

<!--
Use this template for project-specific pitfall documents about a single tool/layer/library
(build pipeline, icon library, styling system, etc.). One concern per document.

Ordering rule (P3 — Information Priority): Pitfalls → Rules → Examples → Rationale.
Lead with what will break, not why we made the decision.
-->

## Overview

<!-- 1–3 lines. What this document covers and the bounded scope. -->

## Pitfalls

<!--
The core of the document. Each subsection is one regression-prone trap discovered
in practice. Lead each with the visible failure mode so a future agent can match
their symptom to the doc.

Format per pitfall:
### {short imperative title — e.g. "`pnpm <name>` collides with built-in subcommands"}
- What goes wrong (symptom)
- Why (root cause, one line)
- What to do instead (rule)
-->

## Conventions

<!--
Project-specific rules that aren't pitfalls but must not drift. Tokens, naming,
layering, where to put what. Use MUST / NEVER / ALWAYS language (P7).
Omit this section if there are no standing conventions beyond the pitfalls.
-->

## Rationale

<!--
Background for non-obvious decisions, only when knowing the why helps an agent
make correct edge-case calls. Keep brief — link out to issues/PRs instead of
restating long discussion threads.
-->
