# lib-project, lib-export, lib-scheduler, and lib-value API Reference

> Sources:
> - https://developer.enonic.com/docs/xp/7.x/api/lib-project
> - https://developer.enonic.com/docs/xp/7.x/api/lib-export
> - https://developer.enonic.com/docs/xp/7.x/api/lib-scheduler
> - https://developer.enonic.com/docs/xp/7.x/api/lib-value

---

## lib-project

**Import:** `import projectLib from '/lib/xp/project';`
**Gradle:** `include "com.enonic.xp:lib-project:${xpVersion}"`

> Manages Content Projects (the repositories behind Content Studio). Most operations require `system.admin` or `cms.admin` role, or sufficient project permissions. Run inside an authenticated context.

### create

Creates a new Content Project.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project id (alphanumeric and hyphens) |
| displayName | string | yes | Project display name |
| parent | string | no | Parent project id for Content Layer inheritance *(XP 7.6.0+)* |
| parents | string[] | no | Parent project ids for Content Layer inheritance (replaces `parent` in latest docs) |
| description | string | no | Project description |
| language | string | no | Default project language |
| siteConfig | object[] | no | Applications with optional configurations |
| permissions | object | no | Project permissions by role (`owner`, `editor`, `author`, `contributor`, `viewer`) → principal arrays |
| readAccess | object | no | Read access settings with a `public` boolean property |
| publicRead | boolean | no | `true` to grant READ to `system.everyone` (replaces `readAccess` in latest docs) |

**Returns:** `object` — The created Content Project.

**Permissions:** `system.admin` or `cms.admin` role only.

### get

Returns an existing Content Project.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |

**Returns:** `object` — Content Project, or `null` if not found.

### list

Returns all Content Projects accessible to the current user. No parameters.

**Returns:** `object[]` — Array of Content Project objects. `system.admin`/`cms.admin` users receive all projects.

### modify

Modifies an existing Content Project. Uses an `editor` callback function.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |
| editor | function | yes | Editor callback receiving the current project; mutates and returns it |

> **Note:** In the latest docs, `modify` uses an `editor` callback pattern instead of flat field parameters. The editor receives the current project and returns the modified version.

**Returns:** `object` — The modified project.

### delete

Deletes an existing Content Project and its repository with all data.

> **Note:** Renamed to `deleteProject` in the latest docs to avoid the JavaScript reserved word. The old `delete` export is still available for backward compatibility.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |

**Returns:** `boolean` — `true` if deleted.

### addPermissions

Adds permissions to an existing Content Project.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |
| permissions | object | yes | Map of role id → array of principals |

**Returns:** `object` — All current project permissions.

### removePermissions

Removes permissions from an existing Content Project.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |
| permissions | object | yes | Map of role id → principals to remove |

**Returns:** `object` — All current project permissions.

### modifyReadAccess

Toggles public/private READ access for a Content Project.

> **Note:** Renamed to `setPublicRead` in the latest docs.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |
| readAccess | object | yes | Object with a `public` boolean property |

**Returns:** `object` — `{ id, readAccess }` with the current state.

### setPublicRead

Toggles public/private READ access for a Content Project. Replaces `modifyReadAccess`.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |
| publicRead | boolean | yes | `true` to grant READ to `system.everyone` |

**Returns:** `boolean` — Resulting public-read state.

### getAvailableApplications

Returns available applications assigned to a project and its parents. *(XP 7.11.0+)*

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Unique project identifier |

**Returns:** `string[]` — Application keys.

---

## lib-export

**Import:** `import exportLib from '/lib/xp/export';`
**Gradle:** `include "com.enonic.xp:lib-export:${xpVersion}"`

> Exports and imports nodes to/from the server-side exports directory. Available in XP 7.8.0+.

### exportNodes

Creates a node export in the exports directory.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| sourceNodePath | string | yes | — | Source nodes path |
| exportName | string | yes | — | Export name |
| includeNodeIds | boolean | no | true | Export node IDs |
| includeVersions | boolean | no | false | Export all node versions |
| nodeResolved | function | no | — | Called before export with the resolved node count |
| nodeExported | function | no | — | Called during export with the count since last call |

**Returns:** `object` — `{ exportedNodes[], exportedBinaries[], exportErrors[] }`.

### importNodes

Imports nodes from an export in the exports directory or from application resources, with optional XSLT transformation.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| source | string \| object | yes | — | Export name, or an application resource key |
| targetNodePath | string | yes | — | Target path for imported nodes |
| xslt | string \| object | no | — | XSLT file for transformation |
| xsltParams | object | no | — | Parameters for the XSLT transformation |
| includeNodeIds | boolean | no | false | Use node IDs from the import |
| includePermissions | boolean | no | false | Use permissions from the import |
| nodeResolved | function | no | — | Called during import with the node count |
| nodeImported | function | no | — | Called during import with the count since last call |

