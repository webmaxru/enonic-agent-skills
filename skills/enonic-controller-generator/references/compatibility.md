# Enonic XP Compatibility Notes

## XP Version Support

- **XP 7.x**: Current stable branch. All patterns in this skill target XP 7.x.
- **XP 7.2+**: Custom icons for parts (SVG or PNG placed alongside the descriptor).
- **XP 7.8+**: `archive` and `restore` functions in lib-content.
- **XP 7.12+**: `request.getHeader(name)` for case-insensitive header lookup. `duplicate` function in lib-content.
- **XP 7.15+**: `assetUrl` from lib-portal is deprecated; use `lib-asset` or `lib-static` instead. `patch` HTTP method supported in controllers. Response headers can be set to `null` to remove headers added by other controllers/filters. `@enonic-types/core` now includes TypeScript types for `Request` and `Response` objects.
- **XP 7.16+**: GraalVM for JDK 21. No new controller-specific changes.
- **XP 8**: Major breaking release — see the dedicated section below.

## XP 8 Breaking Changes

XP 8 is a major release that renames core concepts and changes file conventions. All patterns in this skill default to XP 7.x unless noted otherwise. When targeting XP 8, apply the following changes:

### Resource path

CMS resources move from `src/main/resources/site/` to `src/main/resources/cms/`:

| Component | XP 7.x | XP 8 |
|---|---|---|
| Pages | `site/pages/<name>/` | `cms/pages/<name>/` |
| Parts | `site/parts/<name>/` | `cms/parts/<name>/` |
| Layouts | `site/layouts/<name>/` | `cms/layouts/<name>/` |
| Processors | `site/processors/` | `cms/processors/` |
| Site descriptor | `site/site.xml` | `cms/site.yaml` |

### Descriptor format

XML descriptors are replaced by YAML. The `<display-name>` element becomes `title`:

```yaml
# cms/pages/default/default.yaml
kind: "Page"
title: "Default Page"
description: "Standard page with a main region"
regions:
  - name: "main"
```

### HTTP function exports

Export names change from lowercase to uppercase:

```ts
// XP 7.x
export function get(req) { ... }

// XP 8
export function GET(req) { ... }
```

### Portal API changes

- `serviceUrl` is deprecated. Use `apiUrl` (new) for Universal APIs.
- `baseUrl` is a new function that generates a base URL for the current context.
- Text components are deprecated; use regular parts with a text field instead.

### Request object

- `locale` (string) — the resolved locale for the current request.

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

## Common Pitfalls

- **Do not** use a `.ts`/`.js` extension in import paths — Enonic resolves them automatically.
- **Do not** place Thymeleaf views outside the component directory unless using `resolve()` with a relative path.
- Controller file names must match the descriptor directory name exactly (e.g., `hero-banner/hero-banner.ts` with `hero-banner/hero-banner.xml`).
