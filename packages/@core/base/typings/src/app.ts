type LayoutType =
  | 'full-content'
  | 'header-mixed-nav'
  | 'header-nav'
  | 'header-sidebar-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

/**
 * محل دکمه‌ی تنظیمات
 * auto: خودکار (بسته به چیدمان بین header و fixed جابه‌جا می‌شود)
 * fixed: ثابت در لبه‌ی صفحه
 * header: نوار بالا
 * user-dropdown: داخل منوی کاربر
 * none: نمایش داده نشود
 */
type PreferencesButtonPositionType =
  | 'auto'
  | 'fixed'
  | 'header'
  | 'none'
  | 'user-dropdown';

type BuiltinThemeType =
  | 'custom'
  | 'deep-blue'
  | 'deep-green'
  | 'default'
  | 'gray'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'red'
  | 'rose'
  | 'sky-blue'
  | 'slate'
  | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc'
  | (string & {});

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';

type LayoutHeaderMenuAlignType = 'center' | 'end' | 'start';

/** حالت انقضای ورود: modal پنجره، page صفحه */
type LoginExpiredModeType = 'modal' | 'page';

/** سبک مسیرنما */
type BreadcrumbStyleType = 'background' | 'normal';

/** حالت دسترسی: backend / frontend / mixed */
type AccessModeType = 'backend' | 'frontend' | 'mixed';

/** سبک منو */
type NavigationStyleType = 'plain' | 'rounded';

/** سبک زبانه‌ها */
type TabsStyleType = 'brisk' | 'card' | 'chrome' | 'plain';

/** انیمیشن تعویض صفحه */
type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up';

/** چیدمان صفحه‌ی ورود */
type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right';

/** گزینه‌ی منطقه‌ی زمانی */
interface TimezoneOption {
  label: string;
  offset: number;
  timezone: string;
}

type WidgetPositionType = 'header' | 'none' | 'user-dropdown';

export type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
  TimezoneOption,
  WidgetPositionType,
};
