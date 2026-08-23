/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_PARTYKIT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
