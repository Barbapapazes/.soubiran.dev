# @soubiran/vite

Shared Vite plugin bundle for the `*.soubiran.dev` apps.

This package is designed for **Vue 3 + Vite + vite-ssg** projects that use:

- `pages/` as the route source
- `.md` and `.vue` pages
- frontmatter-driven SEO
- generated markdown exports, metadata, and sitemap output

## What it gives you

When you use this package in an app, it wires together the shared setup for:

- Vue pages and Markdown pages
- file-based routing from `pages/`
- `@nuxt/ui` auto-imports and component registration
- shared Markdown styling and Markdown-it enhancements
- frontmatter validation
- canonical URLs
- Open Graph image generation
- Schema.org structured data
- generated API JSON files
- generated sanitized `.md` files in `dist/`
- generated `meta.json`
- generated `sitemap.xml`

## Installation

```bash
pnpm install @soubiran/vite
```

## Basic usage

Create a `vite.config.ts`. Then use the shared plugin bundle inside `plugins`.

```ts
import soubiran from '@soubiran/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [soubiran('My App', 'my-app.soubiran.dev', {
    extractPage,
  })],
})

function extractPage(id: string) {
  return null
}
```

## Public API

### `soubiran(title, hostname, options)`

Returns a Vite plugin bundle to use inside `defineConfig({ plugins: [...] })`.

#### Parameters

##### `title: string`

The site or app name.

Used for:

- generated structured data
- SEO-related defaults

##### `hostname: string`

The public hostname without protocol.

Example:

- `infra.soubiran.dev`

Used for:

- canonical URLs
- OG image URLs
- sitemap generation
- metadata generation
- internal link UTM tagging

##### `options: Options`

Main configuration object.

### `Options`

#### `extractPage(id)`

Required.

Maps a file path to your app-specific page identifier.

This is the main extension point used by the package to:

- annotate route metadata
- compute frontmatter `page`
- drive structured data behavior
- support your wrapper selection / markdown transforms

#### `markdown`

Optional Markdown configuration passed through to the shared Markdown integration.

Most useful fields in practice:

- `wrapperComponent`
- `transforms`

Use this when you want different wrappers or content transforms depending on the route.

#### `seo.person`

Optional override for the default person data used in structured data.

If omitted, the package uses the built-in Estéban Soubiran profile.

#### `seo.assert.rules`

Optional custom frontmatter validator.

Use this to require app-specific frontmatter fields.

Example use cases:

- require `url`
- require `repository`
- enforce app-specific content rules

#### `seo.structuredData.pageConfig`

Optional callback used to choose the structured data mode for a page.

Supported page config types are:

- `default`
- `article`
- `collection`

This is the place to add breadcrumb configuration for detail pages.

#### `apiCategories`

Optional list of top-level page categories that should generate JSON API files.

Example:

```ts
apiCategories: ['websites', 'platforms']
```

If empty or omitted, no category API JSON files are generated.

## Utility exports

### `getUri(id)`

```ts
import { getUri } from '@soubiran/vite/utils'
```

Converts a page file path into the route-like URI used by the app.

Useful inside `extractPage()`.

### `toUrl(hostname, ...paths)`

```ts
import { toUrl } from '@soubiran/vite/utils'
```

Builds a full `https://...` URL.

Useful when composing structured data breadcrumbs or SEO links.

## Types

You can import these from `@soubiran/vite`:

```ts
import type {
  BreadcrumbItem,
  PersonOptions,
  StructuredDataPageConfig,
} from '@soubiran/vite'
```

## Expected app structure

This package assumes a structure like this:

```text
pages/
src/
  components/
  composables/
```

Important expectations:

- routes come from `pages/`
- both `.md` and `.vue` pages are supported
- generated router types go to `src/typed-router.d.ts`
- generated auto-import types go to `src/auto-imports.d.ts`
- generated component types go to `src/components.d.ts`
- the `@` alias points to `./src`

## Generated build artifacts

Depending on your app configuration, a production build can generate:

- `dist/sitemap.xml`
- `dist/meta.json`
- `dist/index.md` and other sanitized markdown exports
- `dist/api/<category>.json`
- `public/og/<route>.png`

### `meta.json`

Contains page-level metadata for markdown pages.

### `api/<category>.json`

Contains frontmatter data for markdown files under categories like `pages/websites/` or `pages/platforms/`.

### sanitized `.md` files in `dist/`

These are markdown exports intended for machine-friendly consumption.

They:

- remove frontmatter
- strip HTML tags
- prepend the page title as an H1 when available

### `sitemap.xml`

Generated from the routes rendered during the SSG build.
