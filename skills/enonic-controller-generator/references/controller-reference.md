# Enonic XP Controller Reference

## Project File Layout

Controllers and descriptors live under `src/main/resources/site/` (XP 7) or `src/main/resources/cms/` (XP 8+):

### XP 7.x Layout

```
src/main/resources/site/
├── pages/
│   └── <page-name>/
│       ├── <page-name>.xml        # Page descriptor (regions, form)
│       └── <page-name>.ts         # Page controller (or .js)
├── parts/
│   └── <part-name>/
│       ├── <part-name>.xml        # Part descriptor (form only, no regions)
│       └── <part-name>.ts         # Part controller (or .js)
├── layouts/
│   └── <layout-name>/
│       ├── <layout-name>.xml      # Layout descriptor (regions, form)
│       └── <layout-name>.ts       # Layout controller (or .js)
├── processors/
│   └── <processor-name>.js        # Response processor controller
└── site.xml                       # Site descriptor (declares processors)
```

### XP 8+ Layout

```
src/main/resources/cms/
├── pages/
│   └── <page-name>/
│       ├── <page-name>.yaml       # Page descriptor (YAML)
│       └── <page-name>.ts         # HTTP function (or .js)
├── parts/
│   └── <part-name>/
│       ├── <part-name>.yaml       # Part descriptor (YAML)
│       └── <part-name>.ts         # HTTP function (or .js)
├── layouts/
│   └── <layout-name>/
│       ├── <layout-name>.yaml     # Layout descriptor (YAML)
│       └── <layout-name>.ts       # HTTP function (or .js)
├── processors/
│   └── <processor-name>.ts        # Response processor
├── cms.yaml                       # CMS descriptor (mixins, app-level form)
└── site.yaml                      # Site descriptor (mappings, processors, APIs)
```

## HTTP Handler Conventions

Controllers export named functions matching HTTP methods.

### XP 7.x (lowercase exports)

```ts
// TypeScript style
export function get(req: Request): Response { ... }
export function post(req: Request): Response { ... }
export function delete(req: Request): Response { ... }
export function patch(req: Request): Response { ... }  // XP 7.15+
```

```js
// JavaScript (CommonJS) style
var lib = require('/lib/xp/portal');
exports.get = function (req) { ... };
exports.post = function (req) { ... };
exports.delete = function (req) { ... };
exports.patch = function (req) { ... };  // XP 7.15+
```

### XP 8+ (uppercase exports)

```ts
// TypeScript style
export function GET(req: Request): Response { ... }
export function POST(req: Request): Response { ... }
export function DELETE(req: Request): Response { ... }
export function PATCH(req: Request): Response { ... }
```

```js
// JavaScript (CommonJS) style
exports.GET = function (req) { ... };
exports.POST = function (req) { ... };
```

A special `all` export handles any HTTP method not explicitly declared.

Supported methods: `get`, `post`, `put`, `delete`, `head`, `options`, and `patch` (XP 7.15+).

The handler receives an HTTP Request object and must return an HTTP Response object:

```ts
export function get(req) {
  return {
    body: '<html>...</html>',
    contentType: 'text/html',
    status: 200
  };
}
```

### Request Object Properties

| Property | Type | Description |
|---|---|---|
| `method` | string | HTTP method (GET, POST, etc.) |
| `scheme` | string | `http` or `https` |
| `host` | string | Server host name |
| `port` | string | Server port |
| `path` | string | Request path |
| `url` | string | Full request URL |
| `remoteAddress` | string | Client IP (respects `X-Forwarded-For`) |
| `mode` | string | Rendering mode: `inline`, `edit`, `preview`, `live` |
| `branch` | string | Repository branch: `draft` or `master` |
| `body` | string | Optional request body |
| `params` | object | Query/form parameters |
| `headers` | object | HTTP request headers |
| `cookies` | object | HTTP request cookies |

Since XP 7.12, the request object also exposes `getHeader(name)` — a case-insensitive header lookup function. Prefer it over accessing `headers` directly. Note: modifying the `headers` object does not affect the result of `getHeader(name)` calls.

**Additional properties in XP 8+:**

| Property | Type | Description |
|---|---|---|
| `contentPath` | string | Site service: path of the content being rendered. Assigning it in a site mapping filter re-routes rendering to another content. |
| `locales` | string[] | Locale strings from `Accept-Language` header in decreasing preference order. Falls back to server default locale if the header is absent. |

### Response Object Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `status` | number | `200` | HTTP status code |
| `body` | string/object | | Response body |
| `contentType` | string | `text/plain; charset=utf-8` | MIME type |
| `headers` | object | | Response headers (value can be `null` to remove a header, XP 7.15+) |
| `cookies` | object | | Response cookies (see cookie options below) |
| `redirect` | string | | URI to redirect to (sets status 303) |
| `postProcess` | boolean | `true` | Site engine: process component placeholder tags in the body |
| `pageContributions` | object | | Site engine: contribute HTML to specific positions in the response |
| `applyFilters` | boolean | `true` | Site engine: if `false`, skip response processors and filters |

