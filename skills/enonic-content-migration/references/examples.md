# Examples

## Bulk Update: Change a Field on All Matching Content

Update the `category` field to `"archived"` on all Article content published before 2024.

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { executeFunction, progress } from '/lib/xp/task';

const BATCH_SIZE = 100;

exports.run = function () {
  executeFunction({
    description: 'Archive old articles',
    func: () => {
      const query = "type = 'com.example.myapp:article' AND publish.from < instant('2024-01-01T00:00:00Z')";

      contextLib.run({
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        const totalResult = contentLib.query({ count: 0, query });
        const total = totalResult.total;
        let start = 0;
        let updated = 0;
        let failed = 0;

        progress({ info: 'Starting bulk update', current: 0, total });

        while (start < total) {
          const result = contentLib.query({
            start,
            count: BATCH_SIZE,
            query,
            sort: '_path ASC'
          });

          result.hits.forEach((hit) => {
            try {
              contentLib.modify({
                key: hit._id,
                editor: (c) => {
                  c.data.category = 'archived';
                  return c;
                }
              });
              updated++;
            } catch (e) {
              log.error('Failed to update %s: %s', hit._path, e.message);
              failed++;
            }
          });

          start += BATCH_SIZE;
          progress({ info: `Updated ${updated}/${total}`, current: updated + failed, total });
        }

        // Publish all updated items
        if (updated > 0) {
          const updatedIds = contentLib.query({
            count: updated,
            query: query + " AND data.category = 'archived'"
          }).hits.map(h => h._id);

          contentLib.publish({
            keys: updatedIds,
            sourceBranch: 'draft',
            targetBranch: 'master',
            includeDependencies: false
          });
        }

        progress({ info: `Done. Updated: ${updated}, Failed: ${failed}`, current: total, total });
      });
    }
  });
};
```

## Bulk Create: Import Products from JSON

Import product records from a JSON data source, creating content items with progress reporting.

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { connect } from '/lib/xp/node';
import { executeFunction, progress } from '/lib/xp/task';

exports.run = function (params) {
  executeFunction({
    description: 'Import products from JSON',
    func: () => {
      const products = JSON.parse(params.jsonData);
      const total = products.length;
      let created = 0;
      let skipped = 0;
      let failed = 0;

      progress({ info: 'Starting product import', current: 0, total });

      contextLib.run({
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        products.forEach((product, index) => {
          try {
            if (contentLib.exists({ key: `/products/${product.sku}` })) {
              skipped++;
            } else {
              contentLib.create({
                name: product.sku,
                parentPath: '/products',
                displayName: product.name,
                contentType: 'com.example.myapp:product',
                data: {
                  sku: product.sku,
                  price: product.price,
                  description: product.description,
                  category: product.category
                },
                refresh: false  // Defer index refresh for bulk
              });
              created++;
            }
          } catch (e) {
            log.error('Failed to create product %s: %s', product.sku, e.message);
            failed++;
          }

          if ((index + 1) % 100 === 0) {
            progress({
              info: `Processed ${index + 1}/${total}`,
              current: index + 1,
              total
            });
          }
        });

        // Refresh index after bulk create
        const repo = connect({
          repoId: 'com.enonic.cms.default',
          branch: 'draft'
        });
        repo.refresh('SEARCH');

        progress({
          info: `Import complete. Created: ${created}, Skipped: ${skipped}, Failed: ${failed}`,
          current: total,
          total
        });
      });
    }
  });
};
```

## Query with Aggregations: Content Counts by Type

Retrieve content count grouped by content type with date histogram.

