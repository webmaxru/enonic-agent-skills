# lib-content API Reference

> Source: https://developer.enonic.com/docs/xp/stable/api/lib-content

**Import:** `import contentLib from '/lib/xp/content';`
**Gradle:** `include "com.enonic.xp:lib-content:${xpVersion}"`

## Constants

- **CONTENT_ROOT_PATH** — NodePath describing content node root path (`/content`).
- **ARCHIVE_ROOT_PATH** — NodePath describing archive node root path (`/archive`).

## Functions

### addAttachment

Adds an attachment to an existing content.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| name | string | yes | Attachment name (unique within the content) |
| mimeType | string | yes | Attachment content type |
| label | string | no | Attachment label |
| data | object | no | Stream with the binary data for the attachment |

**Returns:** void

### archive

Archives a content. *(XP 7.8.0+)*

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | string | yes | Path or id of the content to be archived |

**Returns:** `string[]` — List with ids of the contents that were archived.

### create

Creates a content. Either `name` or `displayName` (or both) must be specified.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| name | string | no | | Name of content |
| parentPath | string | yes | | Path to place content under |
| displayName | string | no | | Display name. Default is same as name |
| requireValid | boolean | no | true | Content must be valid to be created |
| refresh | boolean | no | true | If true, content is immediately searchable |
| contentType | string | yes | | Content type to use |
| language | string | no | | Language tag for the content's locale |
| childOrder | string | no | | Default ordering of children |
| data | object | yes | | Actual content data |
| x | object | no | | eXtra data to use |
| workflow | object | no | | Workflow information (default: state READY) |

**Returns:** `object` — Created content as JSON.

**Error codes:** `contentAlreadyExists` — thrown if content with same name exists at path.

### createMedia

Creates a media content.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| name | string | no | | Name of content |
| parentPath | string | no | / | Path to place content under |
| mimeType | string | no | | Mime-type of the data |
| focalX | number | no | | Focal point for X axis (if image) |
| focalY | number | no | | Focal point for Y axis (if image) |
| data | stream | yes | | Data stream to use |

**Returns:** `object` — Created media content.

### modifyMedia

Modifies a media content.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id of the media content |
| name | string | yes | Name of the media content |
| data | stream | yes | Media data stream |
| mimeType | string | no | Mime-type of the data |
| focalX | number | no | Focal point for X axis |
| focalY | number | no | Focal point for Y axis |
| caption | string | no | Caption |
| artist | string/string[] | no | Artist |
| copyright | string | no | Copyright |
| tags | string/string[] | no | Tags |
| workflowInfo | object | no | Workflow state (default: READY) |

**Returns:** `object` — Modified media content.

### delete

Deletes a content. Published content is unpublished before deletion.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `boolean` — `true` if deleted, `false` otherwise.

### duplicate

Duplicates a content. *(XP 7.12.0+)*

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| contentId | string | yes | | Id of the content |
| workflow | object | no | { state: "READY", checks: {} } | Workflow state |
| includeChildren | boolean | no | true | Duplicate children too (ignored if variant=true) |
| variant | boolean | no | false | Duplicated content is a variant |
| parent | string | no | | Destination parent path |
| name | string | no | | New content name |

**Returns:** `object` — Summary with `contentName`, `sourceContentPath`, `duplicatedContents`.

### exists

Checks if a content exists.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `boolean` — `true` if exists.

### get

Returns a content.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| versionId | string | no | Content version id |

**Returns:** `object` — Content as JSON, or null.

### getAttachments

Returns content attachments.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `object` — Attachments keyed by name, or null.

### getAttachmentStream

Returns a data-stream for a content attachment.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| name | string | yes | Attachment name |

**Returns:** `stream` — Stream of the attachment data.

### getChildren

Fetches children of a content.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | yes | | Path or id to the parent content |
| start | number | no | 0 | Start index (paging) |
| count | number | no | 10 | Number of contents to fetch |
| sort | string | no | | Sorting expression |

**Returns:** `object` — `{ total, count, hits[] }`.

