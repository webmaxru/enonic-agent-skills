// Task Migration Controller Template
// Adapt this template for long-running content import/migration operations.
// Place the final controller in src/main/resources/tasks/{taskName}/{taskName}.ts
// Replace placeholders marked with [PLACEHOLDER] before use.

import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { connect } from '/lib/xp/node';
import { progress, sleep } from '/lib/xp/task';

interface TaskConfig {
  sourcePath: string;
  targetPath: string;
  batchSize?: string;
  dryRun?: string;
}

exports.run = function (config: TaskConfig): void {
  const sourcePath = config.sourcePath || '[PLACEHOLDER: source path]';
  const targetPath = config.targetPath || '[PLACEHOLDER: target path]';
  const batchSize = parseInt(config.batchSize || '100', 10);
  const dryRun = config.dryRun === 'true';

  contextLib.run({
    repository: 'com.enonic.cms.default',
    branch: 'draft',
    principals: ['role:system.admin']
  }, () => {
    // Count total items to process
    const totalResult = contentLib.query({
      count: 0,
      query: `_path LIKE '${sourcePath}/*'`
    });
    const total = totalResult.total;

    if (total === 0) {
      progress({ info: 'No content found at source path', current: 0, total: 0 });
      return;
    }

    let processed = 0;
    let succeeded = 0;
    let failed = 0;
    let start = 0;

    progress({ info: `Starting migration of ${total} items`, current: 0, total });

    while (start < total) {
      const result = contentLib.query({
        start,
        count: batchSize,
        query: `_path LIKE '${sourcePath}/*'`,
        sort: '_path ASC'
      });

      if (result.hits.length === 0) break;

      result.hits.forEach((hit) => {
        processed++;

        if (dryRun) {
          log.info('[DRY RUN] Would migrate: %s', hit._path);
          succeeded++;
          return;
        }

        try {
          // [PLACEHOLDER: Implement migration logic]
          // Option A: Move content to new path
          // contentLib.move({ source: hit._id, target: targetPath + '/' });

          // Option B: Create transformed copy at target
          // const source = contentLib.get({ key: hit._id });
          // contentLib.create({
          //   parentPath: targetPath,
          //   name: source._name,
          //   displayName: source.displayName,
          //   contentType: source.type,
          //   data: transformData(source.data),
          //   refresh: false
          // });

          succeeded++;
        } catch (e) {
          log.error('Failed to migrate %s: %s', hit._path, (e as Error).message);
          failed++;
        }
      });

      start += batchSize;

      progress({
        info: `Processed: ${processed}/${total}, OK: ${succeeded}, Failed: ${failed}`,
        current: processed,
        total
      });

      // Throttle between batches to reduce load
      sleep(50);
    }

    // Refresh search index after bulk operations
    if (!dryRun) {
      const repo = connect({
        repoId: 'com.enonic.cms.default',
        branch: 'draft'
      });
      repo.refresh('SEARCH');
    }

    progress({
      info: `Migration complete. Total: ${total}, Succeeded: ${succeeded}, Failed: ${failed}${dryRun ? ' [DRY RUN]' : ''}`,
      current: total,
      total
    });
  });
};
