import type { MenuRecordRaw } from '@vben/types';

import { useEffect, useRef, useState } from 'react';

import { useRoute } from '@vben/hooks';
import { usePreferences } from '@vben/preferences';
import { findRootMenuByPath } from '@vben/utils';

import { useNavigation } from './use-navigation';

/**
 * منطق منوی دوستونه (ستون اول ریشه‌ها، ستون دوم زیرمنوها)
 */
function useExtraMenu(rootMenus: MenuRecordRaw[]) {
  const { navigation, willOpenedByWindow } = useNavigation();
  const route = useRoute();
  const { preferences } = usePreferences();
  const defaultSubMap = useRef(new Map<string, string>());

  const [extraMenus, setExtraMenus] = useState<MenuRecordRaw[]>([]);
  const [extraRootMenus, setExtraRootMenus] = useState<MenuRecordRaw[]>([]);
  const [lastMatchedRootPath, setLastMatchedRootPath] = useState('');
  const [sidebarExtraVisible, setSidebarExtraVisible] = useState(false);
  const [extraActiveMenu, setExtraActiveMenu] = useState('');

  const parentLevel = preferences.app.layout === 'header-mixed-nav' ? 1 : 0;

  function resolveRootMenu(currentPath: string, level = 0) {
    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(rootMenus, currentPath, level);
    const resolved = rootMenu ?? rootMenus.find((item) => item.path === currentPath);
    return { findMenu, rootMenu: resolved, rootMenuPath: rootMenuPath ?? resolved?.path };
  }

  const handleMixedMenuSelect = async (menu: MenuRecordRaw) => {
    const children = menu?.children ?? [];
    const hasChildren = children.length > 0;
    if (!willOpenedByWindow(menu.path)) {
      setExtraMenus(children);
      setExtraActiveMenu(menu.parents?.[parentLevel] ?? menu.path);
      setSidebarExtraVisible(hasChildren);
    }
    if (!hasChildren) {
      await navigation(menu.path);
    } else if (preferences.sidebar.autoActivateChild) {
      await navigation(defaultSubMap.current.get(menu.path) ?? menu.path);
    }
  };

  const handleSideMouseLeave = () => {
    if (preferences.sidebar.expandOnHover) return;
    const { findMenu, rootMenu, rootMenuPath } = resolveRootMenu(route.meta?.activePath || route.path);
    if (!rootMenuPath && !findMenu) {
      if (extraRootMenus.length > 0) {
        setExtraMenus(extraRootMenus);
        setExtraActiveMenu(lastMatchedRootPath);
        setSidebarExtraVisible(true);
      }
      return;
    }
    setExtraActiveMenu(rootMenuPath ?? findMenu?.path ?? '');
    setExtraMenus(rootMenu?.children ?? []);
  };

  const handleMenuMouseEnter = (menu: MenuRecordRaw) => {
    if (!preferences.sidebar.expandOnHover) {
      const { findMenu } = findRootMenuByPath(rootMenus, menu.path);
      const children = findMenu?.children ?? [];
      setExtraMenus(children);
      setExtraActiveMenu(menu.parents?.[parentLevel] ?? menu.path);
      setSidebarExtraVisible(children.length > 0);
    }
  };

  useEffect(() => {
    const currentPath = route.meta?.activePath || route.path;
    const { findMenu, rootMenu, rootMenuPath } = resolveRootMenu(currentPath, parentLevel);
    if (!rootMenuPath && !findMenu) return;
    setLastMatchedRootPath(rootMenuPath ?? findMenu?.path ?? '');
    setExtraRootMenus(rootMenu?.children ?? []);
    if (rootMenuPath) defaultSubMap.current.set(rootMenuPath, currentPath);
    setExtraActiveMenu(rootMenuPath ?? findMenu?.path ?? '');
    const children = rootMenu?.children ?? [];
    setExtraMenus(children);
    setSidebarExtraVisible(children.length > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.path, preferences.app.layout, preferences.sidebar.expandOnHover, rootMenus]);

  return {
    extraActiveMenu,
    extraMenus,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    setSidebarExtraVisible: (visible: boolean) =>
      setSidebarExtraVisible(visible && extraMenus.length > 0),
    sidebarExtraVisible: sidebarExtraVisible && extraMenus.length > 0,
  };
}

export { useExtraMenu };
