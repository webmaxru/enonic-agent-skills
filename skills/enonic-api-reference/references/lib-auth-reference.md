# lib-auth API Reference

> Source: https://developer.enonic.com/docs/xp/stable/api/lib-auth

**Import:** `import authLib from '/lib/xp/auth';`
**Gradle:** `include "com.enonic.xp:lib-auth:${xpVersion}"`

> If you get "Access denied to user [unknown]" errors, the user role in the current context lacks permissions. Execute the function in the context of System Administrator role using `lib-context run()`.

## Functions

### addMembers

Adds members to a principal (group or role).

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Key of the principal to add members to |
| members | string[] | New members to add |

**Returns:** void

### changePassword

Changes password for a specified user.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| userKey | string | Key of the user |
| password | string | The new password |

**Returns:** void

### createGroup

Creates a group.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| idProvider | string | Key for id provider |
| name | string | Group name |
| displayName | string | Group display name |
| description | string | Description |

**Returns:** `object` — `{ type, key, displayName, description }`.

### createRole

Creates a role.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| name | string | Role name (key becomes `role.<name>`) |
| displayName | string | Display name |
| description | string | Description |

**Returns:** `object` — `{ type, key, displayName, description }`.

### createUser

Creates a user.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| idProvider | string | yes | Key for id provider |
| name | string | yes | User login name |
| displayName | string | yes | Display name |
| email | string | no | E-mail |

**Returns:** `object` — User object.

### deletePrincipal

Deletes the specified principal.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Principal key |

**Returns:** `boolean` — `true` if deleted.

### findPrincipals

Search for principals matching criteria. All parameters optional.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| type | string | `user`, `group`, or `role` |
| idProvider | string | Id provider key |
| start | number | First result for pagination |
| count | number | Max results |
| name | string | Principal name |
| searchText | string | Text to search in any field |

**Returns:** `object` — `{ total, count, hits[] }`.

### findUsers

Search for users matching a query.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| query | string | yes | Query expression |
| start | number | no | Start index |
| count | number | no | Number to fetch |
| sort | string | no | Sorting expression |
| includeProfile | boolean | no | Include full profile |

**Returns:** `object` — `{ total, count, hits[] }`.

### generatePassword

Generates a random secure password.

**Returns:** `string` — Suggested secure password.

### getIdProviderConfig

Returns the ID provider configuration. Call from an ID provider controller.

**Returns:** `object` — Configuration values.

### getMembers

Returns members of the specified principal.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Principal key |

**Returns:** `object[]` — Members array, or empty array.

### getMemberships

Returns principals the specified principal is a member of.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Principal key |
| transitive | boolean | no | Retrieve transitive memberships (default: false) |

**Returns:** `object[]` — Array of memberships.

### getPrincipal

Returns the principal with the specified key.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Principal key |

**Returns:** `object` — Principal object.

### getProfile

Returns the profile of a user.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Principal key |
| scope | string | no | Optional scope |

**Returns:** `object` — Profile data.

### getUser

Returns the logged-in user, or undefined/null if not logged in.

**Returns:** `object` — User data.

### hasRole

Checks if the logged-in user has the specified role.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| role | string | Role to check |

**Returns:** `boolean`

### login

Logs in a user with username and password.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| user | string | yes | User login name |
| password | string | conditional | Required unless skipAuth=true |
| idProvider | string | no | Id provider name |
| skipAuth | boolean | no | Skip authentication (default: false) |
| sessionTimeout | number | no | Session timeout in seconds |
| scope | string | no | SESSION, REQUEST, or NONE (default: SESSION) |

**Returns:** `object` — `{ authenticated, user }`.

### logout

Logs out the currently logged-in user.

**Returns:** void

### modifyGroup

Updates an existing group.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Principal key of the group |
| editor | function | Group editor function |

**Returns:** `object` — Updated group.

### modifyProfile

Updates a user profile (creates if not found for the given scope).

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| key | string | yes | Principal key |
| scope | string | no | Optional scope |
| editor | function | yes | Profile editor function |

**Returns:** `object` — Updated profile.

### modifyRole

Updates an existing role.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | Role key |
| editor | function | Role editor function |

**Returns:** `object` — Updated role.

### modifyUser

Updates an existing user.

**Parameters (object):**

| Name | Type | Description |
|------|------|-------------|
| key | string | User key |
| editor | function | User editor function |

**Returns:** `object` — Updated User.

### removeMembers

Removes members from a principal (group or role).

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| key | string | Principal key of a group or role |
| members | string[] | Principal keys to remove |

**Returns:** void

## Type Definitions

### User

| Field | Type | Description |
|-------|------|-------------|
| type | string | Always "user" |
| key | string | Unique key |
| displayName | string | Display name |
| modifiedTime | string | Last modified (ISO 8601) |
| disabled | boolean | Whether disabled |
| email | string | Email |
| login | string | Login name |
| idProvider | string | Id provider |
| hasPassword | boolean | Has a password set |
