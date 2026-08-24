# lib-node API Reference

> Source: https://developer.enonic.com/docs/xp/7.x/api/lib-node

**Import:** `import nodeLib from '/lib/xp/node';`
**Gradle:** `include "com.enonic.xp:lib-node:${xpVersion}"`

## Functions

### connect

Creates a connection to a repository with a given branch and authentication info.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| params | Source | Object with connection parameters |

**Returns:** `RepoConnection`

```js
import {connect} from '/lib/xp/node';
const connection = connect({ repoId: 'my-repo', branch: 'master' });
```

### multiRepoConnect

Creates a connection to several repositories.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| sources | Source[] | Array of repository source objects |

**Returns:** `MultiRepoConnection`

## MultiRepoConnection

### query

Queries nodes across multiple repositories.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| start | number | no | 0 | Start index for paging |
| count | number | no | 10 | Number to fetch |
| query | string/object | yes | | Query string or DSL |
| filters | object | no | | Query filters |
| sort | string | no | _score DESC | Sorting expression |
| aggregations | object | no | | Aggregations config |
| highlight | object | no | | Highlighting config |
| explain | boolean | no | | Include score explanation |

**Returns:** `object` — `{ total, count, hits[] }` where each hit includes `repoId` and `branch`.

## RepoConnection

All methods below are called on a `RepoConnection` object obtained via `connect()`.

### commit

Commits the active version of nodes.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| keys | string/string[] | yes | Node keys (id or path) |
| message | string | no | Commit message |

**Returns:** `object` — Commit object(s) with `id`, `message`, `committer`, `timestamp`.

### create

Creates a node.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| _name | string | no | Name of content |
| _parentPath | string | no | Path to place content under |
| _indexConfig | object | no | Index configuration (default: byType) |
| _permissions | object | no | ACL for the node |
| _inheritsPermissions | boolean | no | Inherit parent permissions (default: false) |
| _manualOrderValue | number | no | Manual ordering value |
| _childOrder | string | no | Default child ordering |

**Returns:** `object` — Created node.

### delete

Deletes node(s).

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| keys | string/string[] | Node keys (id or path) |

**Returns:** `string[]` — Keys of deleted nodes.

### diff

Resolves differences for a node between current and target branch.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id |
| target | string | yes | Branch to differentiate with |
| includeChildren | boolean | no | Resolve for all children |

**Returns:** `object` — `{ diff[] }` with `id` and `status` per node.

### duplicate

Duplicates a node. *(XP 7.12.0+)*

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| nodeId | string | yes | | Node id |
| name | string | no | | New node name |
| includeChildren | boolean | no | true | Duplicate children too |
| parent | string | no | | Destination parent path |
| refresh | string | no | | Refresh mode |
| dataProcessor | function | no | | Node data processor callback |

**Returns:** `object` — Duplicated node.

### exists

Checks if a node exists.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or id |

**Returns:** `boolean`

### findChildren

Fetches children of a node.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| parentKey | string | yes | | Path or ID of parent |
| start | number | no | 0 | Start index |
| count | number | no | 10 | Number to fetch |
| childOrder | string | no | | Ordering (default: parent value) |
| countOnly | boolean | no | false | Count only |
| recursive | boolean | no | false | Recursive fetch |

**Returns:** `object` — `{ total, count, hits[] }`.

### getVersions

Fetches versions of a node with cursor-based pagination.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | yes | | Path or ID |
| count | number | no | 10 | Number to fetch |
| cursor | string | no | | Cursor for pagination |

**Returns:** `object` — `{ total, count, cursor, hits[] }` with `versionId`, `nodeId`, `nodePath`, `timestamp`.

### get

Fetches node(s) by path or ID.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| params | string/string[]/object | One or more node identifiers, or object with `key` and optional `versionId` |

**Returns:** `object` — Node or node array as JSON.

### getActiveVersion

Fetches the active version of a node.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or ID |

**Returns:** `object` — Active version info.

### getBinary

Returns a binary stream.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or ID |
| binaryReference | string | Binary reference |

**Returns:** `stream`

### getCommit

Returns a node version commit. *(XP 7.7.0+)*

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| id | string | Commit ID |

**Returns:** `object` — `{ id, message, committer, timestamp }`.

### update

Updates a node. *(Renamed from `modify`, which is still exported for backward compatibility.)*

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or ID |
| editor | function | Editor callback |

**Returns:** `object` — Modified node.

### patch

Applies a patch to a node. Low-level function — use with caution.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or ID |
| editor | function | yes | Patcher callback |
| branches | string[] | no | Branches to patch (default: current branch) |

**Returns:** `object` — Patch result.

### move

Renames or moves a node.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| source | string | Path or id of node |
| target | string | New path or name (trailing `/` means parent path) |

**Returns:** `boolean`

### push

Pushes a node to a given branch.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | no | | Id or path |
| keys | string[] | no | | Array of ids or paths |
| target | string | yes | | Branch to push to |
| includeChildren | boolean | no | false | Push children |
| resolve | boolean | no | true | Resolve dependencies |
| exclude | string[] | no | | Nodes to exclude |

**Returns:** `object` — `{ success[], failed[], deleted[] }`.

### query

Queries nodes.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| start | number | no | 0 | Start index |
| count | number | no | 10 | Number to fetch |
| query | string/object | yes | | Query string or DSL |
| filters | object | no | | Query filters |
| sort | string/object | no | _score DESC | Sorting |
| aggregations | object | no | | Aggregations config |
| highlight | object | no | | Highlighting config |
| explain | boolean | no | | Include score explanation |

**Returns:** `object` — `{ total, count, hits[], aggregations }`.

### refresh

Refreshes indices.

**Parameters:**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| mode | string | ALL | ALL, SEARCH, or STORAGE |

### sort

Sorts the children of a node by changing the parent's `_childOrder`. When set to manual ordering, children are reordered by `_manualOrderValue`.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or ID of the parent |
| childOrder | string | New child order expression |

**Returns:** `object` — The updated parent node and array of `reorderedNodes`.

### applyPermissions

Applies permissions on a node.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or ID |
| permissions | AccessControlEntry[] | no | Overwrite current permissions (cannot combine with add/remove) |
| addPermissions | AccessControlEntry[] | no | Permissions to add |
| removePermissions | AccessControlEntry[] | no | Permissions to remove |
| scope | string | no | `SINGLE`, `TREE`, or `SUBTREE` |

**Returns:** `object` — Applied permissions result.

### setActiveVersion

Sets the active version of a node.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Path or ID |
| versionID | string | Version to set as active |

**Returns:** `boolean`

## Type Definitions

### Source

| Field | Type | Description |
|-------|------|-------------|
| repoId | string | Repository ID |
| branch | string | Branch ID |
| user | User | Optional user for connection |
| principals | string[] | Additional principals |

### User

| Field | Type | Description |
|-------|------|-------------|
| login | string | User ID |
| idProvider | string | Optional ID provider |

## Events

| Event | Description |
|-------|-------------|
| node.created | A node is created |
| node.deleted | A node is deleted |
| node.pushed | A node is pushed to a different branch |
| node.duplicated | A node is duplicated |
| node.updated | A node is updated |
| node.moved | A node is moved |
| node.renamed | A node is renamed |
| node.sorted | A node is sorted |
| node.stateUpdated | A node state is updated |
