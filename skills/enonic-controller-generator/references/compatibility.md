# Enonic XP Compatibility Notes

## XP Version Support

- **XP 7.x**: Current stable branch. All patterns in this skill target XP 7.x.
- **XP 7.2+**: Custom icons for parts (SVG or PNG placed alongside the descriptor).
- **XP 7.8+**: `archive` and `restore` functions in lib-content.
- **XP 7.12+**: `request.getHeader(name)` for case-insensitive header lookup. `duplicate` function in lib-content.
- **XP 7.15+**: `assetUrl` from lib-portal is deprecated; use `lib-asset` or `lib-static` instead. `patch` HTTP method supported in controllers. Response headers can be set to `null` to remove headers added by other controllers/filters. `@enonic-types/core` now includes TypeScript types for `Request` and `Response` objects.
- **XP 7.16+**: XP is powered by GraalVM for JDK 21. No controller-level API changes.

## TypeScript vs JavaScript

Enonic XP supports both TypeScript and JavaScript controllers.

### TypeScript Controllers

- File extension: `.ts`
- Use ES module syntax: `import ... from '...';` and `export function get(req) { ... }`
- Requires TypeScript to be configured in the project. Refer to the [TypeScript documentation](https://developer.enonic.com/docs/xp/stable/development/typescript).
- Type definitions available via `@enonic-types/core` and `@enonic-types/lib-portal`.
- Install `@enonic-types/global` for type definitions of global objects (`app`, `__`, `log`) and functions (`resolve`, `require`). Include it in `tsconfig.json` under `compilerOptions.types`.

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
| lib-thymeleaf | `/lib/thymeleaf` | `com.enonic.lib:lib-thymeleaf:2.1.1` |
| lib-mustache | `/lib/mustache` | `com.enonic.lib:lib-mustache:2.1.1` |
| lib-asset | `/lib/enonic/asset` | `com.enonic.lib:lib-asset:${libVersion}` |

## Common Pitfalls

- **Do not** use a `.ts`/`.js` extension in import paths — Enonic resolves them automatically.
- **Do not** place Thymeleaf views outside the component directory unless using `resolve()` with a relative path.
- Controller file names must match the descriptor directory name exactly (e.g., `hero-banner/hero-banner.ts` with `hero-banner/hero-banner.xml`).
