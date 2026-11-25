---
name: "Enonic Event Manager: Update Skill"
description: "Refresh Enonic XP event, HTTP service, webhook, and asynchronous task guidance from official documentation."
argument-hint: "Optional: provide an XP release, event change, documentation URL, or narrower integration area."
agent: "agent"
---

Update `skills/enonic-event-manager` using current Enonic XP documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and prefetched sources as local copies of the built-in URLs below. Inspect every file under `skills/enonic-event-manager/`.

Built-in sources:
- https://developer.enonic.com/docs/platform/7.x/framework/events
- https://developer.enonic.com/docs/platform/7.x/api/lib-event
- https://developer.enonic.com/docs/platform/7.x/runtime/engines/http-service
- https://developer.enonic.com/docs/platform/7.x/api/lib-task
- https://developer.enonic.com/docs/platform/7.x/api/lib-portal

Check listener registration, event types and filtering, HTTP service patterns, portal service URLs, and task-based asynchronous processing. Treat application-specific webhook configuration as supported only when the official sources substantiate it; do not infer configuration keys. Edit only material, source-supported differences within this skill. Keep `SKILL.md` lean, preserve scope and structure, add no human-oriented files, and do not change `metadata.version`; release automation owns versioning.

If changes are warranted, request a pull request title in the form `enonic-event-manager: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
