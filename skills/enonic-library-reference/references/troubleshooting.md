# Troubleshooting Enonic XP APIs

## Common Import Errors

### "Cannot find module '/lib/xp/content'"

**Cause:** The library is not included in `build.gradle`.
**Fix:** Add the dependency:
```groovy
dependencies {
    include "com.enonic.xp:lib-content:${xpVersion}"
}
```

### "Import is not defined"

**Cause:** Using ES module `import` syntax in a context that doesn't support it, or XP version too old.
**Fix:** Ensure the project uses XP 7.x+ with TypeScript support enabled, or use CommonJS `require` syntax:
```js
const contentLib = require('/lib/xp/content');
```

## Permission Errors

### "Access denied to user [unknown]"

**Cause:** The current execution context lacks the required role. Common when called from a service or task.
**Fix:** Wrap the call in `contextLib.run()` with elevated permissions:
```ts
import contextLib from '/lib/xp/context';
contextLib.run({
    user: { login: 'su', idProvider: 'system' },
    principals: ['role:system.admin']
}, () => {
    // Your lib-auth or lib-content call here
});
```

## Content API Issues

### "contentAlreadyExists" error on create

**Cause:** A content with the same name already exists under the specified parent path.
**Fix:** Either check with `exists()` before creating, or use a try/catch:
```ts
try {
    create({ name: 'myContent', parentPath: '/', contentType: 'base:folder', data: {} });
} catch (e) {
    if (e.code === 'contentAlreadyExists') {
        log.info('Content already exists');
    }
}
```

### query() returns empty results

**Cause:** Content may not be indexed yet, or the query syntax is incorrect.
**Fix:**
1. If content was just created with `refresh: false`, wait or set `refresh: true`.
2. Verify the query string syntax matches Enonic's query DSL.
3. Check `contentTypes` filter matches the actual content type name.

### modify() not saving changes

**Cause:** The editor function must return the modified content object.
**Fix:** Always return the content from the editor:
```ts
modify({
    key: '/path/to/content',
    editor: (c) => {
        c.data.myField = 'new value';
        return c; // Must return!
    }
});
```

## Node API Issues

### "Cannot connect to repository"

**Cause:** Repository doesn't exist or wrong repoId/branch.
**Fix:** Verify the repository exists with `repoLib.get('my-repo')` before connecting.

### Push fails with ACCESS_DENIED

**Cause:** The user lacks publish permissions for the target branch.
**Fix:** Run in a context with `role:system.admin` or grant appropriate permissions.

## Task API Issues

### progress() throws error

**Cause:** `progress()` was called outside a task execution context.
**Fix:** Only call `progress()` inside the callback of `executeFunction()` or a named task controller.

### Task runs but no progress visible

**Cause:** Progress information is not being reported from within the task.
**Fix:** Call `progress()` at regular intervals inside the task function.

## Mail API Issues

### send() returns false

**Cause:** SMTP server is not configured or unreachable.
**Fix:** Check `com.enonic.xp.mail.cfg` configuration file and verify SMTP connectivity.

## Version Compatibility

| Feature | Minimum XP Version |
|---------|-------------------|
| lib-auditlog | 7.2.0 |
| getOutboundDependencies | 7.2.0 |
| getGroupSize (websocket) | 7.6.0 |
| lib-vhost | 7.6.0 |
| resetInheritance | 7.6.0 |
| getCommit (node) | 7.7.0 |
| lib-scheduler | 7.7.0 |
| processHtml imageWidths | 7.7.0 |
| context attributes | 7.8.0 |
| archive / restore | 7.8.0 |
| lib-export | 7.8.0 |
| login scope NONE | 7.8.0 |
| processHtml imageSizes | 7.8.0 |
| lib-grid (SharedMap) | 7.10.0 |
| getAvailableApplications (project) | 7.11.0 |
| publish sourceBranch/targetBranch not in use | 7.12.0 |
| duplicate (content) | 7.12.0 |
| duplicate (node) | 7.12.0 |
| getDefaultFromEmail | 7.14.1 |
| assetUrl deprecated | 7.15.0 |
| User.hasPassword | 7.15.0 |

## XP 8 Migration Notes

Enonic XP 8 was released with significant API changes. If using XP 8, be aware of the following renames and new functions. The reference files in this skill document the XP 7.x API surface. Consult the XP 8 documentation at https://developer.enonic.com/docs/code/stable/libraries for XP 8 specifics.

> Source: https://github.com/enonic/doc-xp (release.adoc), https://github.com/enonic/doc-code (docs/libraries/)

### Renamed Functions (XP 7 → XP 8)

| Library | XP 7 Name | XP 8 Name | Notes |
|---------|-----------|-----------|-------|
| lib-content | `delete` | `deleteContent` | Avoids JS reserved word |
| lib-content | `modify` | `update` | |
| lib-content | `modifyMedia` | `updateMedia` | |
| lib-node | `modify` | `update` | |
| lib-node | `setChildOrder` | `sort` | Also absorbs `reorderChildren` |
| lib-node | `setRootPermissions` | `applyPermissions` | |
| lib-node | `findVersions` | `getVersions` | |
| lib-repo | `delete` | `deleteRepo` | Avoids JS reserved word |

### New Functions in XP 8

| Library | Function | Description |
|---------|----------|-------------|
| lib-content | `patch` | Apply partial changes across branches in one call |
| lib-content | `getActiveVersions` | Get active version info across branches |
| lib-content | `getVersions` | List content versions |
| lib-content | `updateMetadata` | Update content metadata without full editor |
| lib-content | `updateWorkflow` | Update workflow state |
| lib-content | `applyPermissions` | Replaces `setPermissions` |
| lib-node | `patch` | Apply partial changes to nodes |
| lib-node | `sort` | Replaces `setChildOrder` and `reorderChildren` |
| lib-node | `applyPermissions` | Replaces `setRootPermissions` |
| lib-sse | `send`, `sendToGroup`, `close`, `isOpen`, `addToGroup`, `removeFromGroup`, `getGroupSize` | New Server-Sent Events library |

### Removed / Changed in XP 8

- `lib-content setPermissions` → replaced by `applyPermissions`
- `lib-node setActiveVersion` → removed
- `lib-node setChildOrder` → replaced by `sort`
- `lib-node setRootPermissions` → replaced by `applyPermissions`
- `inheritsPermissions` flag → removed entirely; permissions are always explicit
- `lib-schema` resources → YAML only (XML no longer accepted)
- `lib-content hasChildren` property → removed from content objects
- HTTP function names → uppercase: `GET`, `POST`, `PUT`, `DELETE`
