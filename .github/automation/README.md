# Automation

This repository calls the shared workflows maintained by [webmaxru/ai-native-dev](https://github.com/webmaxru/ai-native-dev/tree/main/.github/automation). See the hub's [release guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/release.md) and [weekly update guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/weekly-updates.md) for workflow behavior and operations.

## Repository settings

- `AUTO_SHIP`: set to `false` to disable review-approved skill-update merges; enabled when unset.
- `AUTO_RELEASE`: set to `false` to disable push, scheduled, and automatic post-ship releases; a manually dispatched release remains available. Enabled when unset.
- `COPILOT_GITHUB_TOKEN`: required by the shared worker and passed explicitly by the weekly caller.
- `GH_AW_MODEL_AGENT_COPILOT`: set to `auto` rather than pinning a retired model.

## Enonic-specific notes

- The weekly workflow runs Mondays at 09:00 UTC and selects saved prompts under `.github/prompts/`.
- Each `enonic-<short-name>-skill-update.prompt.md` explicitly targets `skills/enonic-<short-name>/` and requests that full directory name as the PR title slug used by superseding.
- This repository has no marketplace manifest. The release engine updates `.claude-plugin/plugin.json`, `.github/plugin/plugin.json`, and `package.json`.
- The callers use the hub's `main` branch for both the reusable workflows and their tooling. To check a single skill between scheduled runs, dispatch `weekly-skill-updates.yml` with its `prompt_path`.
