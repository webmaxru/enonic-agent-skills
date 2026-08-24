# lib-sse API Reference

> Source: https://developer.enonic.com/docs/xp/7.x/api/lib-sse

**Import:** `import sseLib from '/lib/xp/sse';`
**Gradle:** `include "com.enonic.xp:lib-sse:${xpVersion}"`

> Server-Sent Events functions. Unlike `lib-websocket`, every function takes a single object parameter.

## Message Shape

The `send` and `sendToGroup` functions accept a `message` object:

| Field | Type | Description |
|-------|------|-------------|
| event | string | Event name (optional) |
| data | string | Event payload. A message with no `data` does not dispatch a client event, but any `id` still updates the client's last-event-id buffer |
| id | string | Event id for `Last-Event-ID` reconnection tracking |
| comment | string | SSE comment line — ignored by clients, useful for keep-alive pings |

## Functions

### send

Sends a message to a specific SSE connection. Safe no-op when the connection is closed.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientId | string | yes | Client id from the `open` event |
| message | object | yes | Message to send (see Message Shape) |

**Returns:** `void`

```ts
import {send} from '/lib/xp/sse';

send({clientId: clientId, message: {event: 'message', data: 'Hello!'}});
```

### sendToGroup

Broadcasts a message to all connections in a named group.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| group | string | yes | Group name |
| message | object | yes | Message to send (see Message Shape) |

**Returns:** `void`

### close

Closes an SSE connection. The connection's `sseEvent` function will receive a `close` event.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientId | string | yes | Client id |

**Returns:** `void`

### isOpen

Checks whether an SSE connection is still open. Use to abort expensive work when the client has disconnected.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| clientId | string | yes | Client id |

**Returns:** `boolean` — `true` if the connection is still open.

```ts
import {isOpen, send} from '/lib/xp/sse';

for (let i = 0; i < 10; i++) {
    if (!isOpen({clientId: clientId})) {
        break;
    }
    const data = computeExpensiveData(i);
    send({clientId: clientId, message: {event: 'update', data: data}});
}
```

### addToGroup

Adds a connection to a named group.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| group | string | yes | Group name |
| clientId | string | yes | Client id |

**Returns:** `void`

### removeFromGroup

Removes a connection from a named group.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| group | string | yes | Group name |
| clientId | string | yes | Client id |

**Returns:** `void`

### getGroupSize

Returns the number of connections in a group.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| group | string | yes | Group name |

**Returns:** `number`
