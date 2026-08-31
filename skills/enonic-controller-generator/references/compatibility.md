# Enonic XP Compatibility Notes

## XP Version Support

- **XP 7.x**: Legacy stable branch. All templates in this skill target XP 7.x by default.
- **XP 7.2+**: Custom icons for parts (SVG or PNG placed alongside the descriptor).
- **XP 7.8+**: `archive` and `restore` functions in lib-content.
- **XP 7.12+**: `request.getHeader(name)` for case-insensitive header lookup. `duplicate` function in lib-content.
- **XP 7.15+**: `assetUrl` from lib-portal is deprecated; use `lib-asset` or `lib-static` instead. `patch` HTTP method supported in controllers. Response headers can be set to `null` to remove headers added by other controllers/filters. `@enonic-types/core` now includes TypeScript types for `Request` and `Response` objects.
- **XP 7.16+**: GraalVM for JDK 21. No new controller-specific changes. Last XP 7 release — required as the baseline before upgrading to XP 8.

### XP 8.0 — Breaking Changes for Controllers

XP 8 is a major release that renames and restructures several core concepts. **XP 7 patterns do not work on XP 8 without migration.** Key changes affecting controllers:

| XP 7 | XP 8 | Impact |
|---|---|---|
| `src/main/resources/site/` | `src/main/resources/cms/` | All component paths change |
| XML descriptors (`.xml`) | YAML descriptors (`.yaml`) | Descriptors rewritten in YAML |
| `<display-name>` | `title:` | Field renamed in YAML descriptors |
| `site.xml` | `cms.yaml` + `site.yaml` | Site descriptor split into two YAML files |
| `exports.get` / `export function get` | `exports.GET` / `export function GET` | HTTP method exports are now uppercase |
| "Controllers" | "HTTP functions" | Terminology change in docs |
| "JS/TS APIs" (`lib-content`, etc.) | "Libraries" | Terminology change; "API" now means web APIs |
| Mixins (reusable form pieces) | Form fragments | Term "mixin" now refers to what was "x-data" in XP 7 |
| Text components | Deprecated | Use regular parts with a text field instead |

**New request properties (XP 8):**
- `request.contentPath` — the content path being rendered (site service context).
- `request.locales` — array of locale strings from the `Accept-Language` header, in decreasing preference order.

**New capabilities (XP 8):**
- Universal API replaces HTTP Services (`/_/service/` → `/api/`).
- Response processor implementations can read custom context attributes set by components via `context.setCustomLocalAttribute()` / `context.get().attributes` (lib-context) — the supported way to pass data from a component to a processor.
- Server Sent Events (SSE) supported across all web services.
- Content Security Policy (CSP) builder API — a request-scoped policy shared across page, layout, part, and processor.
- YAML descriptors use `kind:` field (`"Page"`, `"Part"`, `"Layout"`, `"Site"`, `"CMS"`).

**YAML descriptor example (page):**
```yaml
kind: "Page"
title: "My Page"
description: "Front page"
form: []
regions:
  - name: "main"
```

**YAML site descriptor (`cms/site.yaml`):**
```yaml
kind: "Site"
processors:
  - name: "tracker"
    order: 10
```

**YAML CMS descriptor (`cms/cms.yaml`):**
```yaml
kind: "CMS"
mixins:
  - name: "seo"
form:
  - name: "tracking-id"
    type: "TextLine"
    label: "Analytics tracking ID"
```

Source: https://developer.enonic.com/docs/xp/stable/release (XP 8 release notes), https://developer.enonic.com/docs/code/stable/schemas, https://developer.enonic.com/docs/code/stable/web/request-response

### XP 8.1

- **GraalJS preview**: A new JavaScript engine implementing the current ECMAScript standard (replaces Nashorn). Not yet the default; opt in per-application via the bundle manifest.
- **CSP as an API**: Request-scoped Content Security Policy builder shared across page, layouts, parts, and response processors. One nonce for the whole request.
- **Custom context attributes**: Components can pass values to response processors via `context.setCustomLocalAttribute()` (lib-context). The processor reads them back from `context.get().attributes['custom.<key>']`.
- **`content.findByParent` deprecated**: Use `content.query` with `parent` parameter instead.

Source: https://developer.enonic.com/docs/xp/stable/release (XP 8.1 release notes)

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
