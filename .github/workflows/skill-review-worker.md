---
on:
  workflow_call:
    inputs:
      skill-name:
        type: string
        required: true
        description: Name of the skill directory under skills/ to review
concurrency:
  group: skill-review-${{ inputs.skill-name }}
  cancel-in-progress: false
permissions:
  actions: read
  contents: read
  pull-requests: read
engine: copilot
tools:
  web-fetch:
  edit:
  bash:
    - node
    - git
safe-outputs:
  create-pull-request:
    title-prefix: "docs: "
    draft: true
    if-no-changes: warn
    fallback-as-issue: false
  noop:
    report-as-issue: false
network:
  allowed:
    - defaults
    - "developer.enonic.com"
strict: true
timeout-minutes: 30
---

# Enonic Skill Review Worker

Review the agent skill in `skills/${{ inputs.skill-name }}/` against the latest official Enonic XP documentation and propose improvements via a pull request.

## Context

- **Skill directory**: `skills/${{ inputs.skill-name }}/`
- **Documentation root**: https://developer.enonic.com/docs
- **Repository conventions**: Skills follow the agentskills.io style — lean `SKILL.md`, progressive disclosure through `references/` and `assets/`, deterministic helper scripts under `scripts/`.

## Process

1. Read every file in `skills/${{ inputs.skill-name }}/`, including `SKILL.md`, and all files under `references/`, `assets/`, and `scripts/`. Build a complete picture of what the skill currently covers.

2. Fetch the relevant sections of the Enonic developer documentation from https://developer.enonic.com/docs. Navigate to the pages that match the skill's domain:
   - **enonic-api-reference**: XP Framework library APIs (`/lib/xp/*`), function signatures, parameters, return types.
   - **enonic-content-type-generator**: Content type schemas, XML schema definitions, input types, mixins.
   - **enonic-content-migration**: Node API, content API, data import/export, task API for batch operations.
   - **enonic-controller-generator**: HTTP controllers for pages, parts, layouts; request/response handling.
   - **enonic-guillotine-query-builder**: Guillotine GraphQL API, HeadlessCMS queries, schema introspection.
   - **enonic-nextxp-integration**: Next.js integration with Enonic XP, front-end rendering, component mapping.
   - **enonic-sandbox-manager**: Enonic CLI commands, sandbox lifecycle, development environment setup.
   - **enonic-webhook-integrator**: Event listeners, HTTP services, webhook patterns, event types.

3. Compare the skill's content against the fetched documentation. Identify:
   - **New APIs, parameters, or features** added to Enonic XP that the skill does not yet cover.
   - **Deprecated or removed APIs** still referenced in the skill files.
   - **Changed behavior, defaults, or signatures** not reflected in the skill.
   - **Missing examples** that the official docs now provide and would be valuable for agent consumers.
   - **Incorrect or outdated code patterns** in templates or reference files.
   - **New best practices or patterns** documented officially that the skill should incorporate.

4. If meaningful improvements are identified, apply them:
   - Edit only the files within `skills/${{ inputs.skill-name }}/`.
   - Keep changes minimal and directly justified by the official documentation.
   - Preserve the existing skill structure, formatting style, and naming conventions.
   - Keep `SKILL.md` lean and procedural. Move bulky rules, examples, or templates into `references/` or `assets/`.
   - Use relative paths with forward slashes in all skill files.
   - Do not add `README.md`, `CHANGELOG.md`, or any per-skill documentation files.
   - Do not rename the skill folder or change the YAML `name` field in `SKILL.md` frontmatter.
   - Do not modify files outside `skills/${{ inputs.skill-name }}/`.

5. Create a pull request with:
   - **Title**: `docs: update ${{ inputs.skill-name }} from latest Enonic docs`
   - **Body**: A structured summary with sections for each changed file, listing what was updated and the documentation URL that motivated the change. Include a "Checked but unchanged" section listing files that were reviewed and found to be current.
   - **Branch**: Uses the `skill-update/` prefix automatically.

## Constraints

- Every change must be traceable to an official Enonic documentation source at https://developer.enonic.com/docs. Do not invent API changes or speculate about undocumented behavior.
- Do not restructure the skill layout unless the official docs reveal a fundamental API redesign that makes the current structure misleading.
- Do not expand the skill's scope beyond its declared domain in the `description` field.
- Do not add type annotations, comments, or documentation to code you did not otherwise change.
- If a documentation page is unreachable or returns an error, note the URL in the PR body and skip that source rather than guessing its content.

## No-Action Policy

If the skill is already fully aligned with the latest Enonic documentation, call `noop` with:
- A brief statement of what documentation pages were checked.
- Confirmation that no actionable differences were found.
