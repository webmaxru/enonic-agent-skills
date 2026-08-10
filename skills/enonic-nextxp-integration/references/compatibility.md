# Compatibility Matrix

Version requirements and compatibility notes for the Next.js + Enonic XP integration.

## Package Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js | 24.x (≥ 24.15.0) | Latest LTS |
| npm | 10.x (≥ 10.9.2) | Latest stable |
| Next.js | 16.x (App Router) | Latest stable |
| React | 19.x | Latest stable |
| @enonic/nextjs-adapter | 5.x | Latest stable |
| html-react-parser | 5.x (peer dep) | Latest stable |
| Enonic XP | 8.x | Latest stable |
| Guillotine app | 8.x (required for XP 8) | Latest from marketplace |
| Next.XP app (preview) | Installed in XP | Latest from marketplace |

## Key Compatibility Notes

### Next.js Version
- The adapter v4.x requires Next.js 16+ with the App Router.
- Pages Router is not supported by the current adapter version.
- The project template uses the `src/app/[locale]/[[...contentPath]]/page.tsx` catch-all pattern.
- In Next.js 15+, `params` is a `Promise` and must be awaited: `const resolvedParams = await params;`.

### Enonic XP Version
- Next.XP 5 requires Enonic XP 8.x with Guillotine 8.
- Application schemas use the YAML format in `src/main/resources/cms/` (previously XML in `src/main/resources/site/`).
- Existing Guillotine GraphQL queries work unchanged with Guillotine 8.
- Content Studio preview integration requires the Next.XP marketplace app.
- Media links in rich text use the `/_/media:image/` and `/_/media:attachment/` URL format served by XP 8.

### @enonic/nextjs-adapter
- Version 5.x requires React 19 and Next.js 16 as peer dependencies.
- Provides `ComponentRegistry`, `FetchContentResult`, `PageProps`, `PartProps`, `LayoutProps`, `MacroProps`, and utility functions.
- Exports `APP_NAME`, `APP_NAME_DASHED`, and `APP_NAME_UNDERSCORED` derived from `ENONIC_APP_NAME` env variable.
- Handles draft/master branch switching automatically based on preview mode state.
- Server-side functions (`fetchContent`, `fetchContentPathsForAllLocales`) are imported from `@enonic/nextjs-adapter/server`.
- Client-side hooks (`useLocaleContext`) are imported from `@enonic/nextjs-adapter/client`.
- Includes `@enonic/react-components` as a dependency for built-in view components.

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

### Scaffolding
- Use `npx degit git@github.com:enonic/nextxp-template.git` to create a new project from the official template.
- The template includes boilerplate for routing, API routes, preview mode, SSG with ISR, and component registry.
- The template imports `@enonic/nextjs-adapter/baseMappings` in `_mappings.ts` to register built-in component types.

### Deployment Platform Notes
- **Vercel**: Native Next.js support. Set environment variables in the project settings.
- **Other platforms**: Ensure the platform supports Next.js SSR and API routes. Configure environment variables accordingly.
- **Enonic Cloud**: Use `enonic cloud login` and `enonic cloud app install` for the backend. Create ingresses to expose APIs.
