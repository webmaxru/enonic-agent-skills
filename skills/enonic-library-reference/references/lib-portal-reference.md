# lib-portal API Reference

> Source: https://developer.enonic.com/docs/xp/7.x/api/lib-portal

**Import:** `import portalLib from '/lib/xp/portal';`
**Gradle:** `include "com.enonic.xp:lib-portal:${xpVersion}"`

## Functions

### apiUrl

Generates a URL pointing to a Universal API endpoint.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| api | string | yes | Descriptor key in `app:api` form |
| type | string | no | URL type: `server`, `absolute`, or `websocket` (default: `server`) |
| path | string/string[] | no | Path appended after the API segment |
| params | object | no | Query parameters |

**Returns:** `string` — Generated URL.

### assetUrl

Generates URL to a static file. *(Deprecated in XP 7.15.0 — use lib-asset or lib-static instead)*

**Parameters:** `{ path: string }` — Input parameters.
**Returns:** `string` — Generated URL.

### attachmentUrl

Generates URL to an attachment. Uses `name` first, then `label` for lookup.

**Parameters:** `{ id, name?, label?, download?, ... }` — Input parameters.
**Returns:** `string` — Generated URL.

### baseUrl

Generates a base URL.

**Parameters (object):**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| type | string | no | URL type: `server`, `absolute`, or `websocket` (default: `server`) |
| id | string | no | ID of the content |
| path | string | no | Path to the content |
| project | string | no | Project name for URL resolution |
| branch | string | no | Branch name for URL resolution |

**Returns:** `string` — Generated URL.

### componentUrl

Generates URL to a page component.

**Parameters:** `{ component: string }` — Input parameters.
**Returns:** `string` — Generated URL.

### getComponent

Returns the current component in the execution context. Call from a layout or part controller.

**Returns:** `object` — Component as JSON with `path`, `type`, `descriptor`, `config`, `regions`.

### getContent

Returns the current content in the execution context. Call from a page, layout, or part controller.

**Returns:** `object` — Content as JSON.

### getIdProviderKey

Returns the key of the ID provider in the current execution context.

**Returns:** `string` — ID provider key.

### getMultipartForm

Returns a JSON containing multipart items. Returns `undefined` if not a multipart request.

**Returns:** `object` — Multipart form items.

### getMultipartItem

Returns a named multipart item. Returns `undefined` if not found.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Name of multipart item |
| index | number | no | Zero-based index for same-name items |

**Returns:** `object` — `{ name, fileName, contentType, size }`.

### getMultipartStream

Returns a data stream for a named multipart item.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Name of multipart item |
| index | number | no | Zero-based index for same-name items |

**Returns:** `stream`

### getMultipartText

Returns the multipart item data as text.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | yes | Name of multipart item |
| index | number | no | Zero-based index for same-name items |

**Returns:** `string`

### getSite

Returns the parent site of a content (call from page/layout/part controller).

**Returns:** `object` — Site as JSON.

### getSiteConfig

Returns configuration of the parent site for the current application.

**Returns:** `object` — Site configuration as JSON.

### idProviderUrl

Generates URL to an ID provider.

**Parameters:** `object` (optional) — Input parameters.
**Returns:** `string` — Generated URL.

### imagePlaceholder

Generates URL of an image placeholder with specified size.

**Parameters:** `{ width: number, height: number }` — Input parameters.
**Returns:** `string` — Placeholder image URL (base64 data URI).

### imageUrl

Generates URL to an image.

**Parameters:** `{ id, scale, filter?, ... }` — Input parameters.
**Returns:** `string` — Generated URL.

### loginUrl

Generates URL to the login endpoint of an ID provider.

**Parameters:** `object` (optional) — Input parameters.
**Returns:** `string` — Generated URL.

### logoutUrl

Generates URL to the logout endpoint of the current ID provider.

**Parameters:** `object` (optional) — Input parameters.
**Returns:** `string` — Generated URL.

### pageUrl

Generates URL to a content page.

**Parameters:** `{ path, params?, ... }` — Input parameters.
**Returns:** `string` — Generated URL.

### processHtml

Resolves internal links to images and content items in HTML text, replacing them with correct URLs. Also processes embedded macros.

**Parameters:** `{ value: string, imageWidths?: number[], imageSizes?: string }` — Input parameters.

- `imageWidths` *(XP 7.7.0+)*: Comma-separated list of image widths. Adds `srcset` attribute to `<img>` tags.
- `imageSizes` *(XP 7.8.0+)*: Specifies image width depending on browser dimensions. Format: `(media-condition) width`, comma-separated for multiple sizes.

**Returns:** `string` — Processed HTML.

### sanitizeHtml

Sanitizes an HTML string by stripping potentially unsafe tags and attributes. Use to protect against XSS.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| html | string | HTML string to sanitize |

**Returns:** `string` — Sanitized HTML.

### serviceUrl

Generates URL to a service.

**Parameters:** `{ service: string, params?: object }` — Input parameters.
**Returns:** `string` — Generated URL.

### url

Generates URL to a resource.

**Parameters:** `{ path: string, params?: object }` — Input parameters.
**Returns:** `string` — Generated URL.

### csp

Returns the request-scoped enforced Content Security Policy builder for the current portal request. Its directives compose the `Content-Security-Policy` header. Takes no arguments. *(XP 8.1.0+)*

**Returns:** `object` — CSP builder.

### cspReportOnly

Returns the request-scoped report-only Content Security Policy builder, emitted as the `Content-Security-Policy-Report-Only` header. Takes no arguments. *(XP 8.1.0+)*

**Returns:** `object` — Report-only CSP builder.
