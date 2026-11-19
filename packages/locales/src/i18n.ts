import type { Locale as AntdLocale } from 'antd/es/locale';

import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';

import authentication from './langs/fa-IR/authentication.json';
import common from './langs/fa-IR/common.json';
import preferences from './langs/fa-IR/preferences.json';
import profile from './langs/fa-IR/profile.json';
import ui from './langs/fa-IR/ui.json';

type LocaleMessages = Record<string, any>;

interface LanguageOption {
  /** جهت نوشتار */
  dir: 'ltr' | 'rtl';
  label: string;
  value: string;
}

/** زبان‌های پشتیبانی‌شده */
const SUPPORT_LANGUAGES: LanguageOption[] = [
  { dir: 'rtl', label: 'فارسی', value: 'fa-IR' },
];

const DEFAULT_LOCALE = 'fa-IR';

const coreMessages: Record<string, LocaleMessages> = {
  'fa-IR': { authentication, common, preferences, profile, ui },
};

/**
 * مقداردهی همگام i18next با پیام‌های هسته تا $t حتی هنگام import ماژول‌ها کار کند.
 * درون‌یابی با `{0}` و `{name}` (سازگار با سینتکس vue-i18n در Vben) انجام می‌شود.
 */
i18next.use(initReactI18next).init({
  defaultNS: 'translation',
  fallbackLng: DEFAULT_LOCALE,
  initAsync: false,
  interpolation: { escapeValue: false, prefix: '{', suffix: '}' },
  keySeparator: '.',
  lng: DEFAULT_LOCALE,
  nsSeparator: false,
  resources: {
    [DEFAULT_LOCALE]: { translation: coreMessages[DEFAULT_LOCALE] },
  },
  returnNull: false,
});

const i18n = i18next;

type TranslateArgs = Array<number | string> | Record<string, any>;

/**
 * ترجمه. آرگومان‌ها می‌توانند آرایه (برای `{0}`) یا شیء باشند.
 * اگر کلید پیدا نشود خود متن برگردانده می‌شود (مناسب عنوان‌های غیرکلیدی).
 */
function $t(key: string, args?: TranslateArgs): string {
  if (!key) return '';
  const options = Array.isArray(args)
    ? Object.fromEntries(args.map((v, i) => [String(i), v]))
    : args;
  return i18next.t(key, { defaultValue: key, ...options }) as string;
}

/**
 * ادغام پیام‌های برنامه با پیام‌های هسته
 */
function loadLocaleMessages(lang: string, messages: LocaleMessages) {
  i18next.addResourceBundle(lang, 'translation', messages, true, true);
}

interface LocaleSetupOptions {
  /** زبان پیش‌فرض */
  defaultLocale?: string;
  /** بارگذار پیام‌های اختصاصی برنامه */
  loadMessages?: (lang: string) => LocaleMessages | Promise<LocaleMessages>;
}

let setupOptions: LocaleSetupOptions = {};

async function setupI18n(options: LocaleSetupOptions = {}) {
  setupOptions = options;
  await loadLocalesMap(options.defaultLocale || DEFAULT_LOCALE);
}

/**
 * بارگذاری و فعال‌سازی یک زبان
 */
async function loadLocalesMap(lang: string) {
  const appMessages = (await setupOptions.loadMessages?.(lang)) ?? {};
  loadLocaleMessages(lang, appMessages);
  await i18next.changeLanguage(lang);
  const option = getLanguageOption(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = option?.dir ?? 'ltr';
}

function getLanguageOption(lang: string) {
  return SUPPORT_LANGUAGES.find((item) => item.value === lang);
}

/**
 * جهت نوشتار زبان
 */
function getLocaleDirection(lang: string = i18next.language): 'ltr' | 'rtl' {
  return getLanguageOption(lang)?.dir ?? 'ltr';
}

/**
 * هوک ترجمه برای کامپوننت‌ها
 */
function useI18n() {
  const { i18n: instance } = useTranslation();
  return {
    $t,
    dir: getLocaleDirection(instance.language),
    locale: instance.language,
    t: $t,
  };
}

/**
 * بسته‌ی زبان antd برای زبان فعلی
 */
async function loadAntdLocale(lang: string): Promise<AntdLocale> {
  switch (lang) {
    default: {
      const mod = await import('antd/locale/fa_IR');
      return (mod.default ?? mod) as AntdLocale;
    }
  }
}

/**
 * زبان dayjs
 */
async function loadDayjsLocale(lang: string) {
  const dayjs = (await import('dayjs')).default;
  switch (lang) {
    default: {
      await import('dayjs/locale/fa');
      dayjs.locale('fa');
    }
  }
}

export {
  $t,
  DEFAULT_LOCALE,
  getLocaleDirection,
  i18n,
  loadAntdLocale,
  loadDayjsLocale,
  loadLocaleMessages,
  loadLocalesMap,
  setupI18n,
  SUPPORT_LANGUAGES,
  useI18n,
};
export type { LanguageOption, LocaleMessages, LocaleSetupOptions };
