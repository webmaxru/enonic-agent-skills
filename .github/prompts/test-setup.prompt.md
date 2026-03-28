---
name: "Test Setup"
description: "Set up the Enonic XP test environment for skill testing. Creates sandbox, scaffolds test project, installs Guillotine, and creates sample content. Run this before test-run."
argument-hint: "Optional: XP version (e.g., 7.16.2) or 'docker' for Docker-based setup"
agent: "agent"
---

Set up the Enonic XP test environment for testing the agent skills in this repository.

## Prerequisites Check

1. Verify Node.js and npm are available: `node --version && npm --version`
2. Verify Java 17+ is available: `java --version`
3. Verify port 8080 is available

## Steps

### 1. Install Enonic CLI (if not present)

```bash
npm install -g @enonic/cli
enonic --version
```

Record the CLI version in `.test-infra/findings.md` under Environment.

### 2. Create Directory Structure

Ensure `.test-infra/projects/`, `.test-infra/output/`, and `.test-infra/changes/` directories exist.

### 3. Create and Start Sandbox

```bash
enonic sandbox create skill-test-sandbox --skip-template -f
enonic sandbox start skill-test-sandbox -d
```

Wait for XP to be accessible at http://localhost:8080. Record the XP version in `.test-infra/findings.md`.

### 4. Scaffold Test Project

```bash
cd .test-infra/projects
enonic create skill-test-app -r starter-vanilla -s skill-test-sandbox -f
```

### 5. Build and Deploy

```bash
cd .test-infra/projects/skill-test-app
enonic project deploy -f
```

Verify the app appears in XP admin at http://localhost:8080/admin.

### 6. Install Guillotine

Install Guillotine from Enonic Market. Use the version compatible with the installed XP version:

```bash
enonic app install --url https://repo.enonic.com/public/com/enonic/app/guillotine/<VERSION>/guillotine-<VERSION>.jar
```

Verify GraphQL endpoint at http://localhost:8080/site/default/draft.

### 7. Create Sample Content

In Content Studio (http://localhost:8080/admin/tool/com.enonic.app.contentstudio/main):

1. Create a site named "test-site" with the test app assigned
2. Create content items:
   - 2-3 folders
   - 3-5 structured content items with different field values
   - At least 1 item with a date field for range query testing
3. Publish 3-4 items to `master` branch
4. Leave 2-3 items in `draft` only

### 8. Verify Environment Health

- [ ] XP admin accessible at http://localhost:8080/admin
- [ ] Content Studio loads and shows the test site
- [ ] Guillotine endpoint responds at http://localhost:8080/site/default/draft
- [ ] Test app is deployed and running

Record all version numbers in `.test-infra/findings.md`.

## Docker Fallback

If the sandbox approach fails, use Docker instead:

```bash
docker run -it --rm -p 8080:8080 enonic/xp:7.16.2-ubuntu
```

Then adapt the subsequent steps to work with the Docker instance.
