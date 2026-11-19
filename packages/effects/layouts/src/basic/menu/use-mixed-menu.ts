import type { MenuRecordRaw } from '@vben/types';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useRoute } from '@vben/hooks';
import { usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { findRootMenuByPath } from '@vben/utils';

import { useNavigation } from './use-navigation';

/**
 * منطق منوی ترکیبی/تفکیک‌شده (سربرگ + کناری)
 */
function useMixedMenu() {
  const { navigation, willOpenedByWindow } = useNavigation();
  const route = useRoute();
  const menus = useAccessStore((s) => s.accessMenus);
  const { isHeaderMixedNav, isMixedNav, isMobile, preferences } = usePreferences();

  const [splitSideMenus, setSplitSideMenus] = useState<MenuRecordRaw[]>([]);
  const [rootMenuPath, setRootMenuPath] = useState('');
  /** آخرین زیرمنوی فعال هر منوی ریشه */
  const defaultSubMap = useRef(new Map<string, string>());

  const needSplit =
    !isMobile && ((preferences.navigation.split && isMixedNav) || isHeaderMixedNav);

  const sidebarVisible = needSplit
    ? preferences.sidebar.enable && splitSideMenus.length > 0
    : preferences.sidebar.enable;

  const headerMenus = useMemo(
    () => (needSplit ? menus.map((item) => ({ ...item, children: [] })) : menus),
    [menus, needSplit],
  );

  const sidebarMenus = needSplit ? splitSideMenus : menus;
  const mixHeaderMenus = isHeaderMixedNav ? sidebarMenus : headerMenus;

  const activePath = route.meta?.activePath ?? route.path;
  const sidebarActive = activePath;
  const headerActive = needSplit ? rootMenuPath : activePath;

  function calcSideMenus(path: string) {
    let { rootMenu } = findRootMenuByPath(menus, path);
    if (!rootMenu) rootMenu = menus.find((item) => item.path === path);
    if (!rootMenu) return false;
    setRootMenuPath(rootMenu.path);
    setSplitSideMenus(rootMenu.children ?? []);
    defaultSubMap.current.set(rootMenu.path, path);
    return true;
  }

  useEffect(() => {
    const currentPath = route.meta?.activePath ?? route.meta?.link ?? route.path;
    if (willOpenedByWindow(currentPath)) return;
    calcSideMenus(currentPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.path, menus]);

  const handleMenuSelect = (key: string, mode?: string) => {
    if (!needSplit || mode === 'vertical') {
      void navigation(key);
      return;
    }
    const rootMenu = menus.find((item) => item.path === key);
    const children = rootMenu?.children ?? [];
    if (!willOpenedByWindow(key)) {
      setRootMenuPath(rootMenu?.path ?? '');
      setSplitSideMenus(children);
    }
    if (children.length === 0) {
      void navigation(key);
    } else if (rootMenu && preferences.sidebar.autoActivateChild) {
      void navigation(defaultSubMap.current.get(rootMenu.path) ?? rootMenu.path);
    }
  };

  const handleMenuOpen = (key: string, parentsPath: string[]) => {
    if (parentsPath.length <= 1 && preferences.sidebar.autoActivateChild) {
      void navigation(defaultSubMap.current.get(key) ?? key);
    }
  };

  return {
    handleMenuOpen,
    handleMenuSelect,
    headerActive,
    headerMenus,
    mixHeaderMenus,
    sidebarActive,
    sidebarMenus,
    sidebarVisible,
  };
}

export { useMixedMenu };
