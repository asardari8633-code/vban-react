import { initPreferences } from '@vben/preferences';
import { unmountGlobalLoading } from '@vben/utils';

import { overridesPreferences } from './preferences';

/**
 * مقداردهی تنظیمات پیش از راه‌اندازی برنامه
 */
async function initApplication() {
  // فضای نام ذخیره‌سازی: با تغییر آن تنظیمات ذخیره‌شده از نو شروع می‌شود
  const namespace = import.meta.env.VITE_APP_NAMESPACE;

  await initPreferences({ namespace, overrides: overridesPreferences });

  const { bootstrap } = await import('./bootstrap');
  await bootstrap(namespace);

  unmountGlobalLoading();
}

void initApplication();
