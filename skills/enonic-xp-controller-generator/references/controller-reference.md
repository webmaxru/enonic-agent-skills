# Enonic XP Controller Reference

## Project File Layout

Controllers and descriptors live under `src/main/resources/site/`:

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

## HTTP Handler Conventions

Controllers export named functions matching HTTP methods:

```ts
// TypeScript style
export function get(req: Request): Response { ... }
export function post(req: Request): Response { ... }
```

```js
// JavaScript (CommonJS) style
exports.get = function (req) { ... };
exports.post = function (req) { ... };
```

A special `all` export handles any HTTP method not explicitly declared.

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
| `assetUrl({path})` | any | Generates URL to a static asset file |
| `imageUrl({id, scale})` | any | Generates URL to an image |
| `pageUrl({path})` | any | Generates URL to a content page |
| `componentUrl({component})` | any | Generates URL to a page component |
| `serviceUrl({service})` | any | Generates URL to a service |
| `processHtml({value})` | any | Resolves internal links in HTML content |

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

## Response Processors

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

## XML Descriptor Reference

### Page Descriptor

```xml
<page>
  <display-name>My Page</display-name>
  <description>Front page</description>
  <form/>
  <regions>
    <region name="main"/>
  </regions>
</page>
```

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
