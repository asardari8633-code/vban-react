import type { Preferences } from './types';

import { useMemo } from 'react';

import { diff } from '@vben-core/shared';

import { preferencesManager, usePreferencesStore } from './preferences';
import { isDarkTheme } from './update-css-variables';

/**
 * مقادیر مشتق‌شده از تنظیمات (تابع خالص، قابل استفاده خارج از React)
 */
function derivePreferences(preferences: Preferences) {
  const app = preferences.app;
  const isDark = isDarkTheme(preferences.theme.mode);
  const isMobile = app.isMobile;
  const layout = isMobile ? 'sidebar-nav' : app.layout;

  const isFullContent = app.layout === 'full-content';
  const isSideNav = app.layout === 'sidebar-nav';
  const isSideMixedNav = app.layout === 'sidebar-mixed-nav';
  const isHeaderNav = app.layout === 'header-nav';
  const isHeaderMixedNav = app.layout === 'header-mixed-nav';
  const isHeaderSidebarNav = app.layout === 'header-sidebar-nav';
  const isMixedNav = app.layout === 'mixed-nav';
  const isSideMode =
    isMixedNav || isSideMixedNav || isSideNav || isHeaderMixedNav || isHeaderSidebarNav;

  const { shortcutKeys } = preferences;

  const contentIsMaximize =
    preferences.header.hidden && preferences.sidebar.hidden && !isFullContent;

  // محل دکمه‌ی تنظیمات
  const preferencesButtonPosition = (() => {
    const { enablePreferences, preferencesButtonPosition } = app;
    if (!enablePreferences) {
      return { fixed: false, header: false, userDropdown: false };
    }
    if (preferencesButtonPosition !== 'auto') {
      return {
        fixed: preferencesButtonPosition === 'fixed',
        header: preferencesButtonPosition === 'header',
        userDropdown: preferencesButtonPosition === 'user-dropdown',
      };
    }
    const maximize = preferences.header.hidden && preferences.sidebar.hidden;
    const fixed = maximize || isFullContent || isMobile || !preferences.header.enable;
    return { fixed, header: !fixed, userDropdown: false };
  })();

  return {
    authPanelCenter: app.authPageLayout === 'panel-center',
    authPanelLeft: app.authPageLayout === 'panel-left',
    authPanelRight: app.authPageLayout === 'panel-right',
    contentIsMaximize,
    globalEscapeShortcutKey: shortcutKeys.enable && shortcutKeys.globalEscape,
    globalLockScreenShortcutKey: shortcutKeys.enable && shortcutKeys.globalLockScreen,
    globalLogoutShortcutKey: shortcutKeys.enable && shortcutKeys.globalLogout,
    globalPreferencesShortcutKey: shortcutKeys.enable && shortcutKeys.globalPreferences,
    globalSearchShortcutKey: shortcutKeys.enable && shortcutKeys.globalSearch,
    isDark,
    isFullContent,
    isHeaderMixedNav,
    isHeaderNav,
    isHeaderSidebarNav,
    isMixedNav,
    isMobile,
    isShowHeaderNav: preferences.header.enable,
    isSideMixedNav,
    isSideMode,
    isSideNav,
    keepAlive: preferences.tabbar.enable && preferences.tabbar.keepAlive,
    layout,
    locale: app.locale,
    preferencesButtonPosition,
    sidebarCollapsed: preferences.sidebar.collapsed,
    theme: (isDark ? 'dark' : 'light') as 'dark' | 'light',
  };
}

/**
 * هوک تنظیمات: تنظیمات فعلی + مقادیر مشتق‌شده. با هر تغییر تنظیمات دوباره رندر می‌شود.
 */
function usePreferences() {
  const preferences = usePreferencesStore((s) => s.preferences);
  return useMemo(() => {
    const derived = derivePreferences(preferences);
    return {
      ...derived,
      diffPreference: diff(preferencesManager.getInitialPreferences(), preferences),
      preferences,
    };
  }, [preferences]);
}

export { derivePreferences, usePreferences };
