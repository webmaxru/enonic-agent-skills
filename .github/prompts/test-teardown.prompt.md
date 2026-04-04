---
name: "Test Teardown"
description: "Clean up the Docker-based Enonic XP test environment. Stops and removes containers, optionally deletes projects and logs."
argument-hint: "Optional: 'full' to remove all .test-infra contents, 'docker-only' to just stop/remove the container"
agent: "agent"
---

Clean up the Enonic XP test environment created by the `test-setup` prompt.

Since `.test-infra/` is gitignored, cleanup is optional — leaving it in place is harmless and allows faster re-runs. Use this prompt when you want to free disk space or start fresh.

## Steps

### 1. Stop and Remove Docker Container

```bash
docker stop enonic-xp-test
docker rm enonic-xp-test
```

### 2. (Optional) Remove Docker Image

To free ~1.5 GB of disk space:

```bash
docker rmi enonic/xp:7.16.2-ubuntu
```

### 3. (Optional) Remove Gradle Image

```bash
docker rmi gradle:8.5-jdk17
```

### 4. (Optional) Remove Test Projects

```bash
# Remove all scaffolded projects (PowerShell)
Remove-Item -Recurse -Force .test-infra/projects/*

# Or on bash:
# rm -rf .test-infra/projects/*
```

### 5. (Optional) Remove Test Output

```bash
Remove-Item -Recurse -Force .test-infra/output/*
```

### 6. (Optional) Full Cleanup

To remove all test infrastructure (you'll need to run `test-setup` again):

```bash
Remove-Item -Recurse -Force .test-infra/projects/*
Remove-Item -Recurse -Force .test-infra/output/*
# Keep .test-infra/changes/ and .test-infra/findings.md for reference
```

## Preserving Findings

Before full cleanup, consider:
- `.test-infra/findings.md` — copy to an issue or PR if relevant
- `.test-infra/changes/*.md` — these contain proposed skill improvements; copy or apply before deleting

## Notes

- The `.test-infra/` directory itself is gitignored and won't appear in Git
- `TESTING.md` and the saved prompts in `.github/prompts/` remain in the repo
- If any additional Docker containers were created during testing, remove those too:
  ```bash
  docker ps -a --filter "ancestor=enonic/xp:7.16.2-ubuntu" --format "{{.ID}}" | ForEach-Object { docker rm -f $_ }
  ```
