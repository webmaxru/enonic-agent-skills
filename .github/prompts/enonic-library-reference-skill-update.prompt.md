---
name: "Enonic Library Reference: Update Skill"
description: "Refresh server-side Enonic XP /lib/xp API references from current official documentation."
argument-hint: "Optional: provide an XP release, API change, documentation URL, or narrower library area."
agent: "agent"
---

Update `skills/enonic-library-reference` using current Enonic XP API documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URLs below. Inspect every file under `skills/enonic-library-reference/`.

Built-in sources:
- https://developer.enonic.com/docs/platform/7.x/api/lib-auth
- https://developer.enonic.com/docs/platform/7.x/api/lib-content
- https://developer.enonic.com/docs/platform/7.x/api/lib-node
- https://developer.enonic.com/docs/platform/7.x/api/lib-portal
- https://developer.enonic.com/docs/platform/7.x/api/lib-context
- https://developer.enonic.com/docs/platform/7.x/api/lib-event
- https://developer.enonic.com/docs/platform/7.x/api/lib-task
- https://developer.enonic.com/docs/platform/7.x/api/lib-repo
- https://developer.enonic.com/docs/platform/7.x/api/lib-io
- https://developer.enonic.com/docs/platform/7.x/api/lib-mail
- https://developer.enonic.com/docs/platform/7.x/api/lib-schema
- https://developer.enonic.com/docs/platform/7.x/api/lib-project
- https://developer.enonic.com/docs/platform/7.x/api/lib-export
- https://developer.enonic.com/docs/platform/7.x/api/lib-scheduler
- https://developer.enonic.com/docs/platform/7.x/api/lib-value
- https://developer.enonic.com/docs/platform/7.x/api/lib-i18n
- https://developer.enonic.com/docs/platform/7.x/api/lib-websocket
- https://developer.enonic.com/docs/platform/7.x/api/lib-admin
- https://developer.enonic.com/docs/platform/7.x/api/lib-app
- https://developer.enonic.com/docs/platform/7.x/api/lib-auditlog
- https://developer.enonic.com/docs/platform/7.x/api/lib-cluster
- https://developer.enonic.com/docs/platform/7.x/api/lib-common
- https://developer.enonic.com/docs/platform/7.x/api/lib-grid
- https://developer.enonic.com/docs/platform/7.x/api/lib-vhost

Compare documented functions, signatures, parameters, return types, and examples with the reference files. Edit only material, source-supported differences within this skill. Preserve library coverage and structure, keep `SKILL.md` lean, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-library-reference: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
