/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAMESPACE: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_BASE: string;
  readonly VITE_GLOB_API_URL: string;
  readonly VITE_MOCK?: string;
}

declare const __VBEN_ADMIN_METADATA__: {
  buildTime: string;
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  homepage: string;
  license: string;
  version: string;
};
