# Testing Guide for Enonic XP Agent Skills

This document describes how to set up, run, and interpret the test suite for the agent skills in this repository. The tests validate scripts, templates, skill procedures, reference accuracy, and cross-skill consistency against a live Enonic XP instance.

## Prerequisites

- **Node.js** 22+ and **npm** (for Enonic CLI and running scanner scripts)
- **Docker** (for running Enonic XP — no local Java required)
- **Enonic CLI** (`npm install -g @enonic/cli`) — for sandbox metadata commands
- Ports **8080** (XP HTTP) available on localhost
- ~2 GB free disk space for Docker image and test projects

> **Note:** Local Java is NOT required. All builds use a Docker-based Gradle container.

## Quick Start

Use the saved prompts in `.github/prompts/` for a prompt-driven workflow:

1. **Setup:** Run the `test-setup` prompt to create the full test environment
2. **Test:** Run the `test-run` prompt to execute all test phases
3. **Cleanup:** Run the `test-teardown` prompt when you want to remove the environment

## Directory Structure

All test infrastructure lives in `.test-infra/` (gitignored):

```
.test-infra/
  projects/          # Scaffolded Enonic XP and Next.js test projects
  output/            # Test run logs per phase
  changes/           # Per-skill change documents (proposed fixes when issues found)
  findings.md        # Consolidated test findings
```

## Docker-Based Setup

### 1. Start Enonic XP

```bash
docker run -d --name enonic-xp-test -p 8080:8080 enonic/xp:7.16.2-ubuntu
```

Wait ~30 seconds for XP to start, then verify at http://localhost:8080.

### 2. Create Admin User

POST to `http://localhost:8080/admin/tool/_/idprovider/system`:

```json
{"action":"createAdminUser","user":"admin","email":"admin@test.local","password":"Admin12345!"}
```

### 3. Authenticate

POST to the same URL to get a session cookie:

```json
{"action":"login","user":"admin","password":"Admin12345!"}
```

Save the `JSESSIONID` cookie for subsequent authenticated requests.

### 4. Install Enonic CLI

```bash
npm install -g @enonic/cli
enonic --version   # verify installation (v3.4.0+)
```

### 5. Scaffold Test Project

```bash
mkdir -p .test-infra/projects .test-infra/output .test-infra/changes
cd .test-infra/projects
enonic create myproject -r starter-vanilla --skip-start -f
```

### 6. Build Without Local Java

Use a Docker Gradle container to build the Enonic app:

```bash
docker run --rm -v "<absolute-path-to-project>:/project" -w /project gradle:8.5-jdk17 gradle build --no-daemon
```

> **Windows note:** Docker volume mounts may prevent `.gradle` directory creation. Workaround: copy the project into the container filesystem, build there, and copy the JAR back.

### 7. Deploy to XP

```bash
docker cp .test-infra/projects/myproject/build/libs/myproject.jar enonic-xp-test:/enonic-xp/home/deploy/
```

### 8. Install Guillotine

Download and deploy the Guillotine JAR:

```bash
# Download from Enonic Maven repo
curl -o guillotine.jar "https://repo.enonic.com/public/com/enonic/app/guillotine/7.0.2/guillotine-7.0.2.jar"
docker cp guillotine.jar enonic-xp-test:/enonic-xp/home/deploy/
```

### 9. Create Sample Content

Use authenticated API calls or Content Studio at `http://localhost:8080/admin/tool/com.enonic.app.contentstudio/main`:

1. Create a site named "test-site" with the test app and Guillotine assigned
2. Create 5 articles under `test-site/articles/`
3. Publish items to `master` branch

### 10. Verify Guillotine Endpoint

The Guillotine GraphQL endpoint is at:

```
http://localhost:8080/admin/site/preview/default/draft
```

Requires the authenticated session cookie. Send a test query:

```json
{"query": "{ guillotine { queryDsl(query: {matchAll: {}}, first: 5) { displayName _path } } }"}
```

## Test Phases

### Phase 1: Script Testing

Run the scanner scripts against the test project:

```bash
# From repo root — test all 5 variants of find-enonic-targets.mjs
node skills/enonic-content-migration/scripts/find-enonic-targets.mjs .test-infra/projects/myproject
node skills/enonic-webhook-integrator/scripts/find-enonic-targets.mjs .test-infra/projects/myproject
node skills/enonic-content-type-generator/scripts/find-enonic-targets.mjs .test-infra/projects/myproject
node skills/enonic-sandbox-manager/scripts/find-enonic-targets.mjs .test-infra/projects/myproject
node skills/enonic-controller-generator/scripts/find-enonic-targets.mjs .test-infra/projects/myproject

# Test Guillotine scanner
node skills/enonic-guillotine-query-builder/scripts/find-guillotine-targets.mjs .test-infra/projects/myproject
```

Also test against empty directories and the repo root for negative cases.

### Phase 2: Template Validation

For each template file in `skills/*/assets/`, replace placeholders with realistic values and validate syntax (TypeScript, XML, YAML, shell).

### Phase 3: Skill Functional Testing

Follow each skill's SKILL.md procedures step-by-step against the running Docker XP instance. Test all 8 skills. When issues are found, create change documents in `.test-infra/changes/<skill-name>.md`.

### Phase 4: Reference & Cross-Skill Validation

Compare reference files against official Enonic docs at https://developer.enonic.com/docs. Check cross-skill consistency (import paths, API signatures, version references).

## Interpreting Results

- **Test logs:** `.test-infra/output/phase<N>-*.log`
- **Findings summary:** `.test-infra/findings.md`
- **Per-skill proposed changes:** `.test-infra/changes/<skill-name>.md`
  - Priority levels: critical (skill broken), warning (misleading), info (minor improvement)

## Test Results Summary (2026-03-28)

| Phase | Pass | Fail | Rate |
|-------|------|------|------|
| 1 — Scripts | 17 | 1 | 94% |
| 2 — Templates | 12 | 1 | 92% |
| 3 — Functional | 8/8 skills functional | 12 issues | — |
| 4 — Consistency | 10 | 4 FAIL + 4 WARN | 56% |

**Key findings:**
- 3 critical issues: `aggregationsAsJson` typo in guillotine skill (singular vs plural)
- 3 high issues: nextxp-integration missing script and outdated compatibility matrix
- All 8 skills produce correct output when procedures are followed
- Cross-skill consistency is good for API patterns, weak for script interfaces

See `.test-infra/findings.md` for the full consolidated report.

## Cleanup

Use the `test-teardown` saved prompt, or manually:

```bash
docker stop enonic-xp-test && docker rm enonic-xp-test
# .test-infra/ is gitignored — delete contents if desired
```
