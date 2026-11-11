---
name: "Enonic Controller Generator: Update Skill"
description: "Refresh Enonic XP controller, rendering, and TypeScript guidance from current official documentation."
argument-hint: "Optional: provide an XP release, controller change, documentation URL, or narrower controller area."
agent: "agent"
---

Update `skills/enonic-controller-generator` using current Enonic XP documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URLs below. Inspect every file under `skills/enonic-controller-generator/`.

Built-in sources:
- https://developer.enonic.com/docs/platform/7.x/framework/controllers
- https://developer.enonic.com/docs/platform/7.x/api/lib-portal
- https://developer.enonic.com/docs/platform/7.x/development/typescript

Check controller exports, page/part/layout descriptors, regions, rendering, response processors, portal APIs, and TypeScript setup. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-controller-generator: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
