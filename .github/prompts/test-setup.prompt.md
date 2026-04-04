---
name: "Test Setup"
description: "Set up the Docker-based Enonic XP test environment for skill testing. Creates container, scaffolds test project, installs Guillotine, and creates sample content."
argument-hint: "Optional: XP version (default 7.16.2)"
agent: "agent"
---

Set up the Enonic XP test environment for testing the agent skills in this repository.

## Prerequisites Check

1. Verify Node.js 22+ and npm are available: `node --version && npm --version`
2. Verify Docker is available: `docker --version`
3. Verify port 8080 is available

> **No local Java required.** All builds use Docker-based Gradle containers.

## Steps

### 1. Install Enonic CLI (if not present)

```bash
npm install -g @enonic/cli
enonic --version   # expect 3.4.0+
```

### 2. Create Directory Structure

```bash
mkdir -p .test-infra/projects .test-infra/output .test-infra/changes
```

### 3. Start Enonic XP via Docker

```bash
docker run -d --name enonic-xp-test -p 8080:8080 enonic/xp:7.16.2-ubuntu
```

Wait ~30 seconds for XP to start. Verify at http://localhost:8080.

### 4. Create Admin User

POST to `http://localhost:8080/admin/tool/_/idprovider/system`:

```json
{"action":"createAdminUser","user":"admin","email":"admin@test.local","password":"Admin12345!"}
```

### 5. Authenticate

POST to the same URL:

```json
{"action":"login","user":"admin","password":"Admin12345!"}
```

Save the `JSESSIONID` cookie from the response for authenticated requests.

### 6. Scaffold Test Project

```bash
cd .test-infra/projects
enonic create myproject -r starter-vanilla --skip-start -f
```

### 7. Build Without Local Java

```bash
docker run --rm -v "<absolute-path-to-myproject>:/project" -w /project gradle:8.5-jdk17 gradle build --no-daemon
```

**Windows note:** If Docker volume mount prevents `.gradle` creation, copy project into the container, build, and copy JAR back:

```bash
docker cp .test-infra/projects/myproject enonic-xp-test:/build-project
docker exec enonic-xp-test bash -c "cd /build-project && ./gradlew build --no-daemon"
docker cp enonic-xp-test:/build-project/build/libs/myproject.jar .test-infra/projects/myproject/build/libs/
```

### 8. Deploy to XP

```bash
docker cp .test-infra/projects/myproject/build/libs/myproject.jar enonic-xp-test:/enonic-xp/home/deploy/
```

Verify in XP logs: `docker logs enonic-xp-test --tail 20`

### 9. Install Guillotine

```bash
curl -o .test-infra/guillotine.jar "https://repo.enonic.com/public/com/enonic/app/guillotine/7.0.2/guillotine-7.0.2.jar"
docker cp .test-infra/guillotine.jar enonic-xp-test:/enonic-xp/home/deploy/
```

### 10. Create Sample Content

Using authenticated API calls to XP:
1. Create a site named "test-site" with the test app and Guillotine assigned
2. Create an "articles" folder under the site
3. Create 5 articles under `test-site/articles/`
4. Publish all items to `master` branch

### 11. Verify Guillotine Endpoint

The Guillotine GraphQL endpoint:

```
POST http://localhost:8080/admin/site/preview/default/draft
Cookie: JSESSIONID=<session-cookie>
Content-Type: application/json

{"query": "{ guillotine { queryDsl(query: {matchAll: {}}, first: 5) { displayName _path } } }"}
```

### 12. Record Environment

Update `.test-infra/findings.md` Environment section with:
- Enonic XP version, Guillotine version, CLI version, Node.js version, date
