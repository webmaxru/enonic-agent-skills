# Compatibility

## API Availability by XP Version

| Feature | Minimum XP Version | Notes |
|---------|-------------------|-------|
| `contentLib.query()` | 6.0 | Core function, always available |
| `contentLib.create()` | 6.0 | `refresh` parameter available from 6.0 |
| `contentLib.modify()` | 6.0 | Editor callback pattern |
| `contentLib.publish()` | 6.0 | `sourceBranch`/`targetBranch` deprecated since 7.13 (still works) |
| `contentLib.archive()` | 7.8 | Archive/restore workflow |
| `contentLib.restore()` | 7.8 | Restore from archive |
| `contentLib.duplicate()` | 7.12 | Includes `variant` option from 7.12 |
| `taskLib.executeFunction()` | 7.7 | Replaces deprecated `taskLib.submit()` |
| `taskLib.submitTask()` | 7.7 | Replaces deprecated `taskLib.submitNamed()` |
| `taskLib.sleep()` | 7.0 | Only works inside a task context |
| `repo.duplicate()` | 7.12 | Node-level duplication |
| Query DSL (JSON format) | 7.9 | Alternative to string-based NoQL |
| Sort DSL (JSON format) | 7.9 | Alternative to string-based sort |
| Min/Max/Value Count aggregations | 7.7 | Standalone metric aggregations |
| Term aggregation `minDocCount` | 7.7 | Filter sparse buckets |

## Branch Handling

Enonic XP uses a two-branch model for content:

- **draft**: Working copy where all edits happen. Content API operates here by default in Content Studio context.
- **master**: Published content. Read-only from the content perspective; populated via `publish()`.

When running migration scripts outside Content Studio (e.g. via task controllers or init scripts), the branch context may default to `draft` or may be unset. Always use `contextLib.run()` to explicitly set the branch.

## Content Repository ID

The default content repository is `com.enonic.cms.default`. Multi-project setups (XP 7.0+) may use different project-based repository IDs like `com.enonic.cms.myproject`. Verify the repository ID:

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
