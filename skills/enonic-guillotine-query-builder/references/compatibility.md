# Guillotine Version Compatibility

Version differences and migration notes between major Guillotine releases.

## Guillotine 7.x (Current Stable)

Requires **XP 7.14.0** or higher. Guillotine 7 is a full rewrite from JavaScript to Java.

### Key Changes from 6.x

- **Java-based engine**: Fully reimplemented from JavaScript to Java for improved performance and stability.
- **Extensions API**: New `exports.extensions` pattern in `guillotine/guillotine.js` for extending the GraphQL schema with custom types, input types, enums, unions, interfaces, and custom resolvers. Replaces the older `creationCallbacks`-only approach.
- **Absolute URLs by default**: All `media` and `content` URLs in `pageUrl`, `imageUrl`, `mediaUrl`, `attachmentUrl`, and `processedHtml` are now `absolute` (server) URLs generated in endpoint context.
- **`params` type changed**: The `params` argument for `pageUrl`, `mediaUrl`, `imageUrl`, and `attachmentUrl` is now `Json` instead of `String`.
- **Subscriptions removed**: GraphQL subscriptions are no longer supported.
- **Site configuration removed**: `siteConfig` is no longer available from `dataAsJson`, `site`, or `portal_Site.dataAsJson` fields.

### Breaking Changes in 7.0

| Change | Impact | Migration |
|---|---|---|
| Subscriptions removed | No GraphQL subscription support | Implement a custom solution outside Guillotine |
| `params` type changed to `Json` | URL field `params` arguments break if passed as `String` | Update `pageUrl`, `mediaUrl`, `imageUrl`, `attachmentUrl` calls to use `Json` type |
| Site configuration removed | Cannot read `siteConfig` from content fields | Obtain site config through alternative means |
| Absolute URLs by default | All generated URLs are absolute server-relative | Adjust client URL handling if previously relying on relative URLs |

### Guillotine 7 Update 1

- **`siteKey` argument**: New optional `siteKey` argument on the `guillotine` field, usable instead of the `X-Guillotine-SiteKey` header.
- **NPM type definitions**: Guillotine types available on NPM as `@enonic-types/guillotine`. Install with `npm install @enonic/guillotine-types --save-dev`.
- **`modifyUnknownFields` config**: New option to control handling of unknown fields (throw error, ignore, or log warning).

### Guillotine 7 Update 2

- **CORS support** (v7.2.0): Built-in Cross-Origin Resource Sharing support with configurable allowed origins, methods, and headers. Enabled by default. Configure via `com.enonic.app.guillotine.cfg`:
  - `cors.enabled` (default `true`), `cors.origin`, `cors.credentials` (default `false`), `cors.allowedHeaders` (default `Content-Type`), `cors.methods` (default `POST, OPTIONS`), `cors.maxAge`.

### Guillotine 7 Update 3

- **`maxQueryTokens` config** (v7.3.0): Configurable maximum number of raw tokens the parser accepts per query. Defaults to `15000`. Set via `maxQueryTokens` in `com.enonic.app.guillotine.cfg`.

### Guillotine 7 Patch Releases

- **v7.3.1**: Fixed execution failure when grammar tokens exceed 15,000.
- **v7.3.2**: Fixed string index out of range error.
- **v7.3.3 / v7.3.4**: GraphQL schema remains available if content type schema generation fails.

## Guillotine 8.0 (Latest Stable)

Requires **XP 8.0.0** or higher. Guillotine 8 will not install on XP 7.x.

Source: https://developer.enonic.com/docs/guillotine/stable (release notes at https://github.com/enonic/app-guillotine/releases/tag/v8.0.0)

### Key Changes from 7.x

- **New Content fields**: `displayNameExpression`, `displayNameListExpression`, `displayNamePlaceholder`, `displayNamePlaceholderI18nKey`, `titleI18nKey`, `descriptionI18nKey`.
- **CORS origin matching**: `cors.origin` now accepts multiple comma-separated values (e.g. `https://example.com, https://admin.example.com`), supports `*` to allow all origins, and `~`-prefixed regex patterns for dynamic matching (e.g. `~https://.*\.example\.com`).
- **`cors.exposedHeaders`**: New option sets the `Access-Control-Expose-Headers` response header, exposing extra response headers beyond the CORS safelist.

