interface ApplicationConfig {
  /** آدرس پایه‌ی API */
  apiURL: string;
}

interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_?: VbenAdminProAppConfigRaw;
  }
}

/**
 * پیکربندی برنامه از env (در production از فایل _app.config.js هم خوانده می‌شود)
 */
function useAppConfig(env: Record<string, any>, isProduction: boolean): ApplicationConfig {
  const config = isProduction
    ? (window._VBEN_ADMIN_PRO_APP_CONF_ ?? (env as VbenAdminProAppConfigRaw))
    : (env as VbenAdminProAppConfigRaw);
  const { VITE_GLOB_API_URL } = config;
  return { apiURL: VITE_GLOB_API_URL ?? '/api' };
}

export { useAppConfig };
export type { ApplicationConfig };
