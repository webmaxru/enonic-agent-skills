# lib-io, lib-mail, lib-repo, and lib-schema API Reference

> Sources:
> - https://developer.enonic.com/docs/xp/7.x/api/lib-io
> - https://developer.enonic.com/docs/xp/7.x/api/lib-mail
> - https://developer.enonic.com/docs/xp/7.x/api/lib-repo
> - https://developer.enonic.com/docs/xp/7.x/api/lib-schema

---

## lib-io

**Import:** `import ioLib from '/lib/xp/io';`
**Gradle:** `include "com.enonic.xp:lib-io:${xpVersion}"`

### getMimeType

Returns mime-type from a name or extension.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| name | string | File name or extension |

**Returns:** `string` — Mime-type.

### getResource

Looks up a resource.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Resource key |

**Returns:** `Resource` — Object with `exists()`, `getSize()`, `getStream()` methods.

### getSize

Returns the size of a stream.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| stream | stream | Stream to measure |

**Returns:** `number` — Size in bytes.

### newStream

Creates a new stream from a string.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| text | string | String to convert |

**Returns:** `stream`

### processLines

Process lines from a stream via callback.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| stream | stream | Stream to read |
| func | function | Callback for each line |

### readLines

Reads all lines from a stream.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| stream | stream | Stream to read |

**Returns:** `string[]` — Lines array.

### readText

Reads text from a stream.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| stream | stream | Stream to read |

**Returns:** `string` — Full text.

---

## lib-mail

**Import:** `import mailLib from '/lib/xp/mail';`
**Gradle:** `include "com.enonic.xp:lib-mail:${xpVersion}"`

> SMTP server must be configured before sending email.

### send

Sends an email message.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| from | string | yes | Sender address (optionally with display name) |
| to | string/string[] | yes | Recipient(s) |
| cc | string/string[] | no | Carbon copy |
| bcc | string/string[] | no | Blind carbon copy |
| replyTo | string | no | Reply-to address |
| subject | string | yes | Subject line |
| body | string | yes | Message body |
| contentType | string | no | Content type (e.g., `text/html; charset="UTF-8"`) |
| headers | object | no | Custom headers as name-value pairs |
| attachments | Array | no | Attachments |

**Attachment properties:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| fileName | string | yes | File name |
| data | stream | yes | Data stream |
| mimeType | string | no | Content type (inferred from filename if omitted) |
| headers | object | no | Attachment-specific headers |

The `from` parameter supports default email substitution. If the email address is not specified in angle brackets (e.g., `Some Name <>` or `<>`), the default *from* email address is used. An error is thrown if the default *from* email is not set.

**Returns:** `boolean` — `true` if sent successfully.

### getDefaultFromEmail

Returns the default from email address from XP mail configuration. *(XP 7.14.1+)*

**Returns:** `string` — Default from email.

---

## lib-repo

**Import:** `import repoLib from '/lib/xp/repo';`
**Gradle:** `include "com.enonic.xp:lib-repo:${xpVersion}"`

### create

Creates a repository.

**Parameters (CreateRepositoryParams):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | yes | Repository ID |
| rootPermissions | array | no | Root permissions |
| settings | object | no | Repository settings |
| transient | boolean | no | If true, repository is transient |

**Returns:** `object` — `{ id, branches[], settings }`.

### createBranch

Creates a branch.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| branchId | string | Branch ID |
| repoId | string | Repository to create branch in |

**Returns:** `object` — Created branch.

**Error codes:** `branchAlreadyExists`.

### delete

Deletes a repository.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| id | string | Repository ID |

**Returns:** `boolean` — `true` if deleted.

### deleteBranch

Deletes a branch.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| branchId | string | Branch ID |
| repoId | string | Repository |

**Returns:** `object` — Deleted branch.

**Error codes:** `branchNotFound`.

### get

Retrieves a repository.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| id | string | Repository ID |

**Returns:** `object` — `{ id, branches[], settings }` or null.

### list

Retrieves all repositories.

**Returns:** `object[]` — Array of `{ id, branches[], settings }`.

### refresh

Refreshes indices in the current repository.

**Parameters (object, optional):**

