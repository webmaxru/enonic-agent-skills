# Integration Examples

## Example 1: CDN Cache Invalidation on Content Publish

Listen for `node.pushed` events and send cache purge requests to an external CDN.

### main.ts

```typescript
import eventLib from '/lib/xp/event';
import taskLib from '/lib/xp/task';
import httpClient from '/lib/http-client';

const CDN_PURGE_URL = app.config['cdn.purge.url'] || '';
const CDN_API_KEY = app.config['cdn.api.key'] || '';

eventLib.listener({
  type: 'node.pushed',
  localOnly: true,
  callback: (event) => {
    const nodes = (event.data.nodes || []).filter(
      (n) => n.branch === 'master' && n.path.startsWith('/content/')
    );
    if (nodes.length === 0) return;

    const paths = nodes.map((n) => n.path);

    taskLib.executeFunction({
      description: 'CDN cache purge for ' + paths.length + ' paths',
      func: () => {
        taskLib.progress({ info: 'Sending purge request', current: 0, total: 1 });
        try {
          const response = httpClient.request({
            url: CDN_PURGE_URL,
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + CDN_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ paths: paths }),
            connectionTimeout: 5000,
            readTimeout: 10000
          });
          if (response.status >= 200 && response.status < 300) {
            log.info('CDN purge succeeded for %d paths', paths.length);
          } else {
            log.error('CDN purge failed: %s', response.status);
          }
        } catch (e) {
          log.error('CDN purge error: %s', e.message);
        }
        taskLib.progress({ info: 'Completed', current: 1, total: 1 });
      }
    });
  }
});
```

### Application Config

`XP_HOME/config/<appKey>.cfg`:

```properties
cdn.purge.url = https://api.cdn-provider.com/purge
cdn.api.key = your-cdn-api-key
```

---

## Example 2: Slack Notification on Content Publish

```typescript
import eventLib from '/lib/xp/event';
import httpClient from '/lib/http-client';

const SLACK_WEBHOOK_URL = app.config['slack.webhook.url'] || '';

eventLib.listener({
  type: 'node.pushed',
  localOnly: true,
  callback: (event) => {
    const masterNodes = (event.data.nodes || []).filter(
      (n) => n.branch === 'master' && n.path.startsWith('/content/')
    );
    if (masterNodes.length === 0 || !SLACK_WEBHOOK_URL) return;

    const paths = masterNodes.map((n) => n.path).join('\n');
    try {
      httpClient.request({
        url: SLACK_WEBHOOK_URL,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ':rocket: Content published:\n' + paths
        }),
        connectionTimeout: 5000,
        readTimeout: 5000
      });
    } catch (e) {
      log.error('Slack notification failed: %s', e.message);
    }
  }
});
```

---

## Example 3: Search Index Update on Content Change

```typescript
import eventLib from '/lib/xp/event';
import taskLib from '/lib/xp/task';
import httpClient from '/lib/http-client';

const SEARCH_API_URL = app.config['search.api.url'] || '';
const SEARCH_API_KEY = app.config['search.api.key'] || '';

eventLib.listener({
  type: 'node.*',
  localOnly: true,
  callback: (event) => {
    if (!['node.pushed', 'node.deleted'].includes(event.type)) return;

    const nodes = (event.data.nodes || []).filter(
      (n) => n.path.startsWith('/content/')
    );
    if (nodes.length === 0) return;

    taskLib.executeFunction({
      description: 'Search index sync: ' + event.type,
      func: () => {
        nodes.forEach((node, idx) => {
          taskLib.progress({
            info: 'Processing ' + node.path,
            current: idx,
            total: nodes.length
          });

          const action = event.type === 'node.deleted' ? 'DELETE' : 'PUT';
          try {
            httpClient.request({
              url: SEARCH_API_URL + '/documents/' + encodeURIComponent(node.id),
              method: action,
              headers: {
                'Authorization': 'Bearer ' + SEARCH_API_KEY,
                'Content-Type': 'application/json'
              },
              body: action === 'PUT' ? JSON.stringify({ id: node.id, path: node.path }) : '',
              connectionTimeout: 5000,
              readTimeout: 10000
            });
          } catch (e) {
            log.error('Search sync failed for %s: %s', node.path, e.message);
          }
        });
        taskLib.progress({ info: 'Completed', current: nodes.length, total: nodes.length });
      }
    });
  }
});
```

---

## Example 4: Inbound Webhook — DAM Sync

An HTTP service that receives payloads from an external DAM and creates media content in Enonic XP.

### services/dam-sync/dam-sync.ts

```typescript
import contentLib from '/lib/xp/content';
import contextLib from '/lib/xp/context';

const EXPECTED_API_KEY = app.config['dam.sync.apiKey'] || '';

export function post(req) {
  const apiKey = req.headers['X-Api-Key'] || req.headers['x-api-key'] || '';
  if (apiKey !== EXPECTED_API_KEY) {
    return { status: 401, body: JSON.stringify({ error: 'Unauthorized' }), contentType: 'application/json' };
  }

  let payload;
  try {
    payload = JSON.parse(req.body);
  } catch (e) {
    return { status: 400, body: JSON.stringify({ error: 'Invalid JSON' }), contentType: 'application/json' };
  }

  if (!payload.assetId || !payload.assetUrl) {
    return { status: 400, body: JSON.stringify({ error: 'Missing required fields' }), contentType: 'application/json' };
  }

  try {
    contextLib.run({ branch: 'draft', user: { login: 'su', idProvider: 'system' } }, () => {
      contentLib.create({
        name: payload.assetId,
        parentPath: '/media/dam-imports',
        displayName: payload.assetName || payload.assetId,
        contentType: 'media:unknown',
        data: { sourceUrl: payload.assetUrl, sourceId: payload.assetId }
      });
    });
  } catch (e) {
    log.error('DAM sync content creation failed: %s', e.message);
    return { status: 500, body: JSON.stringify({ error: 'Internal error' }), contentType: 'application/json' };
  }

  return { status: 200, body: JSON.stringify({ status: 'ok' }), contentType: 'application/json' };
}
```
