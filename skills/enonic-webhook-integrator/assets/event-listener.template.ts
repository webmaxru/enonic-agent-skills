/**
 * Event Listener Template for Enonic XP
 *
 * Place this logic in the application's main.ts (or main.js) controller.
 * The main controller runs once when the application starts,
 * ensuring the listener is registered for the application's lifetime.
 *
 * Note: This template uses TypeScript/ESM syntax. For .js targets, convert
 * `import X from 'Y'` to `var X = require('Y')` and `export function` to
 * `exports.xxx = function`.
 *
 * Customize:
 *   - EVENT_TYPE: the event pattern to listen for
 *   - PATH_PREFIX: content path prefix to filter on
 *   - The processing logic inside the callback
 */

import eventLib from '/lib/xp/event';
import taskLib from '/lib/xp/task';

// Configure the event type pattern
// Examples: 'node.pushed', 'node.created', 'node.updated', 'node.deleted', 'node.*'
const EVENT_TYPE = 'node.pushed';

// Filter only events under this content path (empty string = no filter)
const PATH_PREFIX = '/content/';

eventLib.listener({
  type: EVENT_TYPE,
  localOnly: true,  // set false to receive cluster-wide events
  callback: (event) => {
    const nodes = (event.data.nodes || []).filter((n) => {
      if (PATH_PREFIX && !n.path.startsWith(PATH_PREFIX)) return false;
      // Optional: filter by branch (e.g., only master = published content)
      // if (n.branch !== 'master') return false;
      return true;
    });

    if (nodes.length === 0) return;

    // Delegate heavy work to a background task to avoid blocking the event thread
    taskLib.executeFunction({
      description: 'Handle ' + EVENT_TYPE + ' for ' + nodes.length + ' nodes',
      func: () => {
        nodes.forEach((node, idx) => {
          taskLib.progress({
            info: 'Processing ' + node.path,
            current: idx,
            total: nodes.length
          });

          // --- Replace with actual integration logic ---
          log.info('Processing node: %s (id: %s)', node.path, node.id);
          // --- End integration logic ---
        });

        taskLib.progress({
          info: 'Completed',
          current: nodes.length,
          total: nodes.length
        });
      }
    });
  }
});

log.info('Event listener registered for type: %s', EVENT_TYPE);
