/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_PREFIX: string;
  readonly VITE_ENABLE_ROOT_REDIRECT: string;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Runtime environment from env-config.js
interface RuntimeEnv {
  VITE_APP_NAME: string;
  VITE_API_URL: string;
  VITE_API_PREFIX: string;
  VITE_ENABLE_ROOT_REDIRECT: string;
}

interface Window {
  _env_?: RuntimeEnv;
}
