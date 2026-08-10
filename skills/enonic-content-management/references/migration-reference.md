# Migration Reference

## Content API (lib-content) Quick Reference

### Import

```typescript
import contentLib from '/lib/xp/content';
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `contentLib.query()` | Query content with NoQL, filters, aggregations |
| `contentLib.create()` | Create a content item |
| `contentLib.update()` | Update content via editor callback (replaces deprecated `modify()`) |
| `contentLib.modify()` | Deprecated predecessor of `update()` — same implementation, use `update()` in new code |
| `contentLib.delete()` | Delete content by key (path or id) |
| `contentLib.move()` | Rename or relocate content |
| `contentLib.publish()` | Push content from draft to master |
| `contentLib.unpublish()` | Remove content from master branch |
| `contentLib.exists()` | Check if content exists at path or id |
| `contentLib.get()` | Fetch a single content item (supports `versionId` for historical versions) |
| `contentLib.getChildren()` | Fetch children with pagination |
| `contentLib.getOutboundDependencies()` | List outbound content references by key (XP 7.2+) |
| `contentLib.archive()` | Archive content (XP 7.8+) |
| `contentLib.restore()` | Restore archived content (XP 7.8+) |
| `contentLib.patch()` | Patch content properties directly without workflow side-effects |
| `contentLib.updateWorkflow()` | Set workflow state (`READY`, `IN_PROGRESS`, etc.) on draft branch |
| `contentLib.updateMetadata()` | Update metadata (`owner`, `variantOf`) on both branches |

### Query Parameters

```typescript
contentLib.query({
  start: 0,          // Pagination offset (default: 0)
  count: 10,         // Page size (default: 10)
  query: '',         // NoQL string or DSL object
  filters: {},       // Boolean, exists, notExists, hasValue, ids
  sort: '',          // Sort expression or DSL
  aggregations: {},  // Aggregation definitions
  contentTypes: [],  // Content type filter array
  highlight: {}      // Highlighting config (field-level hit highlighting)
});
```

> *(XP 7.5.0+)* If `sort` was specified, results will contain `_sort` and `_score: null`. Otherwise `_score` will have a relevant value.

### Create Parameters

```typescript
contentLib.create({
  name: 'item-name',           // Optional — auto-generated from displayName if omitted
  parentPath: '/site/path',    // Required parent path
  displayName: 'Item Name',    // Display name
  contentType: 'app:typeName', // Required content type
  language: 'en',              // Optional language tag
  childOrder: '_ts DESC',      // Optional default child ordering
  data: {},                    // Content data object
  x: {},                       // eXtra data (x-data)
  workflow: {                  // Optional workflow state (default: READY)
    state: 'READY',
    checks: {}
  },
  requireValid: true,          // Validate against content type (default: true)
  refresh: true,               // Index refresh — set false for bulk operations
  idGenerator: (name) => name  // Optional — custom suffix generator for auto-named content
});
```

### Update Pattern

> `update()` replaces the deprecated `modify()`. Both are backed by the same implementation. Use `update()` in new code.

```typescript
contentLib.update({
  key: '/path/to/content',     // Path or id
  editor: (content) => {
    content.data.field = 'new value';
    content.displayName = 'Updated Name';
    return content;
  },
  requireValid: true           // Default: true
});
```

> **Important:** A genuine update resets `workflow.state` to `IN_PROGRESS` and stamps `modifier`/`modifiedTime`. An editor that returns the content unchanged is a no-op. Since `publish()` refuses content that is not `READY`, call `contentLib.updateWorkflow()` to set state back to `READY` before publishing.

Only these properties are writable in the editor callback: `displayName`, `language`, `data`, `x`, `page`. Setting `workflow`, `publish`, `owner` or other properties in the editor is silently ignored.

### UpdateWorkflow Pattern

```typescript
contentLib.updateWorkflow({
  key: '/path/to/content',
  editor: (w) => {
    w.state = 'READY';
    return w;
  }
});
```

### Publish Pattern

> **XP 7.12+ change:** `sourceBranch` and `targetBranch` are no longer in use. Publish always pushes from `draft` to `master`. These parameters are silently ignored on XP 7.12+. Keep them for backward compatibility with XP < 7.12.

> **Publishing is all-or-nothing.** XP validates the entire resolved set before pushing. If a single item is ineligible (`valid` is `false` or `workflow.state` is not `READY`), the whole publish is abandoned: `pushedContents` comes back empty, every id lands in `failedContents`, and no exception is thrown. With `includeDependencies: true` (default), an invalid dependency you never named is enough to block everything. Use `contentLib.updateWorkflow()` to mark items as `READY` before publishing.

```typescript
contentLib.publish({
  keys: ['/site/page1', 'content-id-2'],
  sourceBranch: 'draft',              // Ignored on XP 7.12+
  targetBranch: 'master',             // Ignored on XP 7.12+
  includeDependencies: false,          // Set false for bulk to avoid cascade
  excludeDescendantsOf: ['id-3'],      // Exclude descendants of specific items (replaces deprecated excludeChildrenIds)
  message: 'Bulk update migration',   // Optional publish commit message
  schedule: {                          // Optional scheduling
    from: new Date().toISOString(),
    to: '2025-12-31T23:59:59Z'
  }
});
```

## Node API (lib-node) Quick Reference

> **Repository ID is a placeholder.** `com.enonic.cms.myproject` follows the pattern `com.enonic.cms.<project-name>` — replace `myproject` with your content project's name. Avoid the legacy `com.enonic.cms.default` repository: it is deprecated and hidden unless enabled via configuration.

### Import and Connect

```typescript
import { connect, multiRepoConnect } from '/lib/xp/node';

