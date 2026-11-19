import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { loadDayjsLocale } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { initStores, setTimezoneHandler } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';
import '@fontsource-variable/vazirmatn';

import { setupComponentAdapter } from './adapter/component';
import { setupFormAdapter } from './adapter/form';
import { getTimezoneApi, getTimezoneOptionsApi, setUserTimezoneApi } from './api';
import { App } from './app';
import { setupI18n } from './locales';

/**
 * راه‌اندازی برنامه
 */
async function bootstrap(namespace: string) {
  // ثبت کامپوننت‌های antd برای فرم‌های schema-محور
  setupComponentAdapter();
  setupFormAdapter();

  await setupI18n();
  await loadDayjsLocale(preferences.app.locale);
  await initStores({ namespace });

  // منطقه‌ی زمانی از سرور (پس از ورود در نگهبان دسترسی بارگذاری می‌شود)
  setTimezoneHandler({
    getTimezone: getTimezoneApi,
    getTimezoneOptions: getTimezoneOptionsApi,
    setTimezone: setUserTimezoneApi,
  });

  const root = createRoot(document.querySelector('#app') as HTMLElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export { bootstrap };