### Deprecations in 8.0

| Field | Impact | Migration |
|---|---|---|
| `ContentType.displayName` | Superseded by `title` which carries the same value | Use `title` instead; `displayName` will be removed in a future major release |

### Breaking Changes in 8.0

| Change | Impact | Migration |
|---|---|---|
| Requires XP 8.0.0+ | Will not install on XP 7.x | Upgrade Enonic XP to 8.0.0 or higher |
| `hasChildren` removed | Field removed from all Content types | Use `children` / `childrenConnection` and check if result is empty |
| `inheritsPermissions` removed | Field removed from `Permissions` type | Remove from queries; no longer exposed through the GraphQL API |
| `contentDisplayNameScript` removed | Field removed from `ContentType` | Remove from queries |
| XData types renamed | `XData_*` types renamed to `Mixin_*` | Update inline fragments: e.g. `XData_base_gpsInfo_DataConfig` → `Mixin_base_gpsInfo_DataConfig` |
| `Long` input type changed | `Long` form items return `Long` instead of `String` | Remove `parseInt` / string parsing for Long values |
| `cors.enabled` removed | CORS now enabled by setting `cors.origin`; disabled when omitted | Set `cors.origin` to enable; omit to disable |
| `cors.methods` default changed | Default changed from `POST, OPTIONS` to `GET, HEAD, POST` | Set explicitly if relying on old default |
| `cors.allowedHeaders` behavior changed | Reflects request's `Access-Control-Request-Headers` when not configured | Set explicitly to keep `Content-Type` default |

## Guillotine 6.x

### Key Changes from 5.x

- **Project-level API**: Guillotine mounts at the project root (`/site/<project>/<branch>`). Site-level deployment is removed.
- **Dynamic site context**: Set `X-Guillotine-SiteKey` header for site-scoped queries.
- **Global schema**: The GraphQL schema is generated from all installed apps across the instance, not per-site.
- **Typed x-data**: eXtra Data schemas are fully typed and grouped by application key.
- **Content Studio Playground**: Embedded GraphQL API browser available directly in Content Studio.

### Breaking Changes in 6.0

| Change | Impact | Migration |
|---|---|---|
| Site deployment removed | Cannot add Guillotine as a site app | Use `X-Guillotine-SiteKey` header or embed Guillotine in the app |
| ItemSet/OptionSet type name fix | Types generated from schema name, not label | Update introspection-based clients if label differs from name |

### Guillotine 6 Update 1

- `query` and `queryConnection` fields **deprecated** in favor of `queryDsl` and `queryDslConnection`.
- Added Query DSL input types, Highlight input types, and new enum types.
- **Migration**: Replace `query(query: "...")` string syntax with `queryDsl(query: { ... })` DSL objects.

### Guillotine 6 Update 2

- Upgraded GraphiQL to version 2.x.
- Query Playground available via GET on `/site/<repo>` endpoint.

## Guillotine 5.x

- Site-scoped deployment model (app added to site descriptor).
- `createSchema()`, `createContext()`, and `createHeadlessCmsType()` for custom/embedded schemas.
- `creationCallbacks` for extending schema types (add, modify, delete fields).
- The `query` and `queryConnection` fields use string-based query syntax.

## Query Syntax Migration: String → DSL

### Before (5.x / deprecated 6.x)

```graphql
{
  guillotine {
    query(query: "type = 'com.enonic.app.myapp:Post'", sort: "createdTime DESC", first: 10) {
      displayName
    }
  }
}
```

### After (6.x+ with queryDsl)

```graphql
{
  guillotine {
    queryDsl(
      query: {
        term: {
          field: "type"
          value: { string: "com.enonic.app.myapp:Post" }
        }
      }
      sort: { field: "createdTime", direction: DESC }
      first: 10
    ) {
      displayName
    }
  }
}
```

## Content Type Name Convention

Content type descriptors map to GraphQL type names by replacing dots and colons with underscores, and removing hyphens while capitalizing the following letter:

```
com.enonic.app.myapp:BlogPost → com_enonic_app_myapp_BlogPost
portal:template-folder        → portal_TemplateFolder
```

This applies across all Guillotine versions.
