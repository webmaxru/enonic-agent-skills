# Enonic XP Controller Reference

## Project File Layout

### XP 8 (Current)

Controllers (called "HTTP functions" in XP 8) and descriptors live under `src/main/resources/cms/`:

```
src/main/resources/cms/
├── pages/
│   └── <page-name>/
│       ├── <page-name>.yaml       # Page descriptor (YAML)
│       └── <page-name>.ts         # Page HTTP function (or .js)
├── parts/
│   └── <part-name>/
│       ├── <part-name>.yaml       # Part descriptor (YAML)
│       └── <part-name>.ts         # Part HTTP function (or .js)
├── layouts/
│   └── <layout-name>/
│       ├── <layout-name>.yaml     # Layout descriptor (YAML)
│       └── <layout-name>.ts       # Layout HTTP function (or .js)
├── processors/
│   └── <processor-name>.ts        # Response processor
├── site.yaml                      # Site descriptor (declares processors, mappings)
└── cms.yaml                       # CMS descriptor (activates mixins, app form)
```

### XP 7 (Legacy)

Controllers and descriptors live under `src/main/resources/site/`:

```
src/main/resources/site/
├── pages/
│   └── <page-name>/
│       ├── <page-name>.xml        # Page descriptor (XML)
│       └── <page-name>.ts         # Page controller (or .js)
├── parts/
│   └── <part-name>/
│       ├── <part-name>.xml        # Part descriptor (XML)
│       └── <part-name>.ts         # Part controller (or .js)
├── layouts/
│   └── <layout-name>/
│       ├── <layout-name>.xml      # Layout descriptor (XML)
│       └── <layout-name>.ts       # Layout controller (or .js)
├── processors/
│   └── <processor-name>.js        # Response processor controller
└── site.xml                       # Site descriptor (declares processors)
```

## HTTP Handler Conventions

Controllers export named functions matching HTTP methods. In XP 8, method names are uppercase; in XP 7, they are lowercase.

### XP 8 (Current)

```ts
// TypeScript style
export function GET(req: Request): Response { ... }
export function POST(req: Request): Response { ... }
export function DELETE(req: Request): Response { ... }
export function PATCH(req: Request): Response { ... }
export function PUT(req: Request): Response { ... }
```

```js
// JavaScript (CommonJS) style
exports.GET = function (req) { ... };
exports.POST = function (req) { ... };
exports.DELETE = function (req) { ... };
exports.PATCH = function (req) { ... };
```

### XP 7 (Legacy)

```ts
export function get(req: Request): Response { ... }
export function post(req: Request): Response { ... }
export function delete(req: Request): Response { ... }
export function patch(req: Request): Response { ... }  // XP 7.15+
```

```js
exports.get = function (req) { ... };
exports.post = function (req) { ... };
exports.delete = function (req) { ... };
exports.patch = function (req) { ... };  // XP 7.15+
```

A special `all` (XP 7) or `ALL` (XP 8) export handles any HTTP method not explicitly declared.

Supported methods: `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `PATCH`.

The handler receives an HTTP Request object and must return an HTTP Response object:

```ts
// XP 8
export function GET(req) {
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
| `contentPath` | string | Path of the content being rendered (site service, XP 8+) |
| `locales` | array | Locale strings in decreasing preference order from `Accept-Language` (XP 8+) |

Since XP 7.12, the request object also exposes `getHeader(name)` — a case-insensitive header lookup function. Prefer it over accessing `headers` directly. Note: modifying the `headers` object does not affect the result of `getHeader(name)` calls.

### Response Object Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `status` | number | `200` | HTTP status code |
| `body` | string/object | | Response body |
| `contentType` | string | `text/plain; charset=utf-8` | MIME type |
| `headers` | object | | Response headers (value can be `null` or `undefined` to remove a header) |
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

### XP 8

Place implementation files at: `src/main/resources/cms/processors/<name>.ts` (or `.js`)

Export `responseProcessor`:
```ts
exports.responseProcessor = (req, res) => {
  var script = '<script src="https://cdn.example.com/tracker.js"></script>';
  if (!res.pageContributions.bodyEnd) {
    res.pageContributions.bodyEnd = [];
  }
  res.pageContributions.bodyEnd.push(script);
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

### XP 7 (Legacy)

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

Register in `site.xml`:
```xml
<site>
  <processors>
    <response-processor name="tracker" order="10"/>
  </processors>
  <form/>
</site>
```

Response processors run between component rendering and the contributions filter. Setting `applyFilters: false` in the response skips further processors and filters.

Execution order is determined by the `order` attribute (lower = higher priority) combined with app order on the site.

## Descriptor Reference

### XP 8 — YAML Descriptors

#### Page Descriptor

```yaml
kind: "Page"
title: "My Page"
description: "Front page"
form: []
regions:
  - name: "main"
```

The `title` field supports localization via the `text`/`i18n` object pattern:
```yaml
title:
  text: "My Page"
  i18n: "component.page.name"
```

#### Part Descriptor

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

Parts support `allowOnContentType` to limit which content types they can be placed on:
```yaml
kind: "Part"
title: "Article Part"
form: []
allowOnContentType:
  - "${app}:article*"
```

#### Layout Descriptor

```yaml
kind: "Layout"
title: "Two Column Layout"
form: []
regions:
  - name: "left"
  - name: "right"
```

### XP 7 — XML Descriptors (Legacy)

#### Page Descriptor

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

Common input types for component forms:

**String outputs:** `TextLine`, `TextArea`, `HtmlArea`, `ComboBox`, `RadioButton`, `Tag`, `CustomSelector`, `ContentTypeFilter`

**Reference outputs:** `ContentSelector`, `ImageSelector`, `MediaSelector`

**Attachment Reference:** `AttachmentUploader`

**Numeric outputs:** `Long`, `Double`

**Boolean:** `CheckBox`

**Date/Time:** `Date` (LocalDate), `Time` (LocalTime), `DateTime`, `Instant`

**Other:** `GeoPoint`, `ItemSet` (nested group), `OptionSet` (selectable groups), `FieldSet` (visual grouping only, no output)

Use `snake_case` for all form item names — capitals are flattened during indexing.