### Response Cookie Options

Cookie values can be a simple string or an object with detailed settings:

```ts
cookies: {
  "simple": "value",
  "detailed": {
    value: "value",         // required
    path: "/valid/path",    // optional, default empty
    domain: "enonic.com",   // optional, default empty
    maxAge: 2000,           // optional, seconds before deletion (-1 = session)
    secure: false,          // optional, restrict to HTTPS
    httpOnly: false,        // optional, hide from client-side scripts
    sameSite: "Lax"         // optional (XP 7.3+): "Lax", "Strict", "None", or empty
  }
}
```

## Portal API (lib-portal)

Import: `import portalLib from '/lib/xp/portal';` or use named imports.

Add to `build.gradle`:
```
dependencies {
  include "com.enonic.xp:lib-portal:${xpVersion}"
}
```

### Key Functions

| Function | Context | Purpose |
|---|---|---|
| `getContent()` | page, part, layout | Returns the current content item as JSON |
| `getComponent()` | part, layout | Returns the current component (config, regions) as JSON |
| `getSite()` | page, part, layout | Returns the parent site as JSON |
| `getSiteConfig()` | page, part, layout | Returns the site config for the current app |
| `assetUrl({path})` | any | Generates URL to a static asset — **deprecated in XP 7.15**, use `lib-asset` or `lib-static` instead (see lib-asset section below) |
| `attachmentUrl({id, name})` | any | Generates URL to a content attachment |
| `imageUrl({id, scale})` | any | Generates URL to an image |
| `pageUrl({path})` | any | Generates URL to a content page |
| `componentUrl({component})` | any | Generates URL to a page component |
| `serviceUrl({service})` | any | Generates URL to a service (type can be `server`, `absolute`, or `websocket`) |
| `url({path})` | any | Generates URL to a generic resource (type can be `server`, `absolute`, or `websocket`) |
| `imagePlaceholder({width, height})` | any | Generates a base64-encoded placeholder image URL |
| `processHtml({value})` | any | Resolves internal links in HTML content. Supports `imageWidths` (XP 7.7+) and `imageSizes` (XP 7.8+) for responsive images |
| `sanitizeHtml(html)` | any | Strips unsafe tags/attributes to protect against XSS |

### Example — getComponent() Return Value (Layout)

```json
{
  "path": "/main/0",
  "type": "layout",
  "descriptor": "myapplication:mylayout",
  "config": { "a": "1" },
  "regions": {
    "bottom": {
      "components": [{
        "path": "/main/0/bottom/0",
        "type": "part",
        "descriptor": "myapplication:mypart",
        "config": { "a": "1" }
      }],
      "name": "bottom"
    }
  }
}
```

## Content API (lib-content)

Import: `import contentLib from '/lib/xp/content';`

Add to `build.gradle`:
```
dependencies {
  include "com.enonic.xp:lib-content:${xpVersion}"
}
```

Key functions: `get({key})`, `query({query, contentTypes})`, `getChildren({key})`, `exists({key})`.

## Thymeleaf Rendering

Import: `import thymeleafLib from '/lib/thymeleaf';`

Add to `build.gradle`:
```
dependencies {
  include "com.enonic.lib:lib-thymeleaf:2.0.0"
}
```

Render pattern:
```ts
const view = resolve('view.html');
const body = thymeleafLib.render(view, model);
return { body, contentType: 'text/html' };
```

An optional third `options` parameter controls the template mode (default: `HTML`):
```ts
const body = thymeleafLib.render(view, model, { mode: 'HTML' });
```
Valid modes: `HTML`, `XML`, `TEXT`, `JAVASCRIPT`, `CSS`, `RAW`.

Use `data-th-utext` for processed HTML output (unescaped).

## Mustache Rendering

Import: `import mustacheLib from '/lib/mustache';`

Add to `build.gradle`:
```
dependencies {
  include "com.enonic.lib:lib-mustache:2.1.0"
}
```

Render pattern:
```ts
const view = resolve('view.html');
const body = mustacheLib.render(view, model);
return { body, contentType: 'text/html' };
```

## Asset Library (lib-asset) — replacement for deprecated assetUrl

Import: `import { assetUrl } from '/lib/enonic/asset';`

Add to `build.gradle`:
```
dependencies {
  include "com.enonic.lib:lib-asset:${libVersion}"
}
```

Usage:
```ts
import { assetUrl } from '/lib/enonic/asset';
const cssUrl = assetUrl({ path: 'styles/main.css' });
```

For Thymeleaf templates, pass an `assetUrlBase` from the controller instead of using `portal.assetUrl` in the template:
```ts
const model = {
  assetUrlBase: assetUrl({ path: '' })
};
```
Then in the template: `<link th:href="${assetUrlBase} + '/styles.css'" rel="stylesheet"/>`

