# `@soubiran/ui`

Personal Vue components for my sites, including `Page`, `Header`, `Comments`, `Feedback`, `TableOfContents`, and `ViewersCounter`.

## Host requirements

Applications must provide compatible versions of Vue, Nuxt UI, Pinia, and Pinia Colada, and register their plugins before rendering the shared components.

The comments and authentication components use `VITE_API_URL` as the `api.soubiran.dev` origin. `ViewersCounter` uses `VITE_PARTYKIT_URL` as its PartyKit host. Both variables must be exposed by the host application.
