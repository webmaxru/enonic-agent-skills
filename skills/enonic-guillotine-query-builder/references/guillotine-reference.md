# Guillotine GraphQL API Reference

Condensed reference for composing Guillotine queries against Enonic XP.
Source: https://developer.enonic.com/docs/guillotine/stable/api

## Entry Point

Every query starts with the `guillotine` root field:

```graphql
{
  guillotine {
    # HeadlessCms fields here
  }
}
```

Pass `siteKey` when working in a site context:

```graphql
{
  guillotine(siteKey: "/my-site") { ... }
}
```

Or set the HTTP header `X-Guillotine-SiteKey: <IdOrPathToSite>`.

## HeadlessCms Fields (Query Operations)

| Field | Purpose |
|---|---|
| `get(key: ID): Content` | Fetch a single content by ID or path |
| `getChildren(key: ID, offset: Int, first: Int, sort: String): [Content]` | Fetch direct children of a content |
| `getChildrenConnection(key: ID, after: String, first: Int, sort: String): ContentConnection` | Children as a Relay connection |
| `getPermissions(key: ID): Permissions` | Permissions on a content |
| `getSite: portal_Site` | Parent site of current context |
| `queryDsl(query: QueryDSLInput, offset: Int, first: Int, sort: [SortDslInput]): [Content]` | Query content with DSL |
| `queryDslConnection(query: QueryDSLInput!, after: String, first: Int, sort: [SortDslInput], aggregations: [AggregationInput], highlight: HighlightInputType): QueryDSLContentConnection` | DSL query as a connection with aggregations and highlight |
| `getType(name: String!): ContentType` | Content type metadata |
| `getTypes: [ContentType]` | All available content types |

> `query` and `queryConnection` are **deprecated** since Guillotine 6 Update 1. Use `queryDsl` / `queryDslConnection` instead.

## Common Arguments

| Argument | Description | Default |
|---|---|---|
| `key` | Content path or content ID | — |
| `offset` | Start index for paging | `0` |
| `first` | Number of items to fetch | `10` |
| `sort` | Sorting expression string | `"_score DESC"` |

## Content Interface Fields

All content types share these fields. Custom content types add a `data` field.

| Field | Type | Notes |
|---|---|---|
| `_id` | `ID!` | Content ID |
| `_name` | `String!` | Content name |
| `_path(type: ContentPathType)` | `String!` | Full or site-relative path |
| `displayName` | `String` | Display name |
| `type` | `String` | Content type descriptor |
| `createdTime` | `String` | ISO datetime |
| `modifiedTime` | `String` | ISO datetime |
| `language` | `String` | Language code |
| `valid` | `Boolean` | Content validity |
| `hasChildren` | `Boolean` | Has children |
| `dataAsJson` | `JSON` | Raw data as JSON |
| `parent` | `Content` | Parent content |
| `children(offset, first, sort)` | `[Content]` | Direct children |
| `childrenConnection(after, first, sort)` | `ContentConnection` | Children as a connection |
| `publish` | `PublishInfo` | from, to, first timestamps |
| `attachments` | `[Attachment]` | File attachments |
| `components` | `[Component]` | Page components (flattened) |
| `pageUrl(type, params)` | `String` | Generated URL for this content |
| `x` | `[ExtraData]` | eXtra Data |

## Inline Fragments for Custom Types

Custom content types are accessed via inline fragments. The type name is derived from the content type descriptor by replacing dots (`.`) and colons (`:`) with underscores (`_`), and removing hyphens (`-`) while capitalizing the following letter. The first letter of each segment after a colon is capitalized.

```
com.enonic.app.myapp:BlogPost → com_enonic_app_myapp_BlogPost
portal:template-folder        → portal_TemplateFolder
base:unstructured              → base_Unstructured
```

Example:

```graphql
{
  guillotine {
    get(key: "/blog/first-post") {
      displayName
      ... on com_enonic_app_myapp_BlogPost {
        data {
          title
          body {
            processedHtml
          }
          author {
            displayName
          }
        }
      }
    }
  }
}
```

## Connection Types (Pagination)

### ContentConnection / QueryDSLContentConnection

| Field | Type |
|---|---|
| `totalCount` | `Int!` |
| `edges` | `[ContentEdge]` |
| `pageInfo` | `PageInfo` |
| `aggregationsAsJson` | `JSON` (QueryDSLContentConnection only) |
| `highlightAsJson` | `JSON` (QueryDSLContentConnection only) |

