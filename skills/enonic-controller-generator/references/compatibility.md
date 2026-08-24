# Enonic XP Compatibility Notes

## XP Version Support

- **XP 7.x**: Legacy stable branch. Many existing projects still target XP 7.x.
- **XP 7.2+**: Custom icons for parts (SVG or PNG placed alongside the descriptor).
- **XP 7.8+**: `archive` and `restore` functions in lib-content.
- **XP 7.12+**: `request.getHeader(name)` for case-insensitive header lookup. `duplicate` function in lib-content.
- **XP 7.15+**: `assetUrl` from lib-portal is deprecated; use `lib-asset` or `lib-static` instead. `patch` HTTP method supported in controllers. Response headers can be set to `null` to remove headers added by other controllers/filters. `@enonic-types/core` now includes TypeScript types for `Request` and `Response` objects.
- **XP 7.16+**: GraalVM for JDK 21. No new controller-specific changes.
- **XP 8.0+**: Major release with breaking changes — see the XP 8 section below.

## XP 8 Breaking Changes for Controllers

XP 8 redesigns how controllers are written and organized. When the target project uses XP 8, apply the following changes instead of the XP 7 patterns:

### HTTP Function Names Are Uppercase

Export names must match the uppercase HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS`. The XP 7 lowercase form (`get`, `post`, etc.) is no longer recognized.

```ts
// XP 8
export function GET(req) { ... }
export function POST(req) { ... }
```

```js
// XP 8 CommonJS
exports.GET = function (req) { ... };
exports.POST = function (req) { ... };
```

### Resource Path Changed from `site/` to `cms/`

All CMS resources move from `src/main/resources/site/` to `src/main/resources/cms/`:

| Component | XP 7 path | XP 8 path |
|---|---|---|
| Pages | `site/pages/<name>/` | `cms/pages/<name>/` |
| Parts | `site/parts/<name>/` | `cms/parts/<name>/` |
| Layouts | `site/layouts/<name>/` | `cms/layouts/<name>/` |
| Processors | `site/processors/` | `cms/processors/` |

### Descriptors Are YAML, Not XML

Component descriptors use `.yaml` instead of `.xml`. The `<display-name>` element is replaced by a `title` property. The `kind` property is required.

```yaml
# XP 8 page descriptor: cms/pages/default/default.yaml
kind: "Page"
title: "Default Page"
description: "Standard page with a main region"
form: []
regions:
  - name: "main"
```

```yaml
# XP 8 part descriptor: cms/parts/hero-banner/hero-banner.yaml
kind: "Part"
title: "Hero Banner"
description: "Displays a hero banner"
form:
  - name: "heading"
    type: "TextLine"
    label: "Heading"
    occurrences:
      min: 1
      max: 1
```

```yaml
# XP 8 layout descriptor: cms/layouts/two-column/two-column.yaml
kind: "Layout"
title: "Two Column Layout"
description: "Splits content into left and right columns"
form: []
regions:
  - name: "left"
  - name: "right"
```

### Site Descriptor Split

The XP 7 `site.xml` is replaced by two YAML files:

- `cms/site.yaml` — site rendering config (mappings, processors, APIs).
- `cms/cms.yaml` — CMS-level config (mixin activation, app-level form).

```yaml
# XP 8 site.yaml — processor registration
kind: "Site"
processors:
  - name: "tracker"
    order: 10
```

### Gradle Dependency Format

XP 8 uses a simplified dependency format:

```groovy
// XP 8
dependencies {
  include xplibs.portal
}
```

The XP 7 format `include "com.enonic.xp:lib-portal:${xpVersion}"` is no longer used.

### Request Object — New Properties

| Property | Type | Description |
|---|---|---|
| `contentPath` | string | Site service path of the content being rendered |
| `locales` | string[] | Locale strings from `Accept-Language`, in decreasing preference order |

### New lib-portal Functions (XP 8)

| Function | Purpose |
|---|---|
| `apiUrl({api, application})` | Generates URL to a Universal API |
| `baseUrl({type})` | Generates base URL for the current service mount |
| `csp()` | Returns the request-scoped Content Security Policy builder (XP 8.1.0+) |
| `cspReportOnly()` | Returns the report-only CSP builder (XP 8.1.0+) |

### Text Components Deprecated

Text components are deprecated in XP 8. Use regular parts with a text field instead.

### Terminology Changes

| XP 7 term | XP 8 term |
|---|---|
| Controllers | HTTP functions |
| Mixins | Form fragments |
| X-data | Mixins |
| `displayName` (in descriptors) | `title` |

## TypeScript vs JavaScript

Enonic XP supports both TypeScript and JavaScript controllers.

### TypeScript Controllers

- File extension: `.ts`
- Use ES module syntax: `import ... from '...';` and `export function get(req) { ... }`
- Requires TypeScript to be configured in the project. Refer to the [TypeScript documentation](https://developer.enonic.com/docs/xp/7.x/development/typescript).
- Type definitions available via `@enonic-types/core` and `@enonic-types/lib-portal`.

### JavaScript Controllers

- File extension: `.js`
- Use CommonJS syntax: `var lib = require('/lib/xp/portal');` and `exports.get = function(req) { ... }`
- No build step required beyond the standard Gradle build.

### Choosing Between TS and JS

- For new projects, prefer TypeScript for type safety and better editor support.
- For legacy projects already using JavaScript, maintain consistency.
- Both produce the same runtime behavior — the choice is purely a developer-experience concern.

## Library Versions

### XP 7

| Library | Import Path | Gradle Dependency |
|---|---|---|
| lib-portal | `/lib/xp/portal` | `com.enonic.xp:lib-portal:${xpVersion}` |
| lib-content | `/lib/xp/content` | `com.enonic.xp:lib-content:${xpVersion}` |
| lib-thymeleaf | `/lib/thymeleaf` | `com.enonic.lib:lib-thymeleaf:2.0.0` |
| lib-mustache | `/lib/mustache` | `com.enonic.lib:lib-mustache:2.1.0` |
| lib-asset | `/lib/enonic/asset` | `com.enonic.lib:lib-asset:${libVersion}` |

### XP 8

| Library | Import Path | Gradle Dependency |
|---|---|---|
| lib-portal | `/lib/xp/portal` | `include xplibs.portal` |
| lib-content | `/lib/xp/content` | `include xplibs.content` |
| lib-thymeleaf | `/lib/thymeleaf` | `com.enonic.lib:lib-thymeleaf:2.0.0` |
| lib-mustache | `/lib/mustache` | `com.enonic.lib:lib-mustache:2.1.0` |
| lib-asset | `/lib/enonic/asset` | `com.enonic.lib:lib-asset:${libVersion}` |

### TypeScript Type Packages

| Package | Purpose |
|---|---|
| `@enonic-types/core` | Shared types (Content, Principal, Request, Response — XP 7.15+) |
| `@enonic-types/lib-portal` | Portal library type definitions |
| `@enonic-types/lib-asset` | Asset library type definitions |
| `@enonic-types/global` | Global objects (`app`, `__`, `log`) and functions (`resolve`, `require`) — highly recommended |

## Common Pitfalls

- **Do not** use a `.ts`/`.js` extension in import paths — Enonic resolves them automatically.
- **Do not** place Thymeleaf views outside the component directory unless using `resolve()` with a relative path.
- Controller file names must match the descriptor directory name exactly (e.g., `hero-banner/hero-banner.ts` with `hero-banner/hero-banner.xml`).
