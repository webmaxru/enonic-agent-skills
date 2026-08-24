---
name: enonic-controller-generator
description: Generates Enonic XP controller files (TypeScript/JavaScript) and paired XML descriptors for pages, parts, and layouts. Covers lib-portal imports, HTTP handler exports, region definitions, Thymeleaf/Mustache rendering, and response processors. Use when scaffolding page controllers with regions, part controllers with config access, layout controllers with multi-region support, or response processors for Enonic XP sites. Do not use for content type schemas, headless Next.js/React frontends, GraphQL Guillotine queries, or non-Enonic web frameworks.
license: MIT
metadata:
  author: webmaxru
  version: "1.4"
---

# Enonic XP Controller Generator

## Procedures

**Step 1: Detect Enonic XP Project**
1. Execute `node scripts/find-enonic-targets.mjs <workspace-root>` to locate the project root and existing components.
2. If the script exits with code 1 (no markers found), inform the user that no Enonic XP project was detected and stop.
3. Record the `sitePath` from stdout — all generated files target directories relative to this path.

**Step 2: Determine XP Version**
1. Check for XP 8 markers: look for `cms/` directory under `src/main/resources/`, YAML descriptors (`.yaml`), or `xplibs.` references in `build.gradle`.
2. Check for XP 7 markers: look for `site/` directory under `src/main/resources/`, XML descriptors (`.xml`), or `com.enonic.xp:` references in `build.gradle`.
3. If both are absent, ask the user which XP version the project targets (7 or 8).
4. Read `references/compatibility.md` for the full list of version-specific differences.

**Step 3: Determine Component Type**
1. Identify which component type the user requires:
   - **Page** — renders a full page, may declare one or more regions.
   - **Part** — a leaf component with a config form, no regions.
   - **Layout** — organizes other components via named regions.
   - **Response processor** — a site-level filter that modifies the HTTP response (e.g., inject scripts).
2. If the request is ambiguous, ask the user to clarify the component type before proceeding.

**Step 4: Gather Component Details**
1. Ask for or infer the following:
   - **Component name** (kebab-case, e.g., `hero-banner`).
   - **Display name** (human-readable, e.g., `Hero Banner`). Called `title` in XP 8 descriptors.
   - **Language** — TypeScript (`.ts`, default) or JavaScript (`.js`). Read `references/compatibility.md` for guidance on TS vs JS differences.
   - **Template engine** — Thymeleaf (default) or Mustache.
   - For pages/layouts: **region names** (default: `main` for pages).
   - For parts: **form fields** (name, type, occurrences).
   - For response processors: **page contribution target** (`bodyEnd`, `headEnd`, etc.) and the content to inject.

**Step 5: Generate the Descriptor**
1. Read `references/controller-reference.md` for the descriptor schema.
2. For **XP 7**, create an XML descriptor:
   - Page: `<sitePath>/pages/<name>/<name>.xml`
   - Part: `<sitePath>/parts/<name>/<name>.xml`
   - Layout: `<sitePath>/layouts/<name>/<name>.xml`
   - Include `<display-name>`, `<description>`, `<form>` (with inputs for parts), and `<regions>` (for pages and layouts).
3. For **XP 8**, create a YAML descriptor:
   - Page: `<cmsPath>/pages/<name>/<name>.yaml`
   - Part: `<cmsPath>/parts/<name>/<name>.yaml`
   - Layout: `<cmsPath>/layouts/<name>/<name>.yaml`
   - Include `kind`, `title`, `description`, `form` (with items for parts), and `regions` (for pages and layouts).

**Step 5: Generate the Controller**
1. Read the appropriate template from `assets/`:
   - `assets/page-controller.template.ts` for pages.
   - `assets/part-controller.template.ts` for parts.
   - `assets/layout-controller.template.ts` for layouts.
2. Replace placeholders with the actual component name, config field mappings, region names, and library imports.
3. If JavaScript was requested, convert the ES module syntax to CommonJS (`require`/`exports`).
4. For **XP 8**, change exported function names to uppercase (`GET`, `POST`, etc.).
5. Read `references/controller-reference.md` for the Portal API surface (functions, import paths).
6. Place the controller at:
   - XP 7: `<sitePath>/pages|parts|layouts/<name>/<name>.ts` (or `.js`); processors at `<sitePath>/processors/<name>.js`
   - XP 8: `<cmsPath>/pages|parts|layouts/<name>/<name>.ts` (or `.js`); processors at `<cmsPath>/processors/<name>.ts`

**Step 6: Generate the View (if applicable)**
1. For pages, parts, and layouts using Thymeleaf or Mustache, generate a paired `.html` view file in the same directory as the controller.
2. For pages and layouts, include `data-portal-region="<region-name>"` attributes on container elements.
3. For region iteration, use `data-th-each="component : ${region.components}"` with `data-portal-component="${component.path}"`.

**Step 8: Wire Response Processors (if applicable)**
1. For **XP 7**:
   - Check whether `<sitePath>/site.xml` exists.
   - If it exists, add a `<response-processor>` entry inside the `<processors>` block.
   - If it does not exist, create `<sitePath>/site.xml` with the processor declaration.
2. For **XP 8**:
   - Check whether `<cmsPath>/site.yaml` exists.
   - If it exists, add the processor to the `processors` list.
   - If it does not exist, create `<cmsPath>/site.yaml` with `kind: "Site"` and the processor declaration.

**Step 9: Update build.gradle Dependencies**
1. Check the project's `build.gradle` for existing library includes.
2. For **XP 7**, add any missing dependencies:
   - `com.enonic.xp:lib-portal:${xpVersion}` — required for all controllers.
   - `com.enonic.xp:lib-content:${xpVersion}` — if the controller uses content queries.
   - `com.enonic.lib:lib-thymeleaf:2.0.0` — if using Thymeleaf rendering.
   - `com.enonic.lib:lib-mustache:2.1.0` — if using Mustache rendering.
   - `com.enonic.lib:lib-asset:${libVersion}` — if the controller generates asset URLs (replaces the deprecated `portalLib.assetUrl` in XP 7.15+).
3. For **XP 8**, use the simplified format:
   - `include xplibs.portal` — required for all controllers.
   - `include xplibs.content` — if the controller uses content queries.
   - `com.enonic.lib:lib-thymeleaf:2.0.0` — if using Thymeleaf rendering.
   - `com.enonic.lib:lib-mustache:2.1.0` — if using Mustache rendering.

**Step 10: Validate Output**
1. Verify the descriptor file name matches the parent directory name exactly.
2. Verify the controller file name matches the descriptor directory name.
3. Verify all region names in the controller/view match those declared in the descriptor.
4. Read `references/examples.md` to cross-check the generated code against known-good patterns.

## Error Handling

* If `scripts/find-enonic-targets.mjs` exits with code 1 (`NO_PROJECT`), inform the user that no Enonic XP project was found and suggest creating the standard directory structure under `src/main/resources/site/`.
* If a component with the same name already exists at the target path, warn the user and ask whether to overwrite or rename.
* If the user reports a 404 on a part or missing regions, read `references/troubleshooting.md` to diagnose common causes.
* If the generated controller fails at runtime with view resolution errors, verify the view file is co-located with the controller and the `resolve()` call uses the correct filename.