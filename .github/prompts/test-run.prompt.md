---
name: "Test Run"
description: "Execute the full test suite for Enonic XP agent skills against an already-running test environment. Covers script testing, template validation, functional skill testing, and reference accuracy checks."
argument-hint: "Optional scope: 'all' (default), 'scripts', 'templates', 'skills', 'references', or a specific skill name like 'enonic-sandbox-manager'"
agent: "agent"
---

Execute the test suite for the agent skills in this repository. The test environment must already be set up (use the `test-setup` prompt first).

Read [TESTING.md](../../TESTING.md) for the full testing guide and [the plan](../../.test-infra/findings.md) for current environment details.

All test output goes to `.test-infra/output/`. All findings go to `.test-infra/findings.md`. When a skill doesn't work properly, create a change document at `.test-infra/changes/<skill-name>.md`.

## Phase 1: Script Testing

Test the deterministic scanner scripts against the test project at `.test-infra/projects/skill-test-app/`.

### 1a. Test find-enonic-targets.mjs (all 5 variants)

For each variant in these skills: `enonic-content-migration`, `enonic-webhook-integrator`, `enonic-content-type-generator`, `enonic-sandbox-manager`, `enonic-controller-generator`:

1. Run against `.test-infra/projects/skill-test-app/` → should detect project markers
2. Run against `.test-infra/output/` (no Enonic markers) → should return empty or exit code 1
3. Validate JSON output is well-formed
4. Validate detected XP version and app name are correct

### 1b. Test find-guillotine-targets.mjs

1. Run against `.test-infra/projects/skill-test-app/` → check Guillotine marker detection
2. Create a temporary `.ts` file with Guillotine imports → verify detection
3. Run against the skills repo root → should find markers in template files

Log all results to `.test-infra/output/phase1-scripts.log`.

## Phase 2: Template Validation

For each template in `skills/*/assets/`:

1. Read the template file
2. Replace documented placeholders with realistic values
3. Validate syntax:
   - `.template.ts` → TypeScript syntax check (use `// @ts-nocheck` for missing Enonic types)
   - `.template.xml` → XML well-formedness
   - `.template.tsx` → TSX syntax check
   - `.template.yml` → YAML syntax validation
   - `.template.sh` → `bash -n` syntax check

Log results to `.test-infra/output/phase2-templates.log`.

## Phase 3: Skill Functional Testing

Follow each skill's SKILL.md procedures step-by-step against the running sandbox. Test all 8 skills:

### 3.1 enonic-sandbox-manager
- Detect workspace context, test sandbox CRUD, scaffold a headless project in `.test-infra/projects/`, build, validate CI template

### 3.2 enonic-content-type-generator
- Generate a "blog-post" content type with 6+ fields (TextLine, HtmlArea, ContentSelector, Date, Tag, CheckBox)
- Write XML, validate, build, deploy, verify in Content Studio

### 3.3 enonic-controller-generator
- Generate page controller "main-page" with region, part "hero-banner" with config, layout "two-column" with 2 regions
- Generate XML + TS + HTML for each, build, deploy

### 3.4 enonic-api-reference
- Look up 5+ API functions across different lib-* libraries
- Verify signatures, return types, examples match running XP version
- Test one cross-library pattern from examples.md

### 3.5 enonic-content-migration
- Bulk-create 20 items, modify with editor callback, publish to master
- Test aggregation query, batch delete, task controller with progress

### 3.6 enonic-guillotine-query-builder (after 3.2)
- Build get/queryDsl/queryDslConnection queries, test pagination/aggregations
- Build inline fragment for the blog-post content type
- Generate TypeScript types, test error cases

### 3.7 enonic-webhook-integrator
- Create event listener for node.pushed, create inbound HTTP service
- Deploy, test outbound events on publish, test inbound POST

### 3.8 enonic-nextxp-integration (after 3.2)
- Scaffold Next.js app in `.test-infra/projects/`, install adapter
- Configure env, map content types, build, test rendering

Log each skill's results to `.test-infra/output/phase3-<skill-name>.log`.

**When a skill doesn't work properly:** Create `.test-infra/changes/<skill-name>.md` with:
- What was tested and what failed
- Root cause analysis
- Proposed changes to specific files with clear descriptions
- Priority: critical / warning / info

## Phase 4: Reference & Cross-Skill Validation

### 4.1 Reference Doc Accuracy
Compare key claims in reference files against official Enonic docs at https://developer.enonic.com/docs. Check function signatures, parameter lists, and version-specific notes for all 14 reference files listed in TESTING.md.

### 4.2 Cross-Skill Consistency
- All `find-enonic-targets.mjs` variants agree on project detection
- Content type names from generator match Guillotine type-name derivation
- API reference signatures match template import patterns
- CLI commands in sandbox-manager match actual CLI behavior

### 4.3 Compatibility Doc Validation
- Version ranges in each `compatibility.md` are current
- Deprecated APIs in troubleshooting docs are actually deprecated

Log to `.test-infra/output/phase4-*.log`. Add issues to relevant `.test-infra/changes/<skill-name>.md`.

## Finalize

After all phases complete:
1. Update `.test-infra/findings.md` with a summary
2. Review all `.test-infra/changes/` docs for completeness
3. Update `TESTING.md` with any corrections discovered
4. Update the saved prompts (`test-setup`, `test-run`, `test-teardown`) if any instructions need correction