```typescript
import contentLib from '/lib/xp/content';

const result = contentLib.query({
  start: 0,
  count: 0,  // Only need aggregation results
  query: "_path LIKE '/content/my-site/*'",
  aggregations: {
    byType: {
      terms: {
        field: 'type',
        order: '_count desc',
        size: 50
      }
    },
    byMonth: {
      dateHistogram: {
        field: 'createdTime',
        interval: '1M',
        minDocCount: 0,
        format: 'yyyy-MM'
      }
    },
    priceRanges: {
      range: {
        field: 'data.price',
        ranges: [
          { to: 100 },
          { from: 100, to: 500 },
          { from: 500, to: 1000 },
          { from: 1000 }
        ]
      }
    }
  }
});

log.info('Total items: %s', result.total);
log.info('By type: %s', JSON.stringify(result.aggregations.byType, null, 2));
log.info('By month: %s', JSON.stringify(result.aggregations.byMonth, null, 2));
```

## Migration: Move Content to a New Path

Move all content from one site path to another, preserving references.

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { executeFunction, progress } from '/lib/xp/task';

const BATCH_SIZE = 50;

exports.run = function (params) {
  const sourcePath = params.sourcePath;  // e.g. '/old-site/articles'
  const targetPath = params.targetPath;  // e.g. '/new-site/articles'

  executeFunction({
    description: `Move content from ${sourcePath} to ${targetPath}`,
    func: () => {
      contextLib.run({
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        // Get direct children of source
        const children = contentLib.getChildren({
          key: sourcePath,
          start: 0,
          count: 1000
        });

        const total = children.total;
        let moved = 0;
        let failed = 0;

        progress({ info: 'Starting content move', current: 0, total });

        children.hits.forEach((child) => {
          try {
            contentLib.move({
              source: child._id,
              target: targetPath + '/'
            });
            moved++;
          } catch (e) {
            if (e.code === 'contentAlreadyExists') {
              log.warning('Content already exists at target: %s', child._name);
            } else {
              log.error('Failed to move %s: %s', child._path, e.message);
            }
            failed++;
          }

          progress({
            info: `Moved ${moved}/${total}`,
            current: moved + failed,
            total
          });
        });

        // Publish moved items
        if (moved > 0) {
          const movedItems = contentLib.getChildren({
            key: targetPath,
            start: 0,
            count: moved
          });

          contentLib.publish({
            keys: movedItems.hits.map(h => h._id),
            sourceBranch: 'draft',
            targetBranch: 'master',
            includeDependencies: false
          });
        }

        progress({
          info: `Move complete. Moved: ${moved}, Failed: ${failed}`,
          current: total,
          total
        });
      });
    }
  });
};
```

## Bulk Delete: Remove Expired Content

Delete content items that have passed their scheduled unpublish date.

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { executeFunction, progress } from '/lib/xp/task';

const BATCH_SIZE = 100;

exports.run = function () {
  executeFunction({
    description: 'Remove expired content',
    func: () => {
      contextLib.run({
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        const now = new Date().toISOString();
        const query = `publish.to < instant('${now}')`;

        const totalResult = contentLib.query({ count: 0, query });
        const total = totalResult.total;
        let deleted = 0;
        let failed = 0;
        let start = 0;

        progress({ info: 'Starting cleanup of expired content', current: 0, total });

        while (start < total) {
          // Always query from start=0 since we are deleting items
          const result = contentLib.query({
            start: 0,
            count: BATCH_SIZE,
            query,
            sort: '_path ASC'
          });

          if (result.hits.length === 0) break;

          result.hits.forEach((hit) => {
            try {
              contentLib.delete({ key: hit._id });
              deleted++;
            } catch (e) {
              log.error('Failed to delete %s: %s', hit._path, e.message);
              failed++;
            }
          });

          start += BATCH_SIZE;
          progress({
            info: `Deleted ${deleted}, Failed: ${failed}`,
            current: deleted + failed,
            total
          });
        }

        progress({
          info: `Cleanup complete. Deleted: ${deleted}, Failed: ${failed}`,
          current: total,
          total
        });
      });
    }
  });
};
```

## NoQL Query Patterns: Date Range with Full-Text Search

```typescript
// Find articles modified in 2024 containing "migration" in body
const result = contentLib.query({
  count: 50,
  query: "type = 'app:article' AND modifiedTime > instant('2024-01-01T00:00:00Z') AND fulltext('data.body', 'migration', 'AND')",
  sort: 'modifiedTime DESC',
  filters: {
    boolean: {
      must: {
        exists: { field: 'data.author' }
      }
    }
  }
});
```

