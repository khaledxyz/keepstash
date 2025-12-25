/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_ROOT_REDIRECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
