---
name: "Enonic App Manager: Update Skill"
description: "Refresh the Enonic CLI and local development guidance in the enonic-app-manager skill from current official documentation."
argument-hint: "Optional: provide an Enonic CLI release, change note, documentation URL, or narrower skill area to review."
agent: "agent"
---

Update `skills/enonic-app-manager` using current Enonic CLI documentation and any information supplied for this run.

Read `.github/aw/skill-update-runtime.md` first. Use its URL-to-file mapping and the prefetched source files as local copies of the built-in documentation URL below. Then inspect all files under `skills/enonic-app-manager/`, including `SKILL.md`, `references/`, `assets/`, and `scripts/`.

Built-in source:
- https://developer.enonic.com/docs/enonic-cli/stable

Compare supported CLI commands, sandbox lifecycle, project scaffolding, dev mode, deployment, and CI/CD guidance against the skill. Make only material, source-supported edits within this skill directory. Keep `SKILL.md` lean, preserve its scope and layout, do not add human-oriented files, and do not change `metadata.version`; release automation handles versioning.

If changes are warranted, request a pull request title in the form `enonic-app-manager: <concise summary>`; the worker adds the `[skill-update] ` prefix. This title slug must match the full skill directory.

If fetched documentation does not justify a safe edit, skip that claim rather than guessing. If a URL fails during prefetch, let the workflow report the failure; do not make unsupported edits. If all sources are fetched and no material change is justified, call `noop` with a brief explanation.
