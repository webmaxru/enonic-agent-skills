# Next.XP Reference

Canonical reference for the Next.js + Enonic XP integration framework (Next.XP). Covers adapter configuration, component registry, rendering modes, Guillotine queries, preview architecture, and deployment.

Source: https://developer.enonic.com/docs/next.xp/stable

## Architecture Overview

Next.XP connects two systems:
- **Enonic XP** (backend): Content management, content types, Guillotine GraphQL API, draft/master branches, Content Studio editorial UI.
- **Next.js** (frontend): React-based rendering, server-side rendering (SSR), static site generation (SSG), App Router.

The `@enonic/nextjs-adapter` npm package bridges them by handling content fetching, component resolution, preview mode, and URL rewriting.

## Environment Configuration (.env)

Required variables in the Next.js project root `.env` file:

```
# Shared secret for preview mode authentication
ENONIC_API_TOKEN=mySecretKey

# Fully qualified Enonic application name
ENONIC_APP_NAME=com.example.myproject

# Locale-to-project/site mapping: <locale>:<project>/<site>[,<locale>:<project>/<site>]
ENONIC_MAPPINGS=en:intro/hmdb

# Base URL for the Guillotine API (without project and branch segments)
ENONIC_API=http://127.0.0.1:8080/site
```

Multiple locale mappings example:
```
ENONIC_MAPPINGS=en:intro/hmdb,no:intro-no/hmdb
```

## Project File Structure

Standard Next.XP project layout after scaffolding from `nextxp-template`:

```
.env                                  # Environment variables
src/
    proxy.ts                          # Middleware routing by locale
    components/
        _mappings.ts                  # Central component registry
        queries/                      # Guillotine GraphQL query functions
        views/                        # React view components for content types
        pages/                        # React page components
        parts/                        # React part components
        layouts/                      # React layout components
    phrases/
        en.json                       # i18n phrase files
    app/
        [locale]/
            [[...contentPath]]/
                page.tsx              # Main catch-all rendering page
            layout.tsx                # Root layout with header/footer
            error.tsx                 # Error handler
            not-found.tsx             # 404 handler
        api/
            preview/
                route.tsx             # Preview mode API route
            renderable/
                route.tsx             # Renderable check API route
            revalidate/
                route.tsx             # ISR revalidation API route
```

## Component Registry API

All component registrations go in `src/components/_mappings.ts`.

### Content Type Mapping

```typescript
import {ComponentRegistry, APP_NAME} from '@enonic/nextjs-adapter';
import getMyType from './queries/getMyType';
import MyTypeView from './views/MyTypeView';

ComponentRegistry.addContentType(`${APP_NAME}:my-type`, {
    query: getMyType,    // GraphQL query function
    view: MyTypeView     // React component
});
```

### Page Mapping

```typescript
import MainPage from './pages/Main';

ComponentRegistry.addPage(`${APP_NAME}:main`, {
    view: MainPage
});
```

### Part Mapping

```typescript
import ChildList, {childListProcessor, getChildList} from './parts/ChildList';

ComponentRegistry.addPart(`${APP_NAME}:child-list`, {
    query: getChildList,         // Query object with query() and variables()
    processor: childListProcessor, // Optional post-processing function
    view: ChildList
});
```

### Layout Mapping

```typescript
import TwoColumnLayout from './layouts/TwoColumn';

ComponentRegistry.addLayout(`${APP_NAME}:two-column`, {
    view: TwoColumnLayout
});
```

### Common Query

Data shared across all components on the page:

```typescript
ComponentRegistry.setCommonQuery([commonQuery, commonVariables]);
```

Remove if not needed to optimize performance.

## Guillotine GraphQL Query Patterns

### Content Type Query Function

A query function returns a GraphQL query string:

```typescript
import {APP_NAME_UNDERSCORED} from '@enonic/nextjs-adapter';

const getMovie = () => `
query($path:ID!){
  guillotine {
    get(key:$path) {
      displayName
      ... on ${APP_NAME_UNDERSCORED}_Movie {
        data {
          subtitle
          abstract
          release
          photos {
            ... on media_Image {
              imageUrl: imageUrl(type: absolute, scale: "width(500)")
            }
          }
        }
      }
    }
  }
}`;

export default getMovie;
```

### Part Query Object

Parts use a query object with `query()` and `variables()` functions to support dynamic configuration:

