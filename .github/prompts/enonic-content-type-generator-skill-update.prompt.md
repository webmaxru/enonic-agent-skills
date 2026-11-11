---
name: "Enonic Content Type Generator: Update Skill"
description: "Refresh Enonic XP content type schema guidance from current official documentation."
argument-hint: "Optional: provide an XP release, schema change, documentation URL, or narrower content-type area."
agent: "agent"
---

Update `skills/enonic-content-type-generator` using current Enonic XP documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URLs below. Inspect every file under `skills/enonic-content-type-generator/`.

Built-in sources:
- https://developer.enonic.com/docs/platform/7.x/cms/content-types
- https://developer.enonic.com/docs/platform/7.x/cms/schemas
- https://developer.enonic.com/docs/platform/7.x/cms/schemas/input-types
- https://developer.enonic.com/docs/platform/7.x/cms/schemas/option-set
- https://developer.enonic.com/docs/platform/7.x/cms/schemas/item-set
- https://developer.enonic.com/docs/platform/7.x/cms/schemas/mixins
- https://developer.enonic.com/docs/platform/7.x/cms/x-data

Check content type inheritance, inputs, form schemas, option/item sets, mixins, and x-data. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-content-type-generator: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
