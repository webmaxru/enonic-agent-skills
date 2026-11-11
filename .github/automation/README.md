# Automation

This repository calls the shared workflows maintained by [webmaxru/ai-native-dev](https://github.com/webmaxru/ai-native-dev/tree/main/.github/automation). See the hub's [release guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/release.md) and [weekly update guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/weekly-updates.md) for workflow behavior and operations.

## Repository settings

- `AUTO_SHIP`: set to `false` to disable review-approved skill-update merges; enabled when unset.
- `AUTO_RELEASE`: set to `false` to disable push, scheduled, and automatic post-ship releases; a manually dispatched release remains available. Enabled when unset.
- `COPILOT_GITHUB_TOKEN`: required by the shared GH-AW worker. `secrets: inherit` was confirmed by Enonic test runs `43060261560` and `43060304822`; both reached agent execution before failing on the retired model below.
- `GH_AW_MODEL_AGENT_COPILOT`: set to `auto`; the previous value `claude-opus-4.6` failed because the model is retired. Keep `auto` to match the shared worker while the legacy local workflow is retained for rollback.

## Enonic-specific notes

- The weekly workflow runs Mondays at 09:00 UTC and selects saved prompts under `.github/prompts/`.
- Each `enonic-<short-name>-skill-update.prompt.md` explicitly targets `skills/enonic-<short-name>/` and requests that full directory name as the PR title slug used by superseding.
- This repository has no marketplace manifest. The release engine updates `.claude-plugin/plugin.json`, `.github/plugin/plugin.json`, and `package.json`.
- Run `weekly-skill-updates.yml` manually after the workflow rename lands to verify the first dispatch.
- The new callers should be merged after the corresponding hub reusable-workflow changes; checks targeting hub `@main` remain blocked until those hub changes are merged.