**Returns:** `object` — `{ addedNodes[], updatedNodes[], importedBinaries[], importErrors[] }`.

### list

Lists the available node exports. No parameters.

**Returns:** `object` — `{ exports: [{ name: string }] }` — names of all available exports.

---

## lib-scheduler

**Import:** `import schedulerLib from '/lib/xp/scheduler';`
**Gradle:** `include "com.enonic.xp:lib-scheduler:${xpVersion}"`

> Creates and manages scheduled jobs that run task descriptors on a CRON or one-time schedule. Available in XP 7.7.0+.

### create

Creates a new scheduled job.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Unique job name |
| description | string | no | Job description |
| descriptor | string | yes | Task descriptor identifier |
| config | object | no | Task configuration |
| schedule | object | yes | Scheduling configuration (see below) |
| user | string | no | Principal key of the submitting user |
| enabled | boolean | yes | Whether the job is active |

**`schedule` object:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| value | string | yes | Schedule value (CRON expression, ISO instant for `ONE_TIME`, or ISO-8601 duration for `FIXED_RATE`) |
| type | string | yes | `CRON`, `ONE_TIME`, or `FIXED_RATE` *(XP 8.1.0+)* |
| timeZone | string | yes for CRON | Timezone identifier (e.g. `GMT+02:00`) |
| deleteAfterRun | boolean | no | Whether the job deletes itself after running *(XP 8.1.0+, ONE_TIME only)* |

**Returns:** `ScheduledJob` — The created job.

### get

Retrieves a scheduled job by name.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Name of the job |

**Returns:** `ScheduledJob` — Job details, or `null` if not found.

### list

Retrieves all scheduled jobs. No parameters.

**Returns:** `ScheduledJob[]`

### modify

Updates an existing scheduled job.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Job name to modify |
| editor | function | yes | Callback receiving the editable job; returns the edited job |

**Returns:** `ScheduledJob` — The modified job.

### delete

Removes a scheduled job.

> **Note:** Renamed to `deleteJob` in the latest docs to avoid the JavaScript reserved word. The old `delete` export is still available for backward compatibility.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Job name to delete |

**Returns:** `boolean` — `true` if deleted.

### ScheduledJob shape

`{ name, description, descriptor, config, schedule { value, type, timeZone }, user, enabled, creator, modifier, createdTime, modifiedTime, lastRun, lastTaskId }`.

---

## lib-value

**Import:** `import valueLib from '/lib/xp/value';`
**Gradle:** `include "com.enonic.xp:lib-value:${xpVersion}"`

> Helper functions that create typed property values for use with lib-content and lib-node (e.g. when building `data` objects). Each returns a wrapper object the persistence layer stores with the correct value type.

### binary

Creates a `BinaryAttachment` value.

| Name | Type | Description |
|------|------|-------------|
| name | string | The binary name |
| stream | stream | The binary stream |

**Returns:** `BinaryAttachment`

### geoPoint

Creates a `GeoPoint` value.

| Name | Type | Description |
|------|------|-------------|
| lat | number | Latitude |
| lon | number | Longitude |

**Returns:** `GeoPoint`

### geoPointString

Creates a `GeoPoint` value from a string.

| Name | Type | Description |
|------|------|-------------|
| value | string | Comma-separated latitude and longitude |

**Returns:** `GeoPoint`

### instant

Creates an `Instant` value.

| Name | Type | Description |
|------|------|-------------|
| value | string \| Date | ISO-8601 instant, or a `Date` object |

**Returns:** `Instant`

### localDate

Creates a `LocalDate` value.

| Name | Type | Description |
|------|------|-------------|
| value | string \| Date | ISO local date (e.g. `2011-12-03`), or a `Date` object |

**Returns:** `LocalDate`

### localDateTime

Creates a `LocalDateTime` value.

| Name | Type | Description |
|------|------|-------------|
| value | string \| Date | Local date-time (e.g. `2007-12-03T10:15:30`), or a `Date` object |

**Returns:** `LocalDateTime`

### localTime

Creates a `LocalTime` value.

| Name | Type | Description |
|------|------|-------------|
| value | string \| Date | ISO local time (e.g. `10:15:30`), or a `Date` object |

**Returns:** `LocalTime`

### reference

Creates a `Reference` value.

| Name | Type | Description |
|------|------|-------------|
| value | string | Node ID (e.g. `1234-5678-91011`) |

**Returns:** `Reference`