| Name | Type | Default | Description |
|------|------|---------|-------------|
| mode | string | all | `all`, `search`, or `storage` |
| repo | string | com.enonic.cms.default | Repository id |
| branch | string | master | Branch |

> **Note:** `com.enonic.cms.default` is the legacy default repository — now deprecated and hidden unless enabled via configuration. Pass an explicit `repo` of `com.enonic.cms.<project-name>` (e.g. `com.enonic.cms.myproject`) rather than relying on the default.

### Events

| Event | Description |
|-------|-------------|
| repository.created | Repository created |
| repository.updated | Repository updated |
| repository.deleted | Repository deleted |
| repository.restoreInitialized | Restore begins |
| repository.restored | Restore completed |

---

## lib-schema

**Import:** `import schemaLib from '/lib/xp/schema';`
**Gradle:** `include "com.enonic.xp:lib-schema:${xpVersion}"`

> Dynamic schema management for content types, mixins, and x-data.

### createSchema

Creates a dynamic schema in a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Schema name |
| type | string | yes | `CONTENT_TYPE`, `FORM_FRAGMENT`, or `MIXIN` |
| resource | string | yes | Schema resource value (YAML) |

**Returns:** `object` — The created schema.

### getSchema

Fetches a schema from an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Schema name |
| type | string | yes | `CONTENT_TYPE`, `FORM_FRAGMENT`, or `MIXIN` |

**Returns:** `object` — The schema, or null.

### listSchemas

Lists schemas of a given type for a specified application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| type | string | yes | `CONTENT_TYPE`, `FORM_FRAGMENT`, or `MIXIN` |

**Returns:** `object[]` — Array of schemas.

### updateSchema

Updates a dynamic schema in a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Schema name |
| type | string | yes | `CONTENT_TYPE`, `FORM_FRAGMENT`, or `MIXIN` |
| resource | string | yes | Updated schema resource value (YAML) |

**Returns:** `object` — The modified schema.

### deleteSchema

Removes a schema from a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Schema name |
| type | string | yes | `CONTENT_TYPE`, `FORM_FRAGMENT`, or `MIXIN` |

**Returns:** `boolean` — `true` if deleted.

### createComponent

Creates a dynamic component (page, part, or layout) in a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Component key |
| type | string | yes | `PAGE`, `PART`, or `LAYOUT` |
| resource | string | yes | Component resource value (YAML) |

**Returns:** `object` — The created component descriptor.

### getComponent

Fetches a component descriptor from an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Component key |
| type | string | yes | `PAGE`, `PART`, or `LAYOUT` |

**Returns:** `object` — Component descriptor, or null.

### listComponents

Lists components of a given type for a specified application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| type | string | yes | `PAGE`, `PART`, or `LAYOUT` |

**Returns:** `object[]` — Array of component descriptors.

### updateComponent

Updates a dynamic component in a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Component key |
| type | string | yes | `PAGE`, `PART`, or `LAYOUT` |
| resource | string | yes | Updated resource value (YAML) |

**Returns:** `object` — The modified component descriptor.

### deleteComponent

Deletes a dynamic component from a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Component key |
| type | string | yes | `PAGE`, `PART`, or `LAYOUT` |

**Returns:** `boolean` — `true` if deleted.

### createStyles

Creates dynamic styles for an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| resource | string | yes | Styles resource value (YAML) |

**Returns:** `object` — The created styles descriptor.

### getStyles

Gets dynamic styles for an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |

**Returns:** `object` — Styles descriptor, or null.

### updateStyles

Updates dynamic styles in a virtual application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| resource | string | yes | Updated styles resource value (YAML) |

**Returns:** `object` — The modified styles descriptor.

### deleteStyles

Deletes dynamic styles for an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |

**Returns:** `boolean` — `true` if deleted.

### getSite

Gets a dynamic site descriptor for an application.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |

**Returns:** `object` — Site descriptor, or null.

### updateSite

Updates a dynamic site descriptor.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| application | string | yes | Application key |
| resource | string | yes | Updated site resource value (YAML) |

**Returns:** `object` — The modified site descriptor.

> For full parameter details, consult the official documentation at https://developer.enonic.com/docs/xp/7.x/api/lib-schema
