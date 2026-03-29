# Guillotine Version Compatibility

Version differences and migration notes between major Guillotine releases.

## Guillotine 6.x (Current Stable)

### Key Changes from 5.x

- **Project-level API**: Guillotine mounts at the project root (`/site/<project>/<branch>`). Site-level deployment is removed.
- **Dynamic site context**: Set `X-Guillotine-SiteKey` header or use `siteKey` argument on the `guillotine` field for site-scoped queries.
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

### After (6.x with queryDsl)

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
