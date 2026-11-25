---
name: "Enonic Content Management: Update Skill"
description: "Refresh bulk content management, NoQL, task, and import/export guidance from official Enonic XP documentation."
argument-hint: "Optional: provide an XP release, change note, documentation URL, or narrower content-management area."
agent: "agent"
---

Update `skills/enonic-content-management` using current Enonic XP documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URLs below. Inspect every file under `skills/enonic-content-management/`.

Built-in sources:
- https://developer.enonic.com/docs/platform/7.x/api/lib-content
- https://developer.enonic.com/docs/platform/7.x/api/lib-node
- https://developer.enonic.com/docs/platform/7.x/api/lib-task
- https://developer.enonic.com/docs/platform/7.x/api/lib-export

Check query DSL, aggregation, pagination, batching, long-running task patterns, and import/export behavior. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-content-management: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