### getOutboundDependencies

Returns outbound dependencies of specified content. *(XP 7.2.0+)*

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `string[]` — List with ids of dependent content items.

### getPermissions

Returns content permissions.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `object` — `{ inheritsPermissions, permissions[] }`.

### getSite

Returns the parent site of a content.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |

**Returns:** `object` — Current site as JSON.

### getSiteConfig

Returns configuration of a specified application assigned to the site.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| applicationKey | string | yes | Application key |

**Returns:** `object` — App config as JSON.

### getType

Returns properties and icon of the specified content type.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Content type name, as `app:name` |

**Returns:** `ContentType` — The content type or null.

### getTypes

Returns all registered content types.

**Returns:** `ContentType[]` — Array of all content types.

### modify

Modifies a content. Properties starting with `_` cannot be modified (use `move` to rename).

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | yes | | Path or id to the content |
| editor | function | yes | | Editor callback function |
| requireValid | boolean | no | true | Content must be valid to be updated |

**Returns:** `object` — Modified content as JSON.

### move

Renames a content or moves it to a new path.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| source | string | yes | Path or id of the content to be moved/renamed |
| target | string | yes | New path or name. If ends in `/`, specifies parent path |

**Returns:** `object` — The moved/renamed content.

**Error codes:** `contentAlreadyExists`.

### publish

Publishes content to the master branch.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| keys | string[] | yes | | Content keys to publish |
| schedule | object | no | | Schedule publishing (`{ from, to }`) |
| excludeChildrenIds | string[] | no | | Descendants to exclude |
| includeDependencies | boolean | no | true | Include related content |
| sourceBranch | string | yes | | Source branch |
| targetBranch | string | yes | | Target branch |

**Returns:** `object` — `{ pushedContents[], failedContents[] }`.

### query

Retrieves content using a query.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| start | number | no | 0 | Start index (paging) |
| count | number | no | 10 | Number to fetch |
| query | string/object | yes | | Query string or DSL expression |
| filters | object | no | | Filters to apply |
| sort | string/object | no | | Sorting expression or DSL |
| aggregations | string | no | | Aggregations expression |
| contentTypes | string[] | no | | Content types to filter on |

**Returns:** `object` — `{ total, count, hits[], aggregations }`.

### removeAttachment

Removes an attachment from an existing content.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| name | string/string[] | yes | Attachment name(s) |

### resetInheritance

Resets custom inheritance flags of a content item. *(XP 7.6.0+)*

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Path or id to the content |
| projectName | string | yes | Content Layer unique id |
| inherit | string[] | yes | Flags: CONTENT, PARENT, NAME, SORT |

### restore

Restores a content from the archive. *(XP 7.8.0+)*

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| content | string | yes | Path or id of the content to restore |
| path | string | no | Path of parent for restored content |

**Returns:** `string[]` — List with ids of restored contents.

### setPermissions

Sets permissions on a content.

**Parameters (object):**

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| key | string | yes | | Path or id of the content |
| inheritPermissions | boolean | no | false | Inherit permissions |
| overwriteChildPermissions | boolean | no | false | Overwrite child permissions |
| permissions | PermissionsParams[] | no | | Array of permissions |

**PermissionsParams:** `{ principal: string, allow: string[], deny: string[] }`

**Returns:** `boolean` — `true` if successful.

### unpublish

Unpublishes content from the master branch.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| keys | string[] | yes | Content keys to unpublish |

**Returns:** `string[]` — List with ids of unpublished contents.

## Type Definitions

### ContentType

| Field | Type | Description |
|-------|------|-------------|
| name | string | Name of the content type |
| displayName | string | Display name |
| description | string | Description |
| superType | string | Super type name, or null |
| abstract | boolean | May be instantiated |
| final | boolean | May be used as super type |
| allowChildContent | boolean | Allow creating child items |
| displayNameExpression | string | ES6 template for generating name |
| icon | IconType | Icon (optional) |
| form | object[] | Form schema array |
