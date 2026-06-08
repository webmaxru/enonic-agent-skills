# Compatibility

## API Availability by XP Version

| Feature | Minimum XP Version | Notes |
|---------|-------------------|-------|
| `contentLib.query()` | 6.0 | Core function, always available |
| `contentLib.create()` | 6.0 | `refresh` parameter available from 6.0 |
| `contentLib.modify()` | 6.0 | Editor callback pattern. Renamed to `contentLib.update()` in XP 8 |
| `contentLib.delete()` | 6.0 | Renamed to `contentLib.deleteContent()` in XP 8 (old export kept for backward compatibility) |
| `contentLib.publish()` | 6.0 | `sourceBranch`/`targetBranch` not in use since 7.12 (ignored, publish always goes draft→master), removed in XP 8. `excludeChildrenIds` added in 7.12, deprecated in XP 8 — use `excludeDescendantsOf`. `message` parameter added in XP 8 |
| `contentLib.archive()` | 7.8 | Archive/restore workflow |
| `contentLib.restore()` | 7.8 | Restore from archive |
| `contentLib.getOutboundDependencies()` | 7.2 | List outbound content references for dependency resolution |
| `contentLib.duplicate()` | 7.12 | Includes `variant`, `parent`, `name` options from 7.12 |
| `contentLib.update()` | 8.0 | Replaces `contentLib.modify()`. Same editor-callback signature |
| `contentLib.deleteContent()` | 8.0 | Replaces `contentLib.delete()`. Old `delete` export kept for backward compatibility |
| `contentLib.patch()` | 8.0 | Low-level multi-branch content patching. Restricted to admin/cms.admin roles |
| `contentLib.applyPermissions()` | 8.0 | Replaces `contentLib.setPermissions()`. Supports `addPermissions`/`removePermissions` and `scope` (`SINGLE`/`TREE`/`SUBTREE`) |
| `contentLib.getActiveVersions()` | 8.0 | Get active content version per branch |
| `contentLib.getVersions()` | 8.0 | Cursor-based content version history |
| `publish()` `excludeDescendantsOf` | 8.0 | Replaces deprecated `excludeChildrenIds` |
| `publish()` `message` | 8.0 | Optional publish message |
| `taskLib.executeFunction()` | 7.7 | Replaces deprecated `taskLib.submit()` |
| `taskLib.submitTask()` | 7.7 | Replaces deprecated `taskLib.submitNamed()`. Optional `name` parameter overrides the descriptor key |
| `taskLib.sleep()` | 7.0 | Only works inside a task context |
| `repo.duplicate()` | 7.12 | Node-level duplication with `dataProcessor` callback and `refresh` option |
| `repo.findChildren()` `recursive` | 7.7 | Recursive fetching of all nested children |
| Named task `taskId` 2nd argument | 7.13 | `exports.run(params, taskId)` receives task ID |
| `lib-export` (exportNodes/importNodes) | 7.8 | Node export/import API for environment migration. XP 8: `includeNodeIds`/`includeVersions` removed from `exportNodes`; `batchSize` added; exports are ZIP archives. `importNodes` gains `nodeSkipped` callback and `versionAttributes` parameter |
| `exportLib.list()` | 8.0 | Lists available node exports |
| Query DSL `exists` expression | 7.11 | DSL expression to check field existence |
| Query DSL `boolean.filter` | 7.11 | Non-scoring filter compound in query DSL |
| Query DSL (JSON format) | 7.9 | Alternative to string-based NoQL |
| Sort DSL (JSON format) | 7.9 | Alternative to string-based sort |
| Min/Max/Value Count aggregations | 7.7 | Standalone metric aggregations |
| Term aggregation `minDocCount` | 7.7 | Filter sparse buckets |
| Query `_sort`/`_score` behavior | 7.5 | When `sort` is specified, `_sort` is returned and `_score` is null |
| `contentLib.resetInheritance()` | 7.6 | Resets custom inheritance flags for content layers |
| `contextLib.run()` `attributes` | 7.8 | Custom attributes in run context |
| `repo.getCommit()` | 7.7 | Get commit info for a node version commit |
| `multiRepoConnect()` | 7.0 | Connect to multiple repositories for cross-repo queries |

## Branch Handling

Enonic XP uses a two-branch model for content:

- **draft**: Working copy where all edits happen. Content API operates here by default in Content Studio context.
- **master**: Published content. Read-only from the content perspective; populated via `publish()`.

When running migration scripts outside Content Studio (e.g. via task controllers or init scripts), the branch context may default to `draft` or may be unset. Always use `contextLib.run()` to explicitly set the branch.

## Content Repository ID

A content project's repository ID follows the pattern `com.enonic.cms.<project-name>` — for a project named `myproject` it is `com.enonic.cms.myproject`. The repository IDs in these examples and templates use `com.enonic.cms.myproject` as a **placeholder**; replace `myproject` with your actual content project name.

> **Avoid `com.enonic.cms.default`.** The legacy default repository is deprecated and hidden unless explicitly enabled via configuration. In XP 8, the default CMS repository is no longer created automatically at all. Target an explicit `com.enonic.cms.<project-name>` repository instead, or read the current repository from the execution context.

To verify the repository ID in your current execution context:

```typescript
const context = contextLib.get();
log.info('Current repo: %s, branch: %s', context.repository, context.branch);
```

## TypeScript Support

Enonic XP supports TypeScript controllers from XP 7.0+. When using TypeScript:

- Import types from `@enonic-types/lib-content`, `@enonic-types/lib-node`, etc.
- The `tsconfig.json` in the project root configures module resolution.
- Use the Enonic TypeScript starter or add type packages manually.

## Index Refresh Behavior

- By default, `contentLib.create()` and `contentLib.modify()` trigger an immediate index refresh (`refresh: true`).
- For bulk operations (100+ items), set `refresh: false` and call `repo.refresh('SEARCH')` after the batch completes.
- Node API: `repo.refresh()` accepts `'ALL'` (default), `'SEARCH'`, or `'STORAGE'`.
- After a refresh, the content is immediately queryable.

## Query Limits

- Default `count` is 10 for both content and node queries.
- There is no hard upper limit on `count`, but large values (10000+) can cause memory and performance issues.
- Use paginated queries with `start`/`count` for large result sets.
- `count: 0` returns metadata only (total count, aggregations) without loading hit data.
