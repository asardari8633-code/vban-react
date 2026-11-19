import { defineOverridesPreferences } from '@vben/preferences';

/**
 * تنظیمات اختصاصی این برنامه.
 * فقط مقادیری را بنویسید که با پیش‌فرض‌ها فرق دارند.
 * پس از تغییر، برای اعمال، حافظه‌ی مرورگر را پاک کنید (تنظیمات کاربر ذخیره می‌شود).
 */
export const overridesPreferences = defineOverridesPreferences({
  app: {
    name: import.meta.env.VITE_APP_TITLE,
  },
});
