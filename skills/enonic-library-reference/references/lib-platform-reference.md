# lib-admin, lib-app, lib-auditlog, lib-cluster, lib-common, lib-grid, and lib-vhost API Reference

> Sources:
> - https://developer.enonic.com/docs/xp/7.x/api/lib-admin
> - https://developer.enonic.com/docs/xp/7.x/api/lib-app
> - https://developer.enonic.com/docs/xp/7.x/api/lib-auditlog
> - https://developer.enonic.com/docs/xp/7.x/api/lib-cluster
> - https://developer.enonic.com/docs/xp/7.x/api/lib-common
> - https://developer.enonic.com/docs/xp/7.x/api/lib-grid
> - https://developer.enonic.com/docs/xp/7.x/api/lib-vhost

---

## lib-admin

**Import:** `import adminLib from '/lib/xp/admin';`
**Gradle:** `include "com.enonic.xp:lib-admin:${xpVersion}"`

> URLs, locales, and metadata for building admin tools and admin-embedded widgets. Most functions take no parameters.

| Function | Returns | Description |
|----------|---------|-------------|
| getAssetsUri() | string | URI for accessing admin assets |
| getBaseUri() | string | Base URI for the admin interface |
| getInstallation() | string | Installation name/identifier |
| getLauncherPath() | string | URL of the Launcher panel JS script (for embedding) |
| getLauncherUrl() | string | URL to the Launcher panel |
| getLocale() | string | Preferred locale from the HTTP request, falling back to server default |
| getLocales() | string[] | All preferred locales from the request, in order of preference |
| getPhrases() | object | All i18n translation phrases as a JSON object |
| getVersion() | string | Version number of the XP runtime |

### getHomeToolUrl

Supplies the URL for the Home administrative tool.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | string | yes | `server` (relative) or `absolute` |

**Returns:** `string`

### getToolUrl

Retrieves the URL to an administrative tool within an application.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Full application key (e.g. `com.enonic.app.myapp`) |
| tool | string | yes | Tool name within the app (e.g. `main`) |

**Returns:** `string`

### extensionUrl

Returns the URL for an admin extension.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key that provides the extension |
| extension | string | yes | Name of the extension |
| type | string | no | `server` (default) or `absolute` |
| params | object | no | Custom query parameters |

**Returns:** `string`

### setTopic

Sets the state of an admin events topic owned by this application. *(XP 8.1.0+)*

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Local topic name (1-255 chars, no `:`, no whitespace) |
| allow | string/string[] | yes | Principal keys allowed to subscribe. Empty array clears registration |

**Returns:** `string` — Canonical topic name (`<application-key>:<name>`).

### sendToTopic

Publishes a message to an admin events topic owned by this application. *(XP 8.1.0+)*

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Local topic name |
| message | any | no | JSON-serializable data. Defaults to empty object |

**Returns:** void

### widgetUrl

> **Deprecated** — use `extensionUrl` instead. Will be removed in future versions.

Returns the URL for a widget. Equivalent to calling `extensionUrl` with `extension` set to the widget name.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| widget | string | yes | Widget name |
| type | string | no | `server` or `absolute` |
| params | object | no | Custom query parameters |

**Returns:** `string`

---

## lib-app

**Import:** `import appLib from '/lib/xp/app';`
**Gradle:** `include "com.enonic.xp:lib-app:${xpVersion}"`

> Inspect installed applications and manage virtual applications. Virtual-application operations require the `system.schema.admin` role.

### get

Returns an installed application by key. Local applications take precedence over virtual ones.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Application key |

**Returns:** `Application | null`

### list

Fetches all installed applications. No parameters.

**Returns:** `Application[]`

### getDescriptor

Returns the descriptor of an installed application.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Application key |

**Returns:** `ApplicationDescriptor` — `{ key, description, icon }`.

### getApplicationMode

Fetches the mode of an application.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Application key |

**Returns:** `string` — one of `bundled`, `virtual`, `augmented`.

### createVirtualApplication

Creates a virtual application and its schema repository nodes. Requires `system.schema.admin`.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Application key |

**Returns:** `Application`

### deleteVirtualApplication

Removes a virtual application. Requires `system.schema.admin`.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Application key |

**Returns:** `boolean`

