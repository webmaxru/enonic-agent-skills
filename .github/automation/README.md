# Automation

This repository calls the shared workflows maintained by [webmaxru/ai-native-dev](https://github.com/webmaxru/ai-native-dev/tree/main/.github/automation). See the hub's [release guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/release.md) and [weekly update guide](https://github.com/webmaxru/ai-native-dev/blob/main/.github/automation/weekly-updates.md) for workflow behavior and operations.

## Repository settings

- `AUTO_SHIP`: set to `false` to disable review-approved skill-update merges; enabled when unset.
- `AUTO_RELEASE`: set to `false` to disable push and scheduled releases; manual dispatch remains available. Enabled when unset.
- `COPILOT_GITHUB_TOKEN`: required by the shared GH-AW worker. The caller currently uses `secrets: inherit`; cross-repository secret availability must be confirmed by a real run.
- `GH_AW_MODEL_AGENT_COPILOT`: currently set to `claude-opus-4.6` for the legacy local worker; retain until the shared worker's model behavior is verified.

## Enonic-specific notes

- The weekly workflow runs Mondays at 09:00 UTC and selects saved prompts under `.github/prompts/`.
- Each `enonic-<short-name>-skill-update.prompt.md` explicitly targets `skills/enonic-<short-name>/` and requests that full directory name as the PR title slug used by superseding.
- This repository has no marketplace manifest. The release engine updates `.claude-plugin/plugin.json`, `.github/plugin/plugin.json`, and `package.json`.
- Run `weekly-skill-updates.yml` manually after the workflow rename lands to verify the first dispatch.
- The new callers should be merged after the corresponding hub reusable-workflow changes; checks targeting hub `@main` remain blocked until those hub changes are merged.
