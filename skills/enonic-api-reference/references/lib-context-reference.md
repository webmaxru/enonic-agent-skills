# lib-context, lib-event, and lib-task API Reference

> Sources:
> - https://developer.enonic.com/docs/xp/stable/api/lib-context
> - https://developer.enonic.com/docs/xp/stable/api/lib-event
> - https://developer.enonic.com/docs/xp/stable/api/lib-task

---

## lib-context

**Import:** `import contextLib from '/lib/xp/context';`
**Gradle:** `include "com.enonic.xp:lib-context:${xpVersion}"`

### get

Returns the current context.

**Returns:** `GetContext` — `{ branch, repository, authInfo: { user?, principals[] }, attributes? }`.

```js
const context = contextLib.get();
```

### run

Runs a function inside a custom context. Commonly used for accessing repositories or overriding permissions.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| context | RunContext | Context to use |
| callback | function | Function to execute |

**Returns:** Result of the callback execution.

**RunContext shape:**
```js
{
  repository: "some.repo.name",
  branch: "master",
  user: { login: "mylogin", idProvider: "idprovidername" },
  principals: ["role:system.admin"],
  attributes: { /* custom attributes (XP 7.8.0+) */ }
}
```

---

## lib-event

**Import:** `import eventLib from '/lib/xp/event';`
**Gradle:** `include "com.enonic.xp:lib-event:${xpVersion}"`

### listener

Creates an event listener.

**Parameters (object):**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | string | | Pattern to match event types (`.` = literal dot, `*` = any sequence) |
| callback | function | | Callback event listener |
| localOnly | boolean | false | Local events only |

**Returns:** null

```js
eventLib.listener({
    type: 'node.*',
    localOnly: false,
    callback: (event) => { log.info('event: %s', JSON.stringify(event)); }
});
```

### send

Sends a custom event. All custom events are prefixed with `custom.`.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| type | string | Event type |
| distributed | boolean | Distribute in cluster |
| data | object | Additional data |

**Returns:** null

```js
eventLib.send({ type: 'myEvent', distributed: false, data: { a: 1, b: 2 } });
```

---

## lib-task

**Import:** `import taskLib from '/lib/xp/task';`
**Gradle:** `include "com.enonic.xp:lib-task:${xpVersion}"`

### get

Returns state and progress for a specified task.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| taskId | string | Id of the task |

**Returns:** `TaskInfo` or null.

### isRunning

Checks if any task with the given name or id is currently running.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| task | string | Name or id |

**Returns:** `boolean`

### list

Returns the list of running tasks (aggregated on clustered environments).

**Parameters (object, optional):**

| Name | Type | Description |
|------|------|-------------|
| name | string | Filter by task name |
| state | string | Filter by state |

**Returns:** `TaskInfo[]`

### progress

Reports progress from an executing task. Must be called within a task context.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| info | string | Progress info message |
| current | number | Current progress value |
| total | number | Total items |

**Returns:** void

### sleep

Pauses execution for the specified milliseconds. Only works inside a task.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| timeMillis | number | Milliseconds to sleep |

**Returns:** void

### executeFunction

Executes a function in the background. Returns immediately.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| description | string | Task description |
| func | function | Callback to execute asynchronously |

**Returns:** `string` — Task id.

### submitTask

Submits a named task to be executed in the background.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| descriptor | string | Task descriptor (e.g., `job42` or `com.enonic.app.myapp:work`) |
| config | object | Task configuration |

**Returns:** `string` — Task id.

### TaskInfo

| Field | Type | Description |
|-------|------|-------------|
| id | string | Task id |
| name | string | Task name |
| description | string | Description |
| state | string | WAITING, RUNNING, FINISHED, or FAILED |
| application | string | Application key |
| user | string | User who submitted |
| startTime | string | ISO-8601 timestamp |
| progress | object | `{ info, current, total }` |
| node | string | Cluster node |

### Events

| Event | Description |
|-------|-------------|
| task.submitted | Task is submitted |
| task.updated | Task is updated |
| task.removed | Task is removed |
| task.finished | Task completes |
| task.failed | Task fails |
