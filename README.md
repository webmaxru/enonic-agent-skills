# Enonic XP Agent Skills

A maintained collection of agent skills for [Enonic XP](https://developer.enonic.com/docs) CMS development. These skills cover the core Enonic XP development surface: server-side APIs, content modeling, content migration, Guillotine GraphQL queries, Next.js headless integration, controller generation, webhook/event integrations, and local development environment management.

The repository follows the [agentskills.io](https://agentskills.io) style: lean `SKILL.md` files, progressive disclosure through `references/` and `assets/`, and deterministic helper scripts where guessing would be brittle.

> **Disclaimer:** This project is not affiliated with, endorsed by, or officially connected to [Enonic](https://enonic.com/) in any way. It is an independent community effort.

## Contents

- [Install Skills](#install-skills)
- [Included Skills](#included-skills)
  - [Enonic API Reference Skill](#enonic-api-reference-skill)
  - [Enonic Content Migration Skill](#enonic-content-migration-skill)
  - [Enonic Content Type Generator Skill](#enonic-content-type-generator-skill)
  - [Enonic Guillotine Query Builder Skill](#enonic-guillotine-query-builder-skill)
  - [Enonic Next.XP Integration Skill](#enonic-nextxp-integration-skill)
  - [Enonic Sandbox Manager Skill](#enonic-sandbox-manager-skill)
  - [Enonic Webhook Integrator Skill](#enonic-webhook-integrator-skill)
  - [Enonic XP Controller Generator Skill](#enonic-xp-controller-generator-skill)
- [Repository Conventions](#repository-conventions)
- [Common Workflows](#common-workflows)

## Install Skills

Primary installation path: use [Agent Package Manager (APM)](https://github.com/microsoft/apm), a package manager for agent instructions, prompts, skills, and related configuration.

If the target repository does not already use APM, initialize it first:

```bash
apm init
```

Then install any skill from this repository with the repository and skill placeholders replaced as needed:

```bash
apm install OWNER/REPO/skills/SKILL_NAME
```

Secondary installation path: use the `skills` package from npm for direct per-skill installs.

```bash
npx skills add OWNER/REPO --skill SKILL_NAME
```

For this repository, `OWNER/REPO` is `webmaxru/enonic-agent-skills`. The concrete install commands for each available skill are listed in the relevant skill sections below.

For example, the Enonic API Reference skill installs with:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-api-reference
```

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-api-reference
```

## Included Skills

### Enonic API Reference Skill

`skills/enonic-api-reference` provides a server-side JavaScript/TypeScript API reference for all `/lib/xp/*` libraries. It covers function signatures, parameters, return types, and usage examples for lib-content, lib-node, lib-auth, lib-portal, lib-context, lib-event, lib-task, lib-repo, lib-io, lib-mail, and lib-schema.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-api-reference
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-api-reference
```

It covers:

- looking up Enonic XP library functions, parameter shapes, and return types
- mapping queries to the correct reference file for each `/lib/xp/*` library
- composing cross-library usage patterns (e.g., creating content as admin)
- generating reusable import blocks from the provided template
- troubleshooting common API errors and version mismatches

Its support files are split by purpose:

- `references/lib-content-reference.md` for lib-content function signatures and usage
- `references/lib-node-reference.md` for lib-node function signatures and usage
- `references/lib-auth-reference.md` for lib-auth function signatures and usage
- `references/lib-portal-reference.md` for lib-portal function signatures and usage
- `references/lib-context-reference.md` for lib-context, lib-event, and lib-task functions
- `references/lib-utilities-reference.md` for lib-io, lib-mail, lib-repo, and lib-schema functions
- `references/examples.md` for cross-library usage patterns
- `references/troubleshooting.md` for common errors and version-compatibility notes
- `assets/enonic-imports.template.ts` for a reusable import block template

### Enonic Content Migration Skill

`skills/enonic-content-migration` generates Enonic XP scripts for bulk content operations — creating, updating, querying, migrating, and transforming content using lib-content and lib-node APIs.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-content-migration
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-content-migration
```

It covers:

- bulk content creation, update, and deletion scripts
- querying with NoQL syntax, aggregations, and paginated retrieval
- migrating content between environments using branch operations
- wrapping long-running operations in task controllers with progress reporting
- batch processing with configurable batch sizes and error tracking

Its support files are split by purpose:

- `references/migration-reference.md` for query DSL patterns, batch processing strategies, and branch handling rules
- `references/examples.md` for complete query and aggregation patterns
- `references/compatibility.md` for version-specific API differences
- `references/troubleshooting.md` for duplicate handling, timeout, and permission issues
- `assets/bulk-update.template.ts` for a reusable batch update controller template
- `assets/task-migration.template.ts` for a reusable task controller template with progress reporting
- `scripts/find-enonic-targets.mjs` for deterministic scanning of Enonic XP project markers

### Enonic Content Type Generator Skill

`skills/enonic-content-type-generator` generates Enonic XP content type XML schema definitions from natural-language descriptions. It covers structured content modeling including input types, form layout, option sets, item sets, mixins, x-data, and content-type inheritance.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-content-type-generator
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-content-type-generator
```

It covers:

- creating content type XML schemas from natural-language field descriptions
- mapping field descriptions to correct Enonic XP input types and configurations
- generating mixins, x-data, item sets, and option sets
- validating output XML for well-formedness and correct input type usage
- scaffolding the correct directory structure under `site/content-types/`

Its support files are split by purpose:

- `references/content-type-reference.md` for input types, super-types, and schema structure
- `references/examples.md` for complete content type definition patterns
- `references/troubleshooting.md` for XML validation errors and input type mismatches
- `assets/content-type.template.xml` for a starter content type template
- `scripts/find-enonic-targets.mjs` for deterministic scanning of Enonic XP project markers

### Enonic Guillotine Query Builder Skill

`skills/enonic-guillotine-query-builder` composes, debugs, and optimizes Guillotine GraphQL queries for Enonic XP headless content delivery.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-guillotine-query-builder
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-guillotine-query-builder
```

It covers:

- constructing GraphQL queries using Query DSL input types
- building content type fragments with inline fragment type-name deriving
- filtering, sorting, pagination, aggregations, and highlighting
- migrating from deprecated 5.x string-based queries to 6.x+ DSL syntax
- generating TypeScript types from Guillotine query responses

Its support files are split by purpose:

- `references/guillotine-reference.md` for the Guillotine API surface and query patterns
- `references/examples.md` for complete query construction patterns
- `references/compatibility.md` for version migration and breaking changes
- `references/troubleshooting.md` for null results, type errors, and deprecated API usage
- `assets/guillotine-query.template.ts` for a reusable typed query template
- `scripts/find-guillotine-targets.mjs` for deterministic scanning of Guillotine markers in the workspace

### Enonic Next.XP Integration Skill

`skills/enonic-nextxp-integration` guides setup, development, and troubleshooting of the Next.js and Enonic XP headless integration (Next.XP framework).

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-nextxp-integration
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-nextxp-integration
```

It covers:

- configuring the `@enonic/nextjs-adapter` package and environment variables
- mapping Enonic content types to React components via `ComponentRegistry`
- wiring Guillotine GraphQL data fetching in Next.js with typed queries
- enabling Content Studio preview mode with draft/master branch switching
- deploying Enonic + Next.js to production (Enonic Cloud + Vercel)

Its support files are split by purpose:

- `references/nextxp-reference.md` for adapter configuration, component registry API, and deployment checklist
- `references/examples.md` for complete content type mapping examples including queries, views, and processors
- `references/compatibility.md` for version requirements between the adapter, Next.js, and Enonic XP
- `references/troubleshooting.md` for preview failures, blank pages, and configuration issues
- `assets/nextxp-page.template.tsx` for a reusable page component template

### Enonic Sandbox Manager Skill

`skills/enonic-sandbox-manager` guides developers through Enonic CLI commands for sandbox management, project scaffolding, local development, app deployment, and CI/CD pipeline generation.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-sandbox-manager
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-sandbox-manager
```

It covers:

- creating, starting, stopping, upgrading, and deleting Enonic XP sandboxes
- scaffolding new projects from starters (`starter-vanilla`, `starter-headless`, `starter-nextjs`)
- running dev mode with hot-reload, building, deploying, and testing Enonic apps
- managing applications on running XP instances
- generating GitHub Actions CI/CD workflows for Enonic projects

Its support files are split by purpose:

- `references/cli-reference.md` for the full Enonic CLI command catalog
- `references/examples.md` for common CLI workflow patterns
- `references/compatibility.md` for CLI-to-XP version compatibility
- `references/troubleshooting.md` for sandbox startup failures, port conflicts, and deployment issues
- `assets/enonic-ci.template.yml` for a GitHub Actions CI/CD workflow template
- `assets/sandbox-setup.template.sh` for a sandbox setup script template
- `scripts/find-enonic-targets.mjs` for deterministic scanning of Enonic XP project markers

### Enonic Webhook Integrator Skill

`skills/enonic-webhook-integrator` sets up Enonic XP event listeners, webhook configurations, and external system integrations triggered by content lifecycle events.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-webhook-integrator
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-webhook-integrator
```

It covers:

- registering event listeners for content publish, create, update, and delete events
- configuring outbound webhooks via `com.enonic.xp.webhooks.cfg`
- building HTTP service controllers for inbound webhook endpoints
- wiring async processing with lib-task for heavy or long-running event handlers
- calling external systems with lib-httpClient from event callbacks

Its support files are split by purpose:

- `references/event-reference.md` for event types, listener patterns, and task event lifecycle
- `references/webhook-reference.md` for outbound webhook configuration and inbound service endpoints
- `references/examples.md` for CDN invalidation, search reindexing, and notification patterns
- `references/troubleshooting.md` for event non-firing, webhook delivery failures, and 404 service errors
- `assets/event-listener.template.ts` for a reusable event listener scaffold
- `assets/http-service.template.ts` for a reusable inbound webhook service scaffold
- `scripts/find-enonic-targets.mjs` for deterministic scanning of Enonic XP project markers

### Enonic XP Controller Generator Skill

`skills/enonic-xp-controller-generator` generates Enonic XP controller files (TypeScript/JavaScript) and paired XML descriptors for pages, parts, and layouts.

Install with APM:

```bash
apm install webmaxru/enonic-agent-skills/skills/enonic-xp-controller-generator
```

Install with npm:

```bash
npx skills add webmaxru/enonic-agent-skills --skill enonic-xp-controller-generator
```

It covers:

- scaffolding page controllers with regions, part controllers with config access, and layout controllers with multi-region support
- generating paired XML descriptors with display names, forms, and region definitions
- generating Thymeleaf or Mustache view templates with proper region wiring
- creating response processors for site-level HTTP response modification
- updating `build.gradle` with required library dependencies

Its support files are split by purpose:

- `references/controller-reference.md` for XML descriptor schema and Portal API surface
- `references/examples.md` for known-good controller patterns
- `references/compatibility.md` for TypeScript vs JavaScript differences
- `references/troubleshooting.md` for descriptor mismatches and rendering issues
- `assets/page-controller.template.ts` for a reusable page controller template
- `assets/part-controller.template.ts` for a reusable part controller template
- `assets/layout-controller.template.ts` for a reusable layout controller template
- `scripts/find-enonic-targets.mjs` for deterministic scanning of Enonic XP project markers

## Repository Conventions

When adding or revising a skill here, keep these rules intact:

1. The skill directory name must match the YAML `name` exactly.
2. Skill descriptions should be precise enough to route correctly and include both positive and negative triggers.
3. `SKILL.md` should stay lean, procedural, and agent-oriented.
4. Large examples, verbose rules, and schemas belong in `references/` or `assets/`.
5. File paths inside skills should stay relative and use forward slashes.
6. Skill folders should remain flat under `scripts/`, `references/`, and `assets/`.
7. Human-oriented files such as per-skill `README.md` or `CHANGELOG.md` should not be added inside skill directories.

## Common Workflows

### Scan a Workspace for Enonic XP Targets

```bash
node skills/enonic-content-migration/scripts/find-enonic-targets.mjs .
```

The scanner locates Enonic XP project markers: `build.gradle` with `com.enonic.xp` dependencies, `src/main/resources/` directory structure, and `gradle.properties` with `xpVersion`.

### Scan a Workspace for Guillotine Targets

```bash
node skills/enonic-guillotine-query-builder/scripts/find-guillotine-targets.mjs .
```

The scanner inventories files containing Guillotine markers such as query strings, library imports, `queryDsl`, `queryDslConnection`, and `/lib/guillotine` references.

## References

- Enonic XP documentation: https://developer.enonic.com/docs
- agentskills.io best practices: https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices

