# Compatibility Matrix

Version requirements and compatibility notes for the Next.js + Enonic XP integration.

## Package Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js | 18.x | 20.x or later |
| Next.js | 14.x (App Router) | Latest stable |
| @enonic/nextjs-adapter | Latest stable | Latest stable |
| Enonic XP | 7.x | Latest stable |
| Guillotine app | Installed in XP | Latest from marketplace |
| Next.XP app (preview) | Installed in XP | Latest from marketplace |

## Key Compatibility Notes

### Next.js Version
- The adapter requires the App Router (introduced in Next.js 13.4+, stable in 14.x).
- Pages Router is not supported by the current adapter version.
- The project template uses the `src/app/[locale]/[[...contentPath]]/page.tsx` catch-all pattern.

### Enonic XP Version
- Guillotine GraphQL API requires Enonic XP 7.x or later.
- Content Studio preview integration requires the Next.XP marketplace app.
- The Guillotine app is automatically installed when creating a sandbox with `enonic project create`.

### @enonic/nextjs-adapter
- Provides `ComponentRegistry`, `FetchContentResult`, `PageProps`, `PartProps`, and utility functions.
- Exports `APP_NAME` and `APP_NAME_UNDERSCORED` derived from `ENONIC_APP_NAME` env variable.
- Handles draft/master branch switching automatically based on preview mode state.

### GraphQL Type Naming Convention
- Content type names in GraphQL introspection follow: dots replaced with underscores, final segment capitalized.
- `com.example.myproject:movie` → `com_example_myproject_Movie`
- `media:image` → `media_Image`
- `portal:site` → `portal_Site`

### Environment Variable Notes
- `ENONIC_MAPPINGS` format: `<locale>:<project>/<site>` with comma separation for multiple locales.
- `ENONIC_API` is the base URL without project or branch segments — those are appended automatically.
- `ENONIC_API_TOKEN` must match the secret configured in the Next.XP app on the Enonic side.

### Scaffolding
- Use `npx degit git@github.com:enonic/nextxp-template.git` to create a new project from the official template.
- The template includes boilerplate for routing, API routes, preview mode, and component registry.

### Deployment Platform Notes
- **Vercel**: Native Next.js support. Set environment variables in the project settings.
- **Other platforms**: Ensure the platform supports Next.js SSR and API routes. Configure environment variables accordingly.
- **Enonic Cloud**: Use `enonic cloud login` and `enonic cloud app install` for the backend. Create ingresses to expose APIs.
