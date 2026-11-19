import type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  DeepPartial,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  PreferencesButtonPositionType,
  TabsStyleType,
  ThemeModeType,
  WidgetPositionType,
} from '@vben-core/typings';

interface AppPreferences {
  /** حالت دسترسی */
  accessMode: AccessModeType;
  /** چیدمان صفحه‌ی ورود/ثبت‌نام */
  authPageLayout: AuthPageLayoutType;
  /** بازه‌ی بررسی نسخه‌ی جدید (دقیقه) */
  checkUpdatesInterval: number;
  /** حالت خاکستری */
  colorGrayMode: boolean;
  /** حالت رنگ‌کوری */
  colorWeakMode: boolean;
  /** حالت فشرده */
  compact: boolean;
  /** عرض محتوا */
  contentCompact: ContentCompactType;
  /** عرض محتوای ثابت */
  contentCompactWidth: number;
  /** فاصله‌ی داخلی محتوا */
  contentPadding: number;
  contentPaddingBottom: number;
  contentPaddingLeft: number;
  contentPaddingRight: number;
  contentPaddingTop: number;
  /** آواتار پیش‌فرض */
  defaultAvatar: string;
  /** مسیر خانه‌ی پیش‌فرض */
  defaultHomePath: string;
  /** عنوان پویا */
  dynamicTitle: boolean;
  /** بررسی نسخه‌ی جدید */
  enableCheckUpdates: boolean;
  /** نمایش دکمه‌ی کپی تنظیمات */
  enableCopyPreferences: boolean;
  /** نمایش تنظیمات */
  enablePreferences: boolean;
  /** فعال بودن refresh token */
  enableRefreshToken: boolean;
  /** چسبیدن نوار تب‌های تنظیمات به بالا */
  enableStickyPreferencesNavigationBar: boolean;
  /** آیا موبایل است */
  isMobile: boolean;
  /** نوع چیدمان */
  layout: LayoutType;
  /** زبان */
  locale: string;
  /** حالت انقضای ورود */
  loginExpiredMode: LoginExpiredModeType;
  /** نام برنامه */
  name: string;
  /** محل دکمه‌ی تنظیمات */
  preferencesButtonPosition: PreferencesButtonPositionType;
  /** منطقه‌ی زمانی */
  timezone: string;
  /** واترمارک */
  watermark: boolean;
  /** متن واترمارک */
  watermarkContent: string;
  /** z-index */
  zIndex: number;
}

interface BreadcrumbPreferences {
  enable: boolean;
  hideOnlyOne: boolean;
  showHome: boolean;
  showIcon: boolean;
  styleType: BreadcrumbStyleType;
}

interface CopyrightPreferences {
  companyName: string;
  companySiteLink: string;
  date: string;
  enable: boolean;
  icp: string;
  icpLink: string;
  settingShow?: boolean;
}

interface FooterPreferences {
  enable: boolean;
  fixed: boolean;
  height: number;
}

interface HeaderPreferences {
  enable: boolean;
  height: number;
  /** مخفی (با css) */
  hidden: boolean;
  menuAlign: LayoutHeaderMenuAlignType;
  mode: LayoutHeaderModeType;
}

interface LogoPreferences {
  enable: boolean;
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fullLogoHeight?: number | string;
  logoMode: 'full' | 'icon';
  showText: boolean;
  source: string;
  sourceDark?: string;
}

interface NavigationPreferences {
  accordion: boolean;
  split: boolean;
  styleType: NavigationStyleType;
}

interface SidebarPreferences {
  autoActivateChild: boolean;
  collapsed: boolean;
  collapsedButton: boolean;
  collapsedShowTitle: boolean;
  collapseWidth: number;
  draggable: boolean;
  enable: boolean;
  expandOnHover: boolean;
  extraCollapse: boolean;
  extraCollapsedWidth: number;
  fixedButton: boolean;
  hidden: boolean;
  mixedWidth: number;
  width: number;
}

interface ShortcutKeyPreferences {
  enable: boolean;
  globalEscape: boolean;
  globalLockScreen: boolean;
  globalLogout: boolean;
  globalPreferences: boolean;
  globalSearch: boolean;
}

interface TabbarPreferences {
  draggable: boolean;
  enable: boolean;
  height: number;
  keepAlive: boolean;
  maxCount: number;
  middleClickToClose: boolean;
  persist: boolean;
  showIcon: boolean;
  showMaximize: boolean;
  showMore: boolean;
  showRefresh: boolean;
  styleType: TabsStyleType;
  visitHistory: boolean;
  wheelable: boolean;
}

interface ThemePreferences {
  builtinType: BuiltinThemeType;
  colorDestructive: string;
  colorPrimary: string;
  colorSuccess: string;
  colorWarning: string;
  fontSize: number;
  mode: ThemeModeType;
  radius: string;
  semiDarkHeader: boolean;
  semiDarkSidebar: boolean;
  semiDarkSidebarSub: boolean;
}

interface TransitionPreferences {
  enable: boolean;
  loading: boolean;
  name: PageTransitionType | (string & {});
  progress: boolean;
}

interface WidgetPreferences {
  fullscreen: boolean;
  fullscreenButtonPosition: WidgetPositionType;
  globalSearch: boolean;
  globalSearchButtonPosition: WidgetPositionType;
  languageToggle: boolean;
  languageToggleButtonPosition: WidgetPositionType;
  lockScreen: boolean;
  lockScreenButtonPosition: WidgetPositionType;
  logoutButtonPosition: WidgetPositionType;
  notification: boolean;
  notificationButtonPosition: WidgetPositionType;
  order: readonly string[];
  refresh: boolean;
  refreshButtonPosition: WidgetPositionType;
  sidebarToggle: boolean;
  themeToggle: boolean;
  themeToggleButtonPosition: WidgetPositionType;
  timezone: boolean;
  timezoneButtonPosition: WidgetPositionType;
}

interface Preferences {
  app: AppPreferences;
  breadcrumb: BreadcrumbPreferences;
  copyright: CopyrightPreferences;
  footer: FooterPreferences;
  header: HeaderPreferences;
  logo: LogoPreferences;
  navigation: NavigationPreferences;
  shortcutKeys: ShortcutKeyPreferences;
  sidebar: SidebarPreferences;
  tabbar: TabbarPreferences;
  theme: ThemePreferences;
  transition: TransitionPreferences;
  widget: WidgetPreferences;
}

type PreferencesKeys = keyof Preferences;

interface InitialOptions {
  namespace: string;
  overrides?: DeepPartial<Preferences>;
}

export type {
  AppPreferences,
  BreadcrumbPreferences,
  CopyrightPreferences,
  FooterPreferences,
  HeaderPreferences,
  InitialOptions,
  LogoPreferences,
  NavigationPreferences,
  Preferences,
  PreferencesKeys,
  ShortcutKeyPreferences,
  SidebarPreferences,
  TabbarPreferences,
  ThemePreferences,
  TransitionPreferences,
  WidgetPreferences,
};