const repo = connect({
  repoId: 'com.enonic.cms.myproject',
  branch: 'draft'
});

// For cross-repository migration queries:
const multiRepo = multiRepoConnect({
  sources: [
    { repoId: 'com.enonic.cms.myproject', branch: 'draft' },
    { repoId: 'com.enonic.cms.myproject', branch: 'draft' }
  ]
});
// multiRepo.query() hits include repoId and branch fields
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `repo.query()` | Query nodes with NoQL, filters, aggregations |
| `repo.create()` | Create a node |
| `repo.modify()` | Modify node via editor callback |
| `repo.delete()` | Delete nodes by key |
| `repo.move()` | Move or rename a node |
| `repo.push()` | Push nodes to another branch; supports `exclude` to skip specific nodes |
| `repo.diff()` | Compare node versions across branches |
| `repo.exists()` | Check node existence |
| `repo.get()` | Fetch nodes by id or path |
| `repo.findChildren()` | Fetch children with pagination; supports `recursive` (XP 7.7+) and `countOnly` options |
| `repo.findVersions()` | Fetch version history of a node |
| `repo.refresh()` | Refresh indices after bulk updates |

## NoQL Query DSL Reference

### Comparison Operators

```
=, !=, >, >=, <, <=, LIKE, NOT LIKE, IN, NOT IN
```

### Logical Operators

```
AND, OR, NOT
```

### Query Functions

| Function | Syntax | Purpose |
|----------|--------|---------|
| `fulltext()` | `fulltext('field', 'search terms', 'AND'\|'OR')` | Full-text search on analyzed fields |
| `ngram()` | `ngram('field', 'prefix', 'AND'\|'OR')` | Prefix/autocomplete search |
| `stemmed()` | `stemmed('field', 'terms', 'AND'\|'OR', 'lang')` | Language-stemmed search |
| `range()` | `range('field', from, to, includeFrom, includeTo)` | Range queries |
| `pathMatch()` | `pathMatch('_path', '/target/path', minMatch)` | Path proximity matching |

### Value Functions (for typed comparisons)

```
instant('2024-01-01T00:00:00Z')
dateTime('2024-01-01T00:00:00+02:00')
date('2024-01-01')
time('09:30')
localDateTime('2024-01-01T10:30')
```

### Common Query Patterns

**Content by type:**
```
type = 'app.name:article'
```

**Content under a path (all descendants):**
```
_path LIKE '/content/my-site/articles/*'
```

> **Important:** `_path` in queries uses the internal node path (with `/content/` prefix). Query results (`hit._path`) and `contentLib.get()` return the content-domain path (without prefix). Prepend `/content/` when constructing queries from result paths.

**Direct children only:**
```
_parentPath = '/content/my-site/articles'
```

**Date range:**
```
modifiedTime > instant('2024-01-01T00:00:00Z') AND modifiedTime < instant('2024-06-01T00:00:00Z')
```

**Full-text with type filter:**
```
type = 'app:article' AND fulltext('data.body', 'migration guide', 'AND')
```

**Missing values (exists check):**
```
data.category LIKE "*"          // exists
publish.first NOT LIKE "*"      // does not exist
```

### Sort Expressions

```
_modifiedTime DESC
_name ASC
_score DESC                     // Relevance sorting
geoDistance('data.location', '59.91,10.75', 'km')
```

## Aggregations Reference

### Term Aggregation

```typescript
aggregations: {
  categories: {
    terms: {
      field: 'data.category',
      order: '_count desc',
      size: 10
    }
  }
}
```

### Stats Aggregation

```typescript
aggregations: {
  priceStats: {
    stats: { field: 'data.price' }
  }
}
// Returns: { count, min, max, avg, sum }
```

### Date Histogram

```typescript
aggregations: {
  byMonth: {
    dateHistogram: {
      field: 'createdTime',
      interval: '1M',
      minDocCount: 0,
      format: 'MM-yyyy'
    }
  }
}
```

