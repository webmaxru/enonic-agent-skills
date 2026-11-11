---
name: "Enonic Next.XP Integration: Update Skill"
description: "Refresh Next.XP and Enonic XP headless integration guidance from current official documentation."
argument-hint: "Optional: provide a Next.XP release, integration change, documentation URL, or narrower area."
agent: "agent"
---

Update `skills/enonic-nextxp-integration` using current Next.XP documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URL below. Inspect every file under `skills/enonic-nextxp-integration/`.

Built-in source:
- https://developer.enonic.com/learn/nextjs/stable

Check adapter setup, content type to React component mapping, Guillotine data fetching, Content Studio preview, and draft/master branch behavior. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-nextxp-integration: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
