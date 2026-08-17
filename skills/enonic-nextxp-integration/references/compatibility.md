# Compatibility Matrix

Version requirements and compatibility notes for the Next.js + Enonic XP integration.

## Package Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js | 22.x (≥ 22.15.1) | Latest LTS |
| npm | 10.x (≥ 10.9.2) | Latest stable |
| Next.js | 16.x (App Router) | Latest stable |
| React | 19.x | Latest stable |
| @enonic/nextjs-adapter | 5.x | Latest stable |
| @enonic/react-components | 7.x (transitive dep) | Latest stable |
| html-react-parser | 5.x (peer dep) | Latest stable |
| Enonic XP | 7.x (8.x for new preview app) | Latest stable |
| Guillotine app | Installed in XP | Latest from marketplace |
| Next.XP app (preview) | Installed in XP | Latest from marketplace |

## Key Compatibility Notes

### Next.js Version
- The adapter v4.x requires Next.js 16+ with the App Router.
- Pages Router is not supported by the current adapter version.
- The project template uses the `src/app/[locale]/[[...contentPath]]/page.tsx` catch-all pattern.
- In Next.js 15+, `params` is a `Promise` and must be awaited: `const resolvedParams = await params;`.

### Enonic XP Version
- Guillotine GraphQL API requires Enonic XP 7.x or later.
- Content Studio preview integration requires the Next.XP marketplace app.
- The Guillotine app is automatically installed when creating a sandbox with `enonic project create`.

### @enonic/nextjs-adapter
- Version 5.x requires React 19 and Next.js 16 as peer dependencies.
- Provides `ComponentRegistry`, `FetchContentResult`, `PageProps`, `PartProps`, `LayoutProps`, `MacroProps`, and utility functions.
- Exports `APP_NAME`, `APP_NAME_UNDERSCORED`, and `APP_NAME_DASHED` derived from `ENONIC_APP_NAME` env variable.
- Exports `sanitizeGraphqlName(name)` utility for converting content type names to GraphQL type names.
- Exports `IS_DEV_MODE` boolean and `LOGGING` constant (from `ENONIC_LOGGING` env var) for diagnostics.
- Exports `encryptParams(params, secret)` and `decryptParams(blob, secret)` for AES-256-GCM encrypted preview parameters (used by `app-preview-nextjs`).
- Exports header constants: `JSESSIONID_HEADER`, `PROJECT_ID_HEADER`, `RENDER_MODE_HEADER`, `XP_BASE_URL_HEADER`.
- Exports enums: `XP_COMPONENT_TYPE` (PART, LAYOUT, TEXT, FRAGMENT, PAGE) and `XP_REQUEST_TYPE` (COMPONENT, TYPE, PAGE).
- Handles draft/master branch switching automatically based on preview mode state.
- Server-side functions (`fetchContent`, `fetchContentPathsForAllLocales`) are imported from `@enonic/nextjs-adapter/server`.
- Locale mapping functions (`getLocaleMapping`, `getLocaleMappingByLocale`, `getLocaleMappingByProjectId`) are imported from `@enonic/nextjs-adapter` (main export), not from the `/server` subpath.
- Client-side hooks (`useLocaleContext`) are imported from `@enonic/nextjs-adapter/client`.
- Includes `@enonic/react-components` v7 as a dependency for built-in view components.
- `ComponentRegistry.addComponent()` is available as a generic component registration method alongside the specific `addPart`, `addLayout`, `addPage`, `addContentType`, `addMacro` methods.

### Preview App
- The original `Next.XP` app (`com.enonic.app.nextxp`) uses a proxy-based preview with shared secret authentication.
- A newer `app-preview-nextjs` (`com.enonic.app.preview.nextjs`) uses AES-256-GCM encrypted redirect URLs instead of proxying. It requires Enonic XP 8.0+ and a `/api/mappings` endpoint in the Next.js app. Config file: `com.enonic.app.preview.nextjs.cfg`.

### GraphQL Type Naming Convention
- Content type names in GraphQL introspection follow: dots replaced with underscores, final segment capitalized.
- `com.example.myproject:movie` → `com_example_myproject_Movie`
- `media:image` → `media_Image`
- `portal:site` → `portal_Site`

### Environment Variable Notes
- `ENONIC_MAPPINGS` format: `<locale>:<project>/<site>` with comma separation for multiple locales.
- `ENONIC_API` is the base URL without project or branch segments — those are appended automatically (e.g., `http://127.0.0.1:8080/site/`).
- `ENONIC_API_TOKEN` must match the secret configured in the Next.XP app on the Enonic side.
- The template exposes `NEXT_PUBLIC_*` variants of all `ENONIC_*` variables for browser-side access.
- `ENONIC_LOGGING` controls adapter logging verbosity for diagnostics.

### Scaffolding
- Use `npx degit git@github.com:enonic/nextxp-template.git` to create a new project from the official template.
- The template (v4.0.0) includes boilerplate for routing, API routes, preview mode, SSG with ISR, and component registry.
- The template imports `@enonic/nextjs-adapter/baseMappings` in `_mappings.ts` to register built-in component types.

### Deployment Platform Notes
- **Vercel**: Native Next.js support. Set environment variables in the project settings.
- **Other platforms**: Ensure the platform supports Next.js SSR and API routes. Configure environment variables accordingly.
- **Enonic Cloud**: Use `enonic cloud login` and `enonic cloud app install` for the backend. Create ingresses to expose APIs.