### Range Aggregation

```typescript
aggregations: {
  priceRanges: {
    range: {
      field: 'data.price',
      ranges: [
        { to: 100 },
        { from: 100, to: 500 },
        { from: 500 }
      ]
    }
  }
}
```

### Nested Aggregation (terms + sub-aggregation)

```typescript
aggregations: {
  byType: {
    terms: { field: 'type', size: 20 },
    aggregations: {
      avgPrice: { stats: { field: 'data.price' } }
    }
  }
}
```

## Batch Processing Patterns

### Paginated Query Loop

```typescript
const BATCH_SIZE = 100;
let start = 0;
let processed = 0;
let total = 0;

do {
  const result = contentLib.query({
    start: start,
    count: BATCH_SIZE,
    query: "type = 'app:article'",
    sort: '_path ASC'
  });

  if (start === 0) total = result.total;

  result.hits.forEach((hit) => {
    // Process each item
    processed++;
  });

  start += BATCH_SIZE;
} while (start < total);
```

### Set refresh: false for Bulk Creates

When creating many items, disable per-item index refresh:

```typescript
contentLib.create({
  parentPath: '/import-target',
  contentType: 'app:record',
  data: itemData,
  refresh: false           // Defer index refresh
});

// After batch is done, refresh manually via node API:
repo.refresh('SEARCH');
```

## Context and Branch Handling

### Running in Draft Branch

```typescript
import contextLib from '/lib/xp/context';

const result = contextLib.run({
  repository: 'com.enonic.cms.myproject',
  branch: 'draft',
  principals: ['role:system.admin']
}, () => {
  return contentLib.query({ query: "type = 'app:article'" });
});
```

### Running in Master Branch (read published)

```typescript
const published = contextLib.run({
  repository: 'com.enonic.cms.myproject',
  branch: 'master',
  principals: ['role:system.admin']
}, () => {
  return contentLib.get({ key: '/site/my-article' });
});
```

## Task Controller Pattern

> **`executeFunction()` is deprecated** as of XP 8.1.0 and does not work on the GraalJS engine. Use named tasks with `submitTask()` instead for new code. The examples below still show `executeFunction()` for XP 7.x backward compatibility.

### Inline Task with Progress

```typescript
import { executeFunction, progress } from '/lib/xp/task';

const taskId = executeFunction({
  description: 'Bulk content migration',
  func: () => {
    const total = contentLib.query({ count: 0, query: targetQuery }).total;
    let current = 0;

    progress({ info: 'Starting migration', current: 0, total });

    // ... paginated processing loop ...
    // Inside loop:
    progress({
      info: `Processing batch ${batchNum}`,
      current: current,
      total: total
    });

    progress({ info: 'Migration complete', current: total, total });
  }
});
```

### Named Task Descriptor

Place in `src/main/resources/tasks/{taskName}/{taskName}.js`:

```typescript
import { progress } from '/lib/xp/task';

exports.run = function(params) {
  // params come from submitTask config
  progress({ info: 'Starting', current: 0, total: params.total });
  // ... processing ...
};
```

Submit with:

```typescript
import { submitTask } from '/lib/xp/task';

submitTask({
  descriptor: 'myMigrationTask',
  config: { query: targetQuery, batchSize: 100 }  // Must match the task descriptor XML schema
});
```

## Export/Import API (lib-export, XP 7.8+)

For environment-level migration (moving content between XP instances), use the dedicated export/import API.

### Import

```typescript
import exportLib from '/lib/xp/export';
```

### Export Nodes

```typescript
exportLib.exportNodes({
  sourceNodePath: '/content',
  exportName: 'my-export',
  includeNodeIds: true,
  includeVersions: false,
  nodeResolved: (count) => {
    log.info('Nodes to export: %s', count);
  },
  nodeExported: (count) => {
    log.info('Exported so far: %s', count);
  }
});
// Export is written to the server's exports directory
// Returns: { exportedNodes, exportedBinaries, exportErrors }
```

### Import Nodes

```typescript
exportLib.importNodes({
  source: 'my-export',           // Export name in exports directory, or application resource key
  targetNodePath: '/content',
  xslt: 'transform.xslt',       // Optional XSLT for pre-import transformation
  xsltParams: { key: 'value' },  // Optional parameters for XSLT
  includeNodeIds: true,           // Preserve original IDs (default: false)
  includePermissions: true,       // Preserve permissions (default: false)
  nodeResolved: (count) => {
    log.info('Nodes to import: %s', count);
  },
  nodeImported: (count) => {
    log.info('Imported so far: %s', count);
  }
});
// Returns: { addedNodes, updatedNodes, importedBinaries, importErrors }
// importErrors entries contain: { exception, message, stacktrace }
```
