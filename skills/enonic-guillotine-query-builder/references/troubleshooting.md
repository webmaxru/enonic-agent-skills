# Guillotine Troubleshooting

Common query errors and resolution strategies.

## Null or Empty Results

| Symptom | Likely Cause | Fix |
|---|---|---|
| `get` returns `null` | Wrong key (path or ID) | Verify content exists at the exact path; check draft vs master branch. |
| `queryDsl` returns `[]` | Type filter mismatch | Ensure the `type` value matches the full descriptor, e.g. `com.enonic.app.myapp:BlogPost`, not just `BlogPost`. |
| Inline fragment returns `null` fields | Wrong GraphQL type name | Replace dots, colons, and hyphens with underscores: `com_enonic_app_myapp_BlogPost`. |
| `data` field is null | Missing inline fragment | Use `... on <TypeName> { data { ... } }` — the `data` field is type-specific. |
| Connection returns 0 edges | Query expression error | Simplify the DSL query to `matchAll: {}` to confirm data exists, then add filters incrementally. |

## Type Name Errors

**Error**: `Fragment on unknown type "com.enonic.app.myapp:BlogPost"`

GraphQL type names use underscores, not the original descriptor format:
- Wrong: `com.enonic.app.myapp:BlogPost`
- Correct: `com_enonic_app_myapp_BlogPost`

## Deprecated Query Fields

**Warning**: `query` and `queryConnection` fields are deprecated in Guillotine 6 Update 1.

Replace:
```graphql
# Deprecated
query(query: "type = 'com.enonic.app.myapp:Post'", sort: "createdTime DESC")
```

With:
```graphql
# Current
queryDsl(
  query: { term: { field: "type", value: { string: "com.enonic.app.myapp:Post" } } }
  sort: { field: "createdTime", direction: DESC }
)
```

## Site Context Issues

| Symptom | Fix |
|---|---|
| `getSite` returns null | Set `X-Guillotine-SiteKey` header with the site ID or path, or use `siteKey` argument. |
| `${site}` placeholder not resolving | Ensure site context is set via header or `siteKey` argument. Only works for `get`, `getChildren`, `getChildrenConnection`, `getPermissions`, and `getSite`. |
| Content paths return full project paths | Use `_path(type: siteRelative)` for site-relative paths. |

## Pagination Problems

| Symptom | Fix |
|---|---|
| Always getting the same page | Pass `pageInfo.endCursor` from the previous response as the `after` argument. |
| `hasNext` always false | Check `totalCount` — if it equals items returned, there are no more pages. Also verify `first` is set. |
| Different results on repeat queries | Draft branch content may change between queries. Pin to `master` branch for stable published content. |

## Aggregation Issues

| Symptom | Fix |
|---|---|
| `aggregationAsJson` is null | Aggregations are only available on `queryDslConnection`, not `queryDsl`. |
| Empty aggregation buckets | The `field` path must match the indexed property path (e.g. `data.category`, not `category`). |
| Unexpected bucket counts | `terms` aggregation defaults to 10 buckets — increase `size` for more. |

## Rich Text / HtmlArea Issues

| Symptom | Fix |
|---|---|
| Images show broken links | Use `processHtml: { type: absolute }` for full URLs. |
| `processedHtml` missing images | Ensure `imageWidths` is set if srcset is needed — without it, default scaling applies. |
| Macros not rendering | Only macros with descriptors (and built-in `disable`/`embed`) are processed. Custom macros need a descriptor XML file. |

## Schema Customization Issues

| Symptom | Fix |
|---|---|
| Custom field not appearing | Verify the `creationCallbacks` key matches the exact generated type name. Use Query Playground introspection to confirm. |
| Type not found in dictionary | Ensure `context.dictionary` is passed to `createSchema`. |

## Debugging Steps

1. Open **Query Playground** in Content Studio (Guillotine 6+) or at the GraphQL endpoint.
2. Run the top-level introspection query `{ __schema { types { name } } }` to list all available types.
3. Use `__type(name: "com_enonic_app_myapp_BlogPost") { fields { name type { name } } }` to inspect a specific type.
4. Start with a minimal query (`get` or `queryDsl` with `matchAll`), then add filters, fragments, and fields incrementally.
5. Check the Enonic XP server log for GraphQL resolution errors that are not surfaced in the API response.