```typescript
export const getChildList = {
    query: function(path: string, context?: Context, config?: any): string {
        return `query($path:ID!, $order:String){
            guillotine {
                get(key:$path) {
                    displayName
                    children(sort: $order, first: 50) {
                        _path(type: siteRelative)
                        _id
                        displayName
                        type
                    }
                }
            }
        }`;
    },
    variables: function(path: string, context?: Context, config?: any): VariablesGetterResult {
        return {
            path,
            order: config?.sorting
        };
    }
};
```

### Type Introspection Pattern

Access content-type-specific fields via inline fragments. The type name follows the pattern: dots replaced with underscores, name capitalized.

- Content type `com.example.myproject:movie` becomes `com_example_myproject_Movie`
- Media images use `media_Image`

```graphql
... on com_example_myproject_Movie {
    data {
        subtitle
        photos {
            ... on media_Image {
                imageUrl: imageUrl(type: absolute, scale: "width(500)")
            }
        }
    }
}
```

## View Component Pattern

```typescript
import React from 'react';
import {FetchContentResult, getUrl, I18n} from '@enonic/nextjs-adapter';

const MyView = (props: FetchContentResult) => {
    const {displayName, data, parent} = props.data?.get as any;
    const meta = props.meta;

    return (
        <>
            <h2>{displayName}</h2>
            {/* Use getUrl() for all links */}
            <a href={getUrl(`/${parent._path}`, meta)}>Back</a>
        </>
    );
};

export default MyView;
```

Key adapter imports:
- `FetchContentResult` — props type for content type views.
- `PageProps` — props type for page components.
- `PartProps` — props type for part components.
- `getUrl(path, meta)` — resolves URLs for both standalone and preview modes.
- `getAsset(path, meta)` — resolves static asset URLs.
- `I18n.localize(key)` — localized string lookup from phrase files.
- `APP_NAME` — fully qualified app name from env config.
- `APP_NAME_UNDERSCORED` — app name with dots replaced by underscores for GraphQL introspection.

## Page Components with Regions

Pages define regions where editors can add parts, layouts, and text components:

Enonic page definition (`src/main/resources/site/pages/main/main.xml`):
```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<page xmlns="urn:enonic:xp:model:1.0">
  <display-name>Main page</display-name>
  <form/>
  <regions>
      <region name="main"/>
  </regions>
</page>
```

Next.js page component:
```typescript
import type {PageProps} from '@enonic/nextjs-adapter';
import RegionsView from '@enonic/nextjs-adapter/views/Region';

const MainPage = (props: PageProps) => {
    const page = props.page;
    const regions = (!page.regions || !Object.keys(page.regions).length) ? {
        main: { name: 'main', components: [] }
    } : page.regions;

    return <RegionsView {...props} page={{...page, regions}} name="main"/>;
};

export default MainPage;
```

## Preview Mode Architecture

### Flow
1. Content Studio loads preview via the Next.XP proxy app installed in Enonic XP.
2. Next.XP proxy activates Next.js preview mode via the `/api/preview` route using the shared `ENONIC_API_TOKEN`.
3. In preview mode, Next.js queries the `draft` branch of the Guillotine API (unpublished content visible).
4. The Next.XP proxy rewrites static asset URLs to resolve correctly within Content Studio.
5. `getUrl()` in component code handles link rewriting for `/preview`, `/inline`, and `/edit` base paths.

### Setup Steps
1. Install the Next.XP app in Enonic XP from the application marketplace.
2. Add Next.XP to the target site in Content Studio (Edit site → Applications combobox).
3. Default configuration: URL `http://127.0.0.1:3000`, secret `mySecretKey`.
4. For production, override via app config in Enonic Cloud console.

### Branch Switching
- **Draft branch**: Used automatically when Content Studio preview is active. Shows unpublished content.
- **Master branch**: Used by the public Next.js frontend. Only published content is visible.
- Publishing content in Content Studio moves it from draft to master.

## Deployment

### Enonic Cloud
1. Connect CLI: `enonic cloud login`
2. Install app: `enonic cloud app install`
3. Create ingress: target path `/site`, public path `/api`

### Next.js (Vercel or other)
1. Deploy the Next.js app to the hosting platform.
2. Set environment variables matching the production Enonic Cloud endpoints.
3. Configure Next.XP app in Enonic to point to the deployed Next.js URL.

### Production Environment Variables
```
ENONIC_APP_NAME=com.example.myproject
ENONIC_API=https://<account>-<solution>-<env>.enonic.net/api
ENONIC_API_TOKEN=<production-secret>
ENONIC_MAPPINGS=en:intro/hmdb,no:intro-no/hmdb
```
