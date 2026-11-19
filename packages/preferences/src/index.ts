import type { DeepPartial } from '@vben-core/typings';

import type { Preferences } from '@vben-core/preferences';

/**
 * تعریف تنظیمات اختصاصی برنامه (فقط مقادیر متفاوت با پیش‌فرض)
 */
function defineOverridesPreferences(preferences: DeepPartial<Preferences>) {
  return preferences;
}

export { defineOverridesPreferences };
export * from '@vben-core/preferences';
