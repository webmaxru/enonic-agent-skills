---
name: "Enonic Guillotine Query Builder: Update Skill"
description: "Refresh Guillotine GraphQL query, schema, filtering, and pagination guidance from official documentation."
argument-hint: "Optional: provide a Guillotine release, schema change, documentation URL, or narrower query area."
agent: "agent"
---

Update `skills/enonic-guillotine-query-builder` using current official Guillotine documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URL below. Inspect every file under `skills/enonic-guillotine-query-builder/`.

Built-in source:
- https://developer.enonic.com/docs/guillotine/stable

Check schema/query behavior, variables, filtering, aggregations, pagination, sorting, and type-generation guidance. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-guillotine-query-builder: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
