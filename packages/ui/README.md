# `@soubiran/ui`

Shared Vue components for `soubiran.dev` applications.

## Comments

`Comments` is a smart, purpose-built façade for `api.soubiran.dev`. It owns fetching, Sanctum CSRF, authentication redirects, and localization. Reusable mutations own comment writes and cache updates, keyed shared state tracks pending operations, and operation banners remain isolated to each `Comments` instance. Custom backend or HTTP-client injection is intentionally unsupported.

### Host setup

Install Nuxt UI, Pinia, and Pinia Colada in the host application:

```ts
import ui from '@nuxt/ui/vue-plugin'
import { PiniaColada } from '@pinia/colada'
import { createPinia } from 'pinia'

app.use(ui)
app.use(createPinia())
app.use(PiniaColada)
```

Configure Nuxt UI to scan the package or register `@soubiran/ui/resolver`. Include the package styles and Tailwind source:

```css
@import "tailwindcss";
@import "@nuxt/ui";
@import "@soubiran/ui";

@source "../../node_modules/@soubiran/ui";
```

Set the backend URL:

```dotenv
VITE_API_URL=https://api.soubiran.dev
```

### Usage

```vue
<script setup lang="ts">
import { Comments } from '@soubiran/ui'
</script>

<template>
  <Comments page-id="post-uuid" locale="en" />
</template>
```

Props:

- `pageId` — required backend post identifier.
- `locale` — `en` or `fr`; defaults to `en`. It is included in query identity and sent through `Accept-Language`.
- `messages` — deep-partial overrides merged over the selected built-in locale.
- `class` and `ui` — Tailwind Variants overrides for the comments section.

```vue
<Comments
  page-id="post-uuid"
  locale="fr"
  :messages="{
    discussions: {
      DiscussionsSectionTitle: {
        title: 'Vos commentaires',
      },
    },
  }"
/>
```

Comments fetch only in the browser. Anonymous actions redirect through the backend `/login` endpoint and return to `#comments`. Validation errors stay inline; operation failures and confirmed deletions use accessible, dismissible banners. The feature does not use toasts.
