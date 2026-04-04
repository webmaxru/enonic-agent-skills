---
name: "Test Run"
description: "Execute the full test suite for Enonic XP agent skills against a Docker-based test environment. Covers script testing, template validation, functional skill testing, and reference accuracy checks."
argument-hint: "Optional scope: 'all' (default), 'scripts', 'templates', 'skills', 'references', or a specific skill name like 'enonic-sandbox-manager'"
agent: "agent"
---

Execute the test suite for the agent skills in this repository. The test environment must already be set up (use the `test-setup` prompt first).

Read [TESTING.md](../../TESTING.md) for the full testing guide and [findings](../../.test-infra/findings.md) for current environment details.

All test output goes to `.test-infra/output/`. All findings go to `.test-infra/findings.md`. When a skill doesn't work properly, create a change document at `.test-infra/changes/<skill-name>.md`.

## Authentication

All authenticated requests to XP require a session cookie obtained by:

```
POST http://localhost:8080/admin/tool/_/idprovider/system
Content-Type: application/json

{"action":"login","user":"admin","password":"Admin12345!"}
```

Save the `JSESSIONID` cookie and include it in subsequent requests.

## Phase 1: Script Testing

Test the deterministic scanner scripts against the test project at `.test-infra/projects/myproject/`.

### 1a. Test find-enonic-targets.mjs (all 5 variants)

For each variant in these skills: `enonic-content-migration`, `enonic-webhook-integrator`, `enonic-content-type-generator`, `enonic-sandbox-manager`, `enonic-controller-generator`:

1. Run against `.test-infra/projects/myproject/` → should detect project markers
2. Run against `.test-infra/output/` (no Enonic markers) → should return empty or exit code 1
3. Run against repo root `.` → should return empty/no project
4. Validate JSON output is well-formed
5. Validate detected XP version and app name are correct

### 1b. Test find-guillotine-targets.mjs

1. Run against `.test-infra/projects/myproject/` → check Guillotine marker detection
2. Run against the skills repo root → should find markers in template files

Log all results to `.test-infra/output/phase1-scripts.log`.

## Phase 2: Template Validation

For each template in `skills/*/assets/`:

1. Read the template file
2. Replace documented placeholders with realistic values
3. Validate syntax:
   - `.template.ts` → TypeScript brace/import syntax check
   - `.template.xml` → XML well-formedness
   - `.template.tsx` → TSX syntax check
   - `.template.yml` → YAML syntax validation
   - `.template.sh` → `bash -n` syntax check (ensure LF line endings first)

Log results to `.test-infra/output/phase2-templates.log`.

## Phase 3: Skill Functional Testing

Follow each skill's SKILL.md procedures step-by-step against the running Docker XP instance. Test all 8 skills.

### Building apps for deployment

Use Docker-based Gradle (no local Java required):

```bash
docker run --rm --network=host -v "<project-path>:/project" -w /project gradle:8.5-jdk17 gradle build --no-daemon
docker cp <project>/build/libs/<app>.jar enonic-xp-test:/enonic-xp/home/deploy/
```

### Guillotine GraphQL endpoint

```
POST http://localhost:8080/admin/site/preview/default/draft
Cookie: JSESSIONID=<session-cookie>
Content-Type: application/json
```

### Redeployment note

When redeploying an updated JAR, remove the old JAR first to avoid class cache issues:

```bash
docker exec enonic-xp-test rm /enonic-xp/home/deploy/<app>.jar
# Wait 5 seconds for XP to unload
docker cp <new-app>.jar enonic-xp-test:/enonic-xp/home/deploy/
```

### 3.1 enonic-sandbox-manager
- Detect workspace context, test CLI commands, validate CI template, check reference accuracy

### 3.2 enonic-content-type-generator
- Generate a "blog-post" content type with 6+ fields
- Write XML, validate, build, deploy, verify in XP and via Guillotine introspection

### 3.3 enonic-controller-generator
- Generate page "main-page", part "hero-banner", layout "two-column"
- Generate XML + TS + HTML for each, build, deploy, verify in XP

### 3.4 enonic-api-reference
- Verify 9+ API functions across lib-content, lib-node, lib-auth, lib-portal, lib-context
- Compare signatures, return types, examples against official docs
- Validate import template paths, troubleshooting scenarios, code examples

### 3.5 enonic-content-migration
- Create migration service using bulk-update template pattern
- Execute NoQL queries, batch modify with editor callback, publish to master
- Verify data integrity in both draft and master branches

### 3.6 enonic-guillotine-query-builder (after 3.2)
- Test queryDsl, queryDslConnection, get queries
- Test pagination with cursors, aggregations with `aggregationsAsJson`
- Test introspection and type-name derivation

### 3.7 enonic-webhook-integrator
- Create event listener for node.pushed events
- Create inbound HTTP service controller
- Deploy, test outbound events on publish, test inbound POST/error cases

### 3.8 enonic-nextxp-integration (after 3.2)
- Scaffold Next.js app, install @enonic/nextjs-adapter (pin version!)
- Configure env, map content types, build, validate reference accuracy

Log each skill's results to `.test-infra/output/phase3-<skill-name>.log`.

**When a skill doesn't work properly:** Create `.test-infra/changes/<skill-name>.md` with:
- What was tested and what failed
- Root cause analysis
- Proposed changes to specific files with clear descriptions
- Priority: critical / warning / info

## Phase 4: Reference & Cross-Skill Validation

### 4.1 Reference Doc Accuracy
Compare key claims in reference files against official Enonic docs at https://developer.enonic.com/docs. Check function signatures, parameter lists, and version-specific notes.

### 4.2 Cross-Skill Consistency
- All `find-enonic-targets.mjs` variants agree on project detection
- Content type names from generator match Guillotine type-name derivation
- API reference signatures match template import patterns
- Import paths consistent across all skills (`/lib/xp/*`)

### 4.3 Compatibility Doc Validation
- Version ranges in each `compatibility.md` are current
- Deprecated APIs in troubleshooting docs are actually deprecated
- Node.js/CLI version requirements documented

Log to `.test-infra/output/phase4-consistency.log`. Add issues to relevant `.test-infra/changes/<skill-name>.md`.

## Phase 5: Consolidate Findings

After all phases complete:
1. Update `.test-infra/findings.md` with a consolidated summary
2. Review all `.test-infra/changes/` docs for completeness
3. Update `TESTING.md` with any corrections discovered
4. Commit documentation updates to Git