### ContentEdge

| Field | Type |
|---|---|
| `node` | `Content!` |
| `cursor` | `String!` |

### PageInfo

| Field | Type |
|---|---|
| `startCursor` | `String!` |
| `endCursor` | `String!` |
| `hasNext` | `Boolean!` |

## Query DSL Input Types

`QueryDSLInput` accepts exactly one expression field:

| Field | Type | Purpose |
|---|---|---|
| `boolean` | `BooleanDSLExpressionInput` | Compound boolean (must, should, mustNot, filter) |
| `term` | `TermDSLExpressionInput` | Exact-value match |
| `like` | `LikeDSLExpressionInput` | Wildcard match (`*`) |
| `in` | `InDSLExpressionInput` | Match any value in a list |
| `range` | `RangeDSLExpressionInput` | lt, lte, gt, gte comparisons |
| `exists` | `ExistsDSLExpressionInput` | Field exists check |
| `fulltext` | `FulltextDSLExpressionInput` | Full-text search |
| `ngram` | `NgramDSLExpressionInput` | Ngram search (partial match) |
| `stemmed` | `StemmedDSLExpressionInput` | Stemmed search with language |
| `matchAll` | `MatchAllDSLExpressionInput` | Match everything |
| `pathMatch` | `PathMatchDSLExpressionInput` | Match by path prefix |

### BooleanDSLExpressionInput

| Field | Description |
|---|---|
| `must` | All sub-queries must match, contributes to score |
| `should` | At least one should match |
| `mustNot` | Must not match |
| `filter` | Must match, does not affect score |
| `boost` | Score multiplier |

### TermDSLExpressionInput

```graphql
term: { field: "type", value: { string: "com.enonic.app.myapp:Post" } }
```

### RangeDSLExpressionInput

```graphql
range: {
  field: "data.publishDate",
  gte: { localDateTime: "2024-01-01T00:00:00" },
  lt: { localDateTime: "2025-01-01T00:00:00" }
}
```

### DSLExpressionValueInput

Exactly one type field:
`string`, `double`, `long`, `boolean`, `localDate`, `localDateTime`, `localTime`, `instant`

## SortDslInput

| Field | Type | Description |
|---|---|---|
| `field` | `String!` | Property path to sort on |
| `direction` | `DslSortDirectionType` | `ASC` or `DESC` |
| `location` | `GeoPointSortDslInput` | Optional geo-sort origin |
| `unit` | `DslGeoPointDistanceType` | Distance unit for geo-sort |

## Aggregation Input Types

Pass via `aggregations` on `queryDslConnection`. Each `AggregationInput` takes a `name` and exactly one aggregation type:

| Type | Purpose |
|---|---|
| `terms` | Bucket by field value |
| `stats` | Min, max, avg, sum, count |
| `range` | Numeric range buckets |
| `dateRange` | Date range buckets |
| `dateHistogram` | Date interval buckets |
| `getDistance` | Geo-distance buckets |
| `min` / `max` / `count` | Simple single-value aggregations |

Results are returned in `aggregationsAsJson`.

## Highlight Input Types

Pass via `highlight` on `queryDslConnection`:

| Field | Default |
|---|---|
| `encoder` | `default` (no encoding) |
| `fragmentSize` | `100` |
| `numberOfFragments` | `5` |
| `preTag` / `postTag` | `<em>` / `</em>` |
| `requireFieldMatch` | `true` |
| `properties` | Array of `HighlightPropertiesInputType` with `propertyName` |

Results are returned in `highlightAsJson`.

## RichText Type

Returned for HtmlArea fields:

| Field | Description |
|---|---|
| `raw` | Unprocessed HTML |
| `processedHtml` | Processed HTML with resolved links, images, macros |
| `macros` | Detected macros with ref, name, descriptor, config |
| `images` | Detected images with ref, content, style |
| `links` | Detected links with ref, uri, media, content |

Use `processHtml` input argument for image width srcset generation:

```graphql
body(processHtml: { imageWidths: [600, 992], type: absolute }) {
  processedHtml
  images { ref }
}
```

## Key Enum Types

| Enum | Values |
|---|---|
| `UrlType` | `server`, `absolute` |
| `ContentPathType` | `siteRelative` |
| `DslOperatorType` | `OR`, `AND` |
| `DslSortDirectionType` | `ASC`, `DESC` |
| `ComponentType` | `page`, `layout`, `image`, `part`, `text`, `fragment` |