## Node API: Low-Level Batch Operation

Use the Node API for operations outside the content domain or when bypassing content-type validation.

```typescript
import { connect } from '/lib/xp/node';
import contextLib from '/lib/xp/context';

contextLib.run({
  repository: 'com.enonic.cms.default',
  branch: 'draft',
  principals: ['role:system.admin']
}, () => {
  const repo = connect({
    repoId: 'com.enonic.cms.default',
    branch: 'draft'
  });

  const result = repo.query({
    count: 100,
    query: "data.legacyField LIKE '*'",
    sort: '_path ASC'
  });

  result.hits.forEach((hit) => {
    repo.modify({
      key: hit.id,
      editor: (node) => {
        node.data.newField = node.data.legacyField;
        delete node.data.legacyField;
        return node;
      }
    });
  });

  // Push changes to master branch
  repo.push({
    keys: result.hits.map(h => h.id),
    target: 'master',
    resolve: false,
    includeChildren: false  // Set true to also push child nodes
  });

  repo.refresh();
});
```

## Export and Import with Progress Tracking

Use the export/import API (XP 7.8+) to move content between environments with progress reporting and optional XSLT transformation.

```typescript
import exportLib from '/lib/xp/export';
import contextLib from '/lib/xp/context';
import { executeFunction, progress } from '/lib/xp/task';

exports.run = function () {
  executeFunction({
    description: 'Export and reimport content with transformation',
    func: () => {
      contextLib.run({
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        let totalNodes = 0;

        // Export content subtree
        const exportResult = exportLib.exportNodes({
          sourceNodePath: '/content/my-site/articles',
          exportName: 'articles-export',
          includeNodeIds: true,
          includeVersions: false,
          nodeResolved: (count) => {
            totalNodes = count;
            progress({ info: `Exporting ${count} nodes`, current: 0, total: count });
          },
          nodeExported: (count) => {
            progress({ info: `Exported ${count}/${totalNodes}`, current: count, total: totalNodes });
          }
        });

        if (exportResult.exportErrors.length > 0) {
          log.error('Export errors: %s', JSON.stringify(exportResult.exportErrors));
          return;
        }

        // Import into a different path with XSLT transformation
        const importResult = exportLib.importNodes({
          source: 'articles-export',
          targetNodePath: '/content/new-site/articles',
          xslt: 'migration-transform.xslt',
          xsltParams: { newSiteName: 'new-site' },
          includeNodeIds: false,
          includePermissions: true,
          nodeResolved: (count) => {
            totalNodes = count;
            progress({ info: `Importing ${count} nodes`, current: 0, total: count });
          },
          nodeImported: (count) => {
            progress({ info: `Imported ${count}/${totalNodes}`, current: count, total: totalNodes });
          }
        });

        log.info('Added: %s, Updated: %s', importResult.addedNodes.length, importResult.updatedNodes.length);

        if (importResult.importErrors.length > 0) {
          importResult.importErrors.forEach((err) => {
            log.error('Import error: %s - %s', err.exception, err.message);
          });
        }

        progress({ info: 'Export/import complete', current: totalNodes, total: totalNodes });
      });
    }
  });
};
```

## Resolve Outbound Dependencies Before Deletion

Use `getOutboundDependencies()` (XP 7.2+) to identify referenced content before bulk deletion.

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';

contextLib.run({
  branch: 'draft',
  principals: ['role:system.admin']
}, () => {
  const targets = contentLib.query({
    count: 100,
    query: "type = 'app:deprecated-type'"
  });

  targets.hits.forEach((hit) => {
    const deps = contentLib.getOutboundDependencies({ key: hit._id });
    if (deps.length > 0) {
      log.warning('Content %s references %s other items — skipping delete', hit._path, deps.length);
    } else {
      contentLib.delete({ key: hit._id });
    }
  });
});
```
