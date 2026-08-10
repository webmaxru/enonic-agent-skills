# Enonic XP Compatibility Notes

## XP Version Support

- **XP 7.x**: Legacy stable branch. XP 7 patterns (XML descriptors, `site/` folder, lowercase HTTP method exports) are still supported in XP 7 projects.
- **XP 7.2+**: Custom icons for parts (SVG or PNG placed alongside the descriptor).
- **XP 7.8+**: `archive` and `restore` functions in lib-content.
- **XP 7.12+**: `request.getHeader(name)` for case-insensitive header lookup. `duplicate` function in lib-content.
- **XP 7.15+**: `assetUrl` from lib-portal is deprecated; use `lib-asset` or `lib-static` instead. `patch` HTTP method supported in controllers. Response headers can be set to `null` to remove headers added by other controllers/filters. `@enonic-types/core` now includes TypeScript types for `Request` and `Response` objects.
- **XP 7.16+**: GraalVM for JDK 21. No new controller-specific changes.
- **XP 8** (current): Major release with breaking changes — see the XP 8 section below.

## XP 8 Breaking Changes for Controllers

XP 8 introduces several breaking changes that affect controller generation. See the [XP 8 release notes](https://developer.enonic.com/docs/xp/stable/release) and the [dev kit upgrade guide](https://developer.enonic.com/docs/code/stable/upgrade) for the full list.

### Descriptor Format: XML → YAML

All CMS schemas and component descriptors are now written in YAML instead of XML.

- `<display-name>` → `title:`
- `<description>` → `description:`
- `<form>` → `form:` (array of form items)
- `<regions>` → `regions:` (array of `- name:` entries)

XP 7 page descriptor:
```xml
<page>
  <display-name>My Page</display-name>
  <form/>
  <regions>
    <region name="main"/>
  </regions>
</page>
```

XP 8 page descriptor:
```yaml
kind: "Page"
title: "My Page"
form: []
regions:
  - name: "main"
```

### Resource Folder: `site/` → `cms/`

Component descriptors and implementations now live under `src/main/resources/cms/` instead of `src/main/resources/site/`.

### HTTP Method Exports: Lowercase → Uppercase

XP 8 uses uppercase HTTP method names for function exports:
- `export function get(req)` → `export function GET(req)` (TypeScript)
- `exports.get = function(req)` → `exports.GET = function(req)` (JavaScript)

### Site Descriptor: `site.xml` → `site.yaml`

The site descriptor is now YAML and lives at `src/main/resources/cms/site.yaml`.

XP 7:
```xml
<site>
  <processors>
    <response-processor name="tracker" order="10"/>
  </processors>
  <form/>
</site>
```

XP 8:
```yaml
kind: "Site"
processors:
  - name: "tracker"
    order: 10
```

### New Request Properties

- `contentPath` — the content path being rendered by the site service.
- `locales` — array of locale strings in decreasing preference order, derived from `Accept-Language`.

### Component Filtering

Parts and layouts can declare `allowOnContentType` in the descriptor to limit which content types they can be placed on (enforced in Content Studio only):
```yaml
kind: "Part"
title: "My article part"
form: []
allowOnContentType:
  - "${app}:article*"
```

### Text Components Deprecated

Built-in text components are deprecated in XP 8 in favor of regular parts with a text field.

### Data Passing: `context.setCustomLocalAttribute()`

XP 8.1.0 introduces `context.setCustomLocalAttribute()` from `lib-context` for passing data from components to response processors within the same request.

### Naming Renames

| XP 7 Term | XP 8 Term |
|---|---|
| Controllers | HTTP functions |
| `displayName` (in descriptors) | `title` |
| Mixins | Form fragments |
| X-data | Mixins |
| `site/` resource folder | `cms/` |
| `site.xml` | `cms.yaml` + `site.yaml` |

## TypeScript vs JavaScript

Enonic XP supports both TypeScript and JavaScript controllers (called "HTTP functions" in XP 8).

### TypeScript Controllers

- File extension: `.ts`
- Use ES module syntax: `import ... from '...';` and `export function GET(req) { ... }` (XP 8) or `export function get(req) { ... }` (XP 7).
- Requires TypeScript to be configured in the project. Refer to the [TypeScript documentation](https://developer.enonic.com/docs/xp/stable/development/typescript).
- Type definitions available via `@enonic-types/core` and `@enonic-types/lib-portal`.

### JavaScript Controllers

- File extension: `.js`
- Use CommonJS syntax: `var lib = require('/lib/xp/portal');` and `exports.GET = function(req) { ... }` (XP 8) or `exports.get = function(req) { ... }` (XP 7).
- No build step required beyond the standard Gradle build.

### Choosing Between TS and JS

- For new projects, prefer TypeScript for type safety and better editor support.
- For legacy projects already using JavaScript, maintain consistency.
- Both produce the same runtime behavior — the choice is purely a developer-experience concern.

## Library Versions

| Library | Import Path | Gradle Dependency |
|---|---|---|
| lib-portal | `/lib/xp/portal` | `com.enonic.xp:lib-portal:${xpVersion}` |
| lib-content | `/lib/xp/content` | `com.enonic.xp:lib-content:${xpVersion}` |
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

### Form Item Naming Convention

Use `snake_case` (lowercase with underscores) for all form item names. Capital letters are flattened during indexing which can cause unexpected query behavior. The `snake_case` convention also ensures clean field names in the GraphQL API.

```yaml
name: "my_field_name"    # Recommended
name: "myFieldName"      # Avoid - capitals are flattened in the index
```

## Common Pitfalls

- **Do not** use a `.ts`/`.js` extension in import paths — Enonic resolves them automatically.
- **Do not** place Thymeleaf views outside the component directory unless using `resolve()` with a relative path.
- Controller file names must match the descriptor directory name exactly (e.g., `hero-banner/hero-banner.ts` with `hero-banner/hero-banner.xml` for XP 7 or `hero-banner/hero-banner.yaml` for XP 8).
- **XP 8**: Use uppercase HTTP method names (`GET`, `POST`). Lowercase names (`get`, `post`) will not be invoked.
- **XP 8**: Markup returned by a component must have a single root element.
