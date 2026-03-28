# Troubleshooting

## Content Already Exists

**Error:** `contentAlreadyExists` exception when calling `contentLib.create()`.

**Cause:** A content item with the same name already exists under the specified parent path.

**Resolution:**
- Check for existence before creating: `contentLib.exists({ key: parentPath + '/' + name })`.
- Use an upsert pattern: try to modify first, create on failure.
- For import scripts, generate unique names by appending a counter or timestamp.

```typescript
try {
  contentLib.create({ name, parentPath, contentType, data });
} catch (e) {
  if (e.code === 'contentAlreadyExists') {
    contentLib.modify({
      key: parentPath + '/' + name,
      editor: (c) => { c.data = data; return c; }
    });
  } else {
    throw e;
  }
}
```

## Access Denied on Publish or Modify

**Error:** `AccessDeniedException` or permission-related errors.

**Cause:** The current context lacks sufficient permissions. Task controllers and init scripts may not have admin context by default.

**Resolution:**
- Wrap the operation in `contextLib.run()` with `principals: ['role:system.admin']`.
- For named tasks, ensure the user submitting the task has appropriate roles.

```typescript
contextLib.run({
  branch: 'draft',
  principals: ['role:system.admin']
}, () => {
  // Operations that require elevated permissions
});
```

## Query Returns Zero Results

**Common causes:**
1. **Wrong branch context:** Content exists in `draft` but the query runs against `master`, or vice versa.
2. **Date format mismatch:** Using a raw date string instead of wrapping in `instant()` or `dateTime()`.
3. **Wrong property path:** Content data properties are under `data.fieldName`, not just `fieldName`.
4. **Content type format:** Content type must include the app name prefix, e.g. `com.example.myapp:article`.
5. **Index not refreshed:** After bulk creates with `refresh: false`, query the items before calling `repo.refresh()`.

**Diagnostic steps:**
```typescript
// 1. Check current context
const ctx = contextLib.get();
log.info('Branch: %s, Repo: %s', ctx.branch, ctx.repository);

// 2. Try a broad query first
const all = contentLib.query({ count: 5, query: '' });
log.info('Total content items: %s', all.total);

// 3. Narrow progressively
const byType = contentLib.query({
  count: 5,
  query: "type = 'com.example.myapp:article'"
});
log.info('Articles found: %s', byType.total);
```

## Task Timeout or Failure

**Error:** Task state shows `FAILED` or operation seems to hang.

**Causes:**
- Unhandled exception in the task function terminates the task.
- Very large batch operations without throttling can cause memory pressure.
- Calling `taskLib.progress()` outside a task context throws an exception.

**Resolution:**
- Wrap the entire task body in a try/catch and log errors.
- Use smaller batch sizes (50–100) with `taskLib.sleep(100)` between batches for very large operations.
- Check task state after submission:

```typescript
import { get as getTask } from '/lib/xp/task';

const info = getTask(taskId);
if (info) {
  log.info('State: %s, Progress: %s/%s - %s',
    info.state,
    info.progress.current,
    info.progress.total,
    info.progress.info
  );
}
```

## Publish Failures

**Error:** Items appear in `failedContents` array of `contentLib.publish()` result.

**Causes:**
- Content validation failure (invalid required fields).
- Missing parent content in target branch.
- Permission issues on specific content items.

**Resolution:**
- Check `requireValid` — set to `false` during modify if content is temporarily invalid during migration.
- Publish parent paths before child content.
- Review the `failedContents` array and retry individual items:

```typescript
const result = contentLib.publish({
  keys: contentIds,
  sourceBranch: 'draft',
  targetBranch: 'master',
  includeDependencies: false
});

if (result.failedContents.length > 0) {
  log.warning('Failed to publish: %s', JSON.stringify(result.failedContents));
}
```

## Node Push Failures

**Error:** Items appear in `failed` array of `repo.push()` result with reason `ACCESS_DENIED`.

**Resolution:**
- Ensure the context has admin role.
- Check if the node has restrictive permissions set with `repo.setRootPermissions()` or per-node permissions.
- Use `exclude` parameter to skip problematic nodes and handle them separately.

## Memory Issues with Large Queries

**Symptom:** Out-of-memory errors or very slow responses for queries returning thousands of items.

**Resolution:**
- Never use a very large `count` (e.g. 100000) in a single query call.
- Use paginated queries with `count: 100-200` in a loop.
- Use `count: 0` with aggregations when only statistics are needed.
- For node API, use `repo.findChildren({ countOnly: true })` when only the count is needed.
