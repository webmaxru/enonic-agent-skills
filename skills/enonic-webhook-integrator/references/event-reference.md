# Event Reference

## Event API (lib-event)

### Dependency

Add to `build.gradle`:

```groovy
dependencies {
  include "com.enonic.xp:lib-event:${xpVersion}"
}
```

Import in controller:

```typescript
import eventLib from '/lib/xp/event';
```

### listener(params)

Creates an event listener.

**Parameters:**

| Key        | Type     | Description                                                              |
|------------|----------|--------------------------------------------------------------------------|
| type       | string   | Pattern: `.` is literal, `*` matches any sequence. Example: `node.*`     |
| callback   | function | Function receiving the event object                                      |
| localOnly  | boolean  | If `true`, only local events; default `false`                            |

**Returns:** `null`

**Example:**

```typescript
eventLib.listener({
  type: 'node.*',
  localOnly: false,
  callback: (event) => {
    log.info('event: %s', JSON.stringify(event));
  }
});
```

### send(params)

Sends a custom event (prefixed with `custom.`).

**Parameters:**

| Key         | Type    | Description                              |
|-------------|---------|------------------------------------------|
| type        | string  | Event type (auto-prefixed `custom.`)     |
| distributed | boolean | `true` to distribute across cluster      |
| data        | object  | Additional event payload                 |

**Example:**

```typescript
eventLib.send({
  type: 'myEvent',
  distributed: false,
  data: { a: 1, b: 2 }
});
```

## Node Event Types

Node events are emitted when repository nodes (including content) change.

| Event Type      | Description                                      |
|-----------------|--------------------------------------------------|
| node.created    | A node was created                               |
| node.updated    | A node was updated                               |
| node.deleted    | A node was deleted                               |
| node.pushed     | A node was pushed (published) to another branch   |
| node.duplicated | A node was duplicated                            |
| node.moved      | A node was moved or renamed                      |
| node.sorted     | A node's children sort order changed             |
| node.stateUpdated | A node's state was updated                     |

### Event Object Structure

```json
{
  "type": "node.pushed",
  "timestamp": 1490091051699,
  "localOrigin": true,
  "distributed": true,
  "data": {
    "nodes": [
      {
        "id": "e1f57280-d672-4cd8-b674-98e26e5b69ae",
        "path": "/content/mysite/blog/my-post",
        "branch": "master",
        "repo": "com.enonic.cms.default"
      }
    ]
  }
}
```

### Path Filtering

Filter events by inspecting `event.data.nodes[].path`:

```typescript
eventLib.listener({
  type: 'node.pushed',
  callback: (event) => {
    const nodes = event.data.nodes || [];
    const blogNodes = nodes.filter(n => n.path.startsWith('/content/mysite/blog'));
    if (blogNodes.length > 0) {
      // process only blog content
    }
  }
});
```

### Branch Filtering

Filter by branch when only master (published) or draft events matter:

```typescript
const masterNodes = nodes.filter(n => n.branch === 'master');
```

## Task API (lib-task)

### Dependency

```groovy
dependencies {
  include "com.enonic.xp:lib-task:${xpVersion}"
}
```

Import:

```typescript
import taskLib from '/lib/xp/task';
```

### executeFunction(params)

Executes a function asynchronously in the background.

**Parameters:** Object with `description` (string) and `func` (function).

**Returns:** `string` — Task ID.

```typescript
const taskId = taskLib.executeFunction({
  description: 'CDN cache invalidation',
  func: () => {
    taskLib.progress({ info: 'Starting invalidation' });
    invalidateCdnPaths(paths);
    taskLib.progress({ info: 'Completed' });
  }
});
```

### submitTask(params)

Submits a named task (defined by a task descriptor XML and controller) for asynchronous execution.

**Parameters:** Object with `descriptor` (string — `<appKey>:<taskName>`), `config` (object — task configuration properties).

**Returns:** `string` — Task ID.

```typescript
const taskId = taskLib.submitTask({
  descriptor: 'com.example.myapp:sync-content',
  config: {
    sourceUrl: 'https://api.example.com/content',
    batchSize: '100'
  }
});
```

### progress(params)

Reports progress from inside a running task.

**Parameters:** Object with `info` (string), `current` (number), `total` (number).

### list(params?)

Returns running tasks. Optional filter by `name` and `state`.

### Task Events

| Event Type     | Description         |
|----------------|---------------------|
| task.submitted | Task was submitted  |
| task.updated   | Task was updated    |
| task.finished  | Task completed      |
| task.failed    | Task failed         |

## Application Lifecycle Events

Events emitted when applications start or stop:

| Event Type             | Description                    |
|------------------------|--------------------------------|
| application.started    | An application was started     |
| application.stopped    | An application was stopped     |
| application.installed  | An application was installed   |
| application.uninstalled| An application was uninstalled |

## Event use cases

Common patterns for events in Enonic XP:
- **Cache invalidation:** Listen for `node.pushed` to purge CDN or local caches.
- **Notifications:** Combine with websockets to push real-time updates to connected clients.
- **Job triggering:** Kick off reindexing, report generation, or external sync on content changes.
