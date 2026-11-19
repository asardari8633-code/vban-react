import type { LocaleMessages } from '@vben/locales';

import { $t, setupI18n as coreSetup } from '@vben/locales';
import { preferences } from '@vben/preferences';

const modules = import.meta.glob<{ default: LocaleMessages }>('./langs/**/*.json', {
  eager: true,
});

/**
 * پیام‌های اختصاصی برنامه (هر فایل JSON یک فضای نام است: page, demos, system, ...)
 */
function loadMessages(lang: string): LocaleMessages {
  const messages: LocaleMessages = {};
  for (const [path, mod] of Object.entries(modules)) {
    const match = path.match(/\.\/langs\/([^/]+)\/(.+)\.json$/);
    if (!match || match[1] !== lang) continue;
    messages[match[2] as string] = mod.default;
  }
  return messages;
}

async function setupI18n() {
  await coreSetup({
    defaultLocale: preferences.app.locale,
    loadMessages,
  });
}

export { $t, setupI18n };
