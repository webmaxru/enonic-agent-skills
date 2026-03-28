---
name: "Test Teardown"
description: "Clean up the Enonic XP test environment. Stops sandbox, optionally deletes projects and logs. Use when you want to free resources or start fresh."
argument-hint: "Optional: 'full' to remove all .test-infra contents, 'sandbox-only' to just stop/delete the sandbox"
agent: "agent"
---

Clean up the Enonic XP test environment created by the `test-setup` prompt.

Since `.test-infra/` is gitignored, cleanup is optional — leaving it in place is harmless and allows faster re-runs. Use this prompt when you want to free disk space or start fresh.

## Steps

### 1. Stop Running Sandbox

```bash
enonic sandbox stop
```

### 2. Delete Sandbox

```bash
enonic sandbox delete skill-test-sandbox -f
```

### 3. (Optional) Remove Test Projects

If you want to clean up disk space:

```bash
# Remove all scaffolded projects
rm -rf .test-infra/projects/*
```

### 4. (Optional) Remove Test Output

```bash
# Remove test logs
rm -rf .test-infra/output/*
```

### 5. (Optional) Full Cleanup

To remove all test infrastructure (you'll need to run `test-setup` again):

```bash
rm -rf .test-infra/projects/*
rm -rf .test-infra/output/*
# Keep .test-infra/changes/ and .test-infra/findings.md for reference
```

## Preserving Findings

Before full cleanup, consider:
- `.test-infra/findings.md` — copy to an issue or PR if relevant
- `.test-infra/changes/*.md` — these contain proposed skill improvements; copy or apply before deleting

## Notes

- The `.test-infra/` directory itself is gitignored and won't appear in Git
- `TESTING.md` and the saved prompts in `.github/prompts/` remain in the repo
- If any secondary sandboxes were created during testing (e.g., `test-secondary`), delete those too: `enonic sandbox delete <name> -f`
