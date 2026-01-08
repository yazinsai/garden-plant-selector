/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TREFLE_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