**`Application` shape:** `{ key, displayName, vendorName, vendorUrl, url, version, systemVersion, minSystemVersion, maxSystemVersion, modifiedTime, started, system }`.

---

## lib-auditlog

**Import:** `import auditlogLib from '/lib/xp/auditlog';`
**Gradle:** `include "com.enonic.xp:lib-auditlog:${xpVersion}"`

> Read and write the system audit log. Available in XP 7.2.0+. Writing/reading requires the `system.auditlog` role.

### log

Creates a new audit log entry.

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| type | string | yes | — | Type of log entry |
| time | string | no | Now | Entry timestamp (ISO 8601) |
| source | string | no | Application id | Log entry source |
| user | string | no | Context user | User key for the entry |
| objects | string[] | no | `[]` | URIs of related objects |
| data | object | no | `{}` | Custom metadata |

**Returns:** `object` — The created audit log entry.

### get

Retrieves a single audit log entry by ID.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | ID of the audit log entry |

**Returns:** `object` — The entry, as JSON.

### find

Searches for entries in the audit log.

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| start | number | no | 0 | Start index for paging |
| count | number | no | 10 | Number of entries to fetch |
| ids | string[] | no | — | Filter by entry IDs |
| from | string | no | — | Filter entries from this timestamp |
| to | string | no | — | Filter entries up to this timestamp |
| type | string | no | — | Filter by entry type |
| source | string | no | — | Filter by source |
| users | string[] | no | — | Filter by user keys |
| objects | string[] | no | — | Filter by object URIs |

**Returns:** `object` — `{ total, count, hits[] }`.

---

## lib-cluster

**Import:** `import clusterLib from '/lib/xp/cluster';`
**Gradle:** `include "com.enonic.xp:lib-cluster:${xpVersion}"`

### isMaster

Tests whether the current node is the master node in a cluster. A cluster with multiple master nodes returns `true` only on the elected node. Use to run initialization or scheduled work exactly once across a cluster. No parameters.

**Returns:** `boolean`

---

## lib-common

**Import:** `import commonLib from '/lib/xp/common';`
**Gradle:** `include "com.enonic.xp:lib-common:${xpVersion}"`

### sanitize

Transforms text to be safely used in restricted-character contexts such as content names, node names, principal names, URLs, or file paths (lowercases, replaces spaces/punctuation with hyphens, strips diacritics and unsafe characters).

| Name | Type | Required | Description |
|------|------|----------|-------------|
| text | string | yes | Text to sanitize |

**Returns:** `string` — The sanitized text.

```javascript
sanitize("Piña CØLADÆ"); // "pina-coladae"
```

---

## lib-grid

**Import:** `import gridLib from '/lib/xp/grid';`
**Gradle:** `include "com.enonic.xp:lib-grid:${xpVersion}"`

> Cluster-wide shared maps for coordinating state across nodes. Available in XP 7.10.0+.

### getMap

Returns a `SharedMap` instance for the specified map identifier.

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Map identifier |

**Returns:** `SharedMap`

**SharedMap methods:**

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| set(params) | `{ key, value, ttlSeconds }` | void | Add/update an entry. `ttlSeconds`: `0` or negative = infinite |
| get(key) | key: string | value \| null | Retrieve a value, or `null` if absent |
| delete(key) | key: string | void | Remove an entry if present |
| modify(params) | `{ key, func, ttlSeconds }` | value \| null | Compute a new value from the current one; `func` receives the current value (or null) and returns the new value (or null to remove) |

Values may be `string`, `number`, `boolean`, JSON object, or `null`.

---

## lib-vhost

**Import:** `import vhostLib from '/lib/xp/vhost';`
**Gradle:** `include "com.enonic.xp:lib-vhost:${xpVersion}"`

> Inspect virtual-host mappings from `com.enonic.xp.web.vhost.cfg`. Available in XP 7.6.0+.

### isEnabled

Determines whether virtual-host mapping is activated in the configuration file. No parameters.

**Returns:** `boolean`

### list

Retrieves all virtual-host mappings defined in the configuration file. No parameters.

**Returns:** `object` — `{ vhosts: [ { name, source, target, host, defaultIdProviderKey, idProviderKeys: [{ idProviderKey }] } ] }`.
