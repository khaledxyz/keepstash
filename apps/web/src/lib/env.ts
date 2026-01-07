/**
 * Get environment variable value
 * Priority: Runtime (Docker) > Build-time (Vite) > Default
 */
function getEnv(key: keyof RuntimeEnv, defaultValue = ""): string {
  // Check runtime config (from Docker)
  if (typeof window !== "undefined" && window._env_?.[key] !== undefined) {
    return window._env_[key];
  }

  // Fallback to build-time config (local development)
  const viteEnv = import.meta.env[key];
  if (viteEnv !== undefined) {
    return viteEnv;
  }

  return defaultValue;
}

/**
 * Check if running in production mode
 */
function isProd(): boolean {
  return import.meta.env.PROD;
}

/**
 * Application environment configuration
 * Using getters to ensure runtime values are read dynamically
 */
export const env = {
  get appName() {
    return getEnv("VITE_APP_NAME", "keepstash");
  },
  get apiUrl() {
    return getEnv("VITE_API_URL", "");
  },
  get apiPrefix() {
    return getEnv("VITE_API_PREFIX", "/api");
  },
  get enableRootRedirect() {
    return getEnv("VITE_ENABLE_ROOT_REDIRECT", "true");
  },
  get isProd() {
    return isProd();
  },
};

/**
 * Check if a boolean feature flag is enabled
 */
export const isFeatureEnabled = (value: string): boolean => {
  return value.toLowerCase() === "true";
};

/**
 * Get full API endpoint URL
 */
export const getApiEndpoint = (path = ""): string => {
  const base = env.apiUrl || window.location.origin;
  const prefix = env.apiPrefix;
  const fullPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${prefix}${fullPath}`;
};

/**
 * Get base URL for API configuration
 * Removes trailing slash and combines API URL with prefix
 */
const trailingSlashRegex = /\/$/;
export const getApiBaseUrl = (): string => {
  const apiUrl = env.apiUrl?.replace(trailingSlashRegex, "") ?? "";
  return `${apiUrl}${env.apiPrefix ?? ""}`;
};