## Page Contributions

Any component controller (page, part, layout) can add `pageContributions` to the response to inject content into the rendered page at four positions: `headBegin`, `headEnd`, `bodyBegin`, `bodyEnd`.

```ts
export function get(req) {
  return {
    body: '<div>My part</div>',
    contentType: 'text/html',
    pageContributions: {
      headEnd: '<link rel="stylesheet" href="styles.css"/>',
      bodyEnd: ['<script src="main.js"></script>']
    }
  };
}
```

Duplicate contributions are automatically removed during the merge step. If the target tag (e.g., `<head>`) does not exist in the response, contributions to that position are ignored.

## Response Processors

### XP 7.x

Place controller files at: `src/main/resources/site/processors/<name>.js`

Export `responseProcessor`:
```js
exports.responseProcessor = function (req, res) {
  var script = '<script src="https://cdn.example.com/tracker.js"></script>';
  if (!res.pageContributions.bodyEnd) {
    res.pageContributions.bodyEnd = [];
  }
  res.pageContributions.bodyEnd.push(script);
  return res;
};
```

Response processors run between component rendering and the contributions filter. Setting `applyFilters: false` in the response skips further processors and filters.

Execution order is determined by the `order` attribute (lower = higher priority) combined with app order on the site.

Register in `site.xml`:
```xml
<site>
  <processors>
    <response-processor name="tracker" order="10"/>
  </processors>
  <form/>
</site>
```

### XP 8+

Place files at: `src/main/resources/cms/processors/<name>.ts`

```ts
exports.responseProcessor = (req, res) => {
  const trackingScript = '<script src="https://cdn.example.com/tracker.js"></script>';
  if (!res.pageContributions.bodyEnd) {
    res.pageContributions.bodyEnd = [];
  }
  res.pageContributions.bodyEnd.push(trackingScript);
  return res;
};
```

Register in `cms/site.yaml`:
```yaml
kind: "Site"
processors:
  - name: "tracker"
    order: 10
```

**XP 8.1+:** Components can pass data to processors via custom context attributes. A part calls `context.setCustomLocalAttribute('com.example.myapp.needsLib', true)` (from `lib-context`), and the processor reads it back from `context.get().attributes['custom.com.example.myapp.needsLib']`. This is the supported way to conditionally load assets only on pages that use them.

## XML Descriptor Reference (XP 7.x)

### Page Descriptor

```xml
<page>
  <display-name i18n="component.page.name">My Page</display-name>
  <description>Front page</description>
  <form/>
  <regions>
    <region name="main"/>
  </regions>
</page>
```

The `i18n` attribute on `<display-name>` is optional and specifies a localization key for multi-language support.

### Part Descriptor

```xml
<part>
  <display-name>My Part</display-name>
  <description>Displays a hero banner</description>
  <form>
    <input name="heading" type="TextLine">
      <label>Heading</label>
      <occurrences minimum="1" maximum="1"/>
    </input>
  </form>
</part>
```

### Layout Descriptor

```xml
<layout>
  <display-name>Two Column Layout</display-name>
  <form/>
  <regions>
    <region name="left"/>
    <region name="right"/>
  </regions>
</layout>
```

### Form Schema Elements

Common input types for component forms: `TextLine`, `TextArea`, `HtmlArea`, `ImageSelector`, `ContentSelector`, `CheckBox`, `ComboBox`, `Date`, `DateTime`, `Long`, `Double`.

## YAML Descriptor Reference (XP 8+)

In XP 8, all descriptors use YAML. The folder is `src/main/resources/cms/` instead of `site/`. Each descriptor has a `kind:` field.

### Page Descriptor

```yaml
kind: "Page"
title: "My Page"
description: "Front page"
form: []
regions:
  - name: "main"
```

### Part Descriptor

```yaml
kind: "Part"
title: "My Part"
description: "Displays a hero banner"
form:
  - name: "heading"
    type: "TextLine"
    label: "Heading"
    occurrences:
      min: 1
      max: 1
```

Note: In YAML descriptors, `occurrences` uses `min`/`max`. The runtime JSON (from `lib-content` `getType()`) still uses `minimum`/`maximum`.

### Layout Descriptor

```yaml
kind: "Layout"
title: "Two Column Layout"
form: []
regions:
  - name: "left"
  - name: "right"
```

### Form Items

Common form item types (same in both versions): `TextLine`, `TextArea`, `HtmlArea`, `ImageSelector`, `ContentSelector`, `CheckBox`, `ComboBox`, `Date`, `DateTime`, `Long`, `Double`. In YAML, input-specific settings sit directly on the item (no `<config>` wrapper).

Source: https://developer.enonic.com/docs/code/stable/schemas, https://developer.enonic.com/docs/cms/xp8/schemas/form-items
