// Bulk Update Controller Template
// Adapt this template for batch content update operations in Enonic XP.
// Replace placeholders marked with [PLACEHOLDER] before use.

import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';
import { connect } from '/lib/xp/node';
import { executeFunction, progress, isRunning } from '/lib/xp/task';

const TASK_DESCRIPTION = '[PLACEHOLDER: Describe the migration task]';
const BATCH_SIZE = 100;

export function run(): string {
  if (isRunning(TASK_DESCRIPTION)) {
    log.warning('Task already running: %s', TASK_DESCRIPTION);
    return '';
  }

  return executeFunction({
    description: TASK_DESCRIPTION,
    func: () => {
      contextLib.run({
        repository: 'com.enonic.cms.default',
        branch: 'draft',
        principals: ['role:system.admin']
      }, () => {
        const query = "[PLACEHOLDER: NoQL query string]";
        const totalResult = contentLib.query({ count: 0, query });
        const total = totalResult.total;

        if (total === 0) {
          progress({ info: 'No items match the query', current: 0, total: 0 });
          return;
        }

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

          if (result.hits.length === 0) break;

          result.hits.forEach((hit) => {
            try {
              contentLib.modify({
                key: hit._id,
                editor: (content) => {
                  // [PLACEHOLDER: Apply modifications]
                  // content.data.field = 'new value';
                  return content;
                }
              });
              updated++;
            } catch (e) {
              log.error('Failed to update %s: %s', hit._path, (e as Error).message);
              failed++;
            }
          });

          start += BATCH_SIZE;
          progress({
            info: `Updated: ${updated}, Failed: ${failed}`,
            current: updated + failed,
            total
          });
        }

        // Publish updated items
        if (updated > 0) {
          const updatedItems = contentLib.query({
            count: updated,
            query
          });

          const batchKeys: string[][] = [];
          const ids = updatedItems.hits.map(h => h._id);

          for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            batchKeys.push(ids.slice(i, i + BATCH_SIZE));
          }

          batchKeys.forEach((batch) => {
            try {
              contentLib.publish({
                keys: batch,
                sourceBranch: 'draft',
                targetBranch: 'master',
                includeDependencies: false
              });
            } catch (e) {
              log.error('Publish batch failed: %s', (e as Error).message);
            }
          });
        }

        progress({
          info: `Complete. Updated: ${updated}, Failed: ${failed}`,
          current: total,
          total
        });
      });
    }
  });
}
