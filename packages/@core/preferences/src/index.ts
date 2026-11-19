import type { DeepPartial } from '@vben-core/typings';

import type { Preferences } from './types';

import { preferencesManager } from './preferences';

/**
 * دسترسی زنده به تنظیمات فعلی خارج از React (مثلاً `preferences.app.accessMode`).
 * داخل کامپوننت‌ها از usePreferences استفاده کنید تا با تغییرات دوباره رندر شوند.
 */
const preferences = new Proxy({} as Preferences, {
  get(_, key: string) {
    return (preferencesManager.getPreferences() as any)[key];
  },
  has(_, key: string) {
    return key in preferencesManager.getPreferences();
  },
  ownKeys() {
    return Reflect.ownKeys(preferencesManager.getPreferences());
  },
  getOwnPropertyDescriptor(_, key) {
    return Reflect.getOwnPropertyDescriptor(preferencesManager.getPreferences(), key);
  },
});

const updatePreferences = (updates: DeepPartial<Preferences>) =>
  preferencesManager.updatePreferences(updates);

const resetPreferences = (options?: { preserveLocale?: boolean }) =>
  preferencesManager.resetPreferences(options);

const clearPreferencesCache = () => preferencesManager.clearCache();

const initPreferences = preferencesManager.initPreferences;

export {
  clearPreferencesCache,
  initPreferences,
  preferences,
  preferencesManager,
  resetPreferences,
  updatePreferences,
};

export { defaultPreferences } from './config';
export * from './constants';
export { usePreferencesStore } from './preferences';
export type * from './types';
export {
  getEffectivePrimaryColor,
  isDarkTheme,
  updateCSSVariables,
} from './update-css-variables';
export { derivePreferences, usePreferences } from './use-preferences';
