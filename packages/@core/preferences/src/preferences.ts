import type { DeepPartial } from '@vben-core/typings';

import type { InitialOptions, Preferences } from './types';

import {
  breakpointsTailwind,
} from '@vben-core/composables';
import {
  cloneDeep,
  debounce,
  isMacOs,
  merge,
  mergeWithArrayOverride,
  StorageManager,
} from '@vben-core/shared';
import { create } from 'zustand';

import { defaultPreferences } from './config';
import { updateColorMode, updateCSSVariables } from './update-css-variables';

const STORAGE_KEYS = {
  LOCALE: 'preferences-locale',
  MAIN: 'preferences',
  THEME: 'preferences-theme',
} as const;

interface PreferencesStoreState {
  preferences: Preferences;
}

/**
 * store سراسری تنظیمات (zustand) — منبع واحد حقیقت برای تمام تنظیمات ظاهری
 */
const usePreferencesStore = create<PreferencesStoreState>()(() => ({
  preferences: cloneDeep(defaultPreferences),
}));

class PreferenceManager {
  private cache: null | StorageManager = null;
  private debouncedSave = debounce(() => this.saveToCache(), 150);
  private initialPreferences: Preferences = defaultPreferences;
  private isInitialized = false;

  /**
   * پاک کردن تنظیمات ذخیره‌شده
   */
  clearCache = () => {
    this.debouncedSave.cancel();
    Object.values(STORAGE_KEYS).forEach((key) => this.cache?.removeItem(key));
  };

  getInitialPreferences = () => this.initialPreferences;

  /**
   * تنظیمات فعلی (فقط‌خواندنی)
   */
  getPreferences = (): Preferences => usePreferencesStore.getState().preferences;

  /**
   * مقداردهی اولیه
   * @param options.namespace فضای نام برای جداسازی ذخیره‌سازی برنامه‌ها
   * @param options.overrides تنظیمات اختصاصی برنامه
   */
  initPreferences = async ({ namespace, overrides }: InitialOptions) => {
    if (this.isInitialized) return;

    this.cache = new StorageManager({ prefix: namespace });
    // ادغام: overrides اولویت دارد و defaults فقط جاهای خالی را پر می‌کند
    this.initialPreferences = mergeWithArrayOverride(
      {},
      overrides,
      defaultPreferences,
    );

    const cached = this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN) || {};
    const merged = mergeWithArrayOverride({}, cached, this.initialPreferences);

    this.updatePreferences(merged);
    this.setupWatcher();
    document.documentElement.dataset.platform = isMacOs() ? 'macOs' : 'window';
    this.isInitialized = true;
  };

  /**
   * بازگرداندن به تنظیمات اولیه
   */
  resetPreferences = ({ preserveLocale = true } = {}) => {
    const current = this.getPreferences();
    const initial = cloneDeep(this.initialPreferences);
    if (preserveLocale) initial.app.locale = current.app.locale;
    initial.app.isMobile = current.app.isMobile;
    usePreferencesStore.setState({ preferences: initial });
    this.handleUpdates(initial, initial);
    this.saveToCache();
  };

  /**
   * به‌روزرسانی بخشی از تنظیمات (ادغام عمیق، آرایه‌ها جایگزین می‌شوند)
   */
  updatePreferences = (updates: DeepPartial<Preferences>) => {
    const current = this.getPreferences();
    const next = mergeWithArrayOverride<Preferences>({}, updates, current);
    usePreferencesStore.setState({ preferences: next });
    this.handleUpdates(updates, next);
    this.debouncedSave();
  };

  private handleUpdates(updates: DeepPartial<Preferences>, state: Preferences) {
    const { app, theme } = updates;
    if (theme && Object.keys(theme).length > 0) {
      updateCSSVariables(state);
    }
    if (app && ('colorGrayMode' in app || 'colorWeakMode' in app)) {
      updateColorMode(state);
    }
  }

  private saveToCache() {
    if (!this.cache) return;
    const state = this.getPreferences();
    this.cache.setItem(STORAGE_KEYS.MAIN, state);
    this.cache.setItem(STORAGE_KEYS.LOCALE, state.app.locale);
    this.cache.setItem(STORAGE_KEYS.THEME, state.theme.mode);
  }

  /**
   * گوش دادن به تغییر اندازه‌ی صفحه (موبایل) و تم سیستم
   */
  private setupWatcher() {
    const mql = window.matchMedia(`(max-width: ${breakpointsTailwind.md - 0.02}px)`);
    const syncMobile = () => {
      if (this.getPreferences().app.isMobile !== mql.matches) {
        this.updatePreferences({ app: { isMobile: mql.matches } });
      }
    };
    syncMobile();
    mql.addEventListener('change', syncMobile);

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.getPreferences().theme.mode === 'auto') {
          updateCSSVariables(this.getPreferences());
          // اطلاع به مشترکین برای محاسبه‌ی دوباره‌ی isDark
          usePreferencesStore.setState({
            preferences: merge({}, this.getPreferences()),
          });
        }
      });
  }
}

const preferencesManager = new PreferenceManager();

export { PreferenceManager, preferencesManager, usePreferencesStore };
