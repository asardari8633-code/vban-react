import type { TabDefinition } from '@vben/types';
import type { TabRouter } from '@vben/stores';

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { getTabKey, useTabbarStore } from '@vben/stores';

import { getCurrentRoute, useRoute } from './route-registry';

/**
 * ساخت TabRouter از روی navigate در react-router
 */
function useTabRouter(): TabRouter {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      currentRoute: () => getCurrentRoute(),
      replace: (to: string) => {
        navigate(to, { replace: true });
      },
    }),
    [navigate],
  );
}

/**
 * عملیات روی زبانه‌ها (معادل useTabs در Vben)
 */
function useTabs() {
  const route = useRoute();
  const router = useTabRouter();
  const navigate = useNavigate();
  const store = useTabbarStore;

  const currentTab = useCallback((): TabDefinition => {
    const r = getCurrentRoute();
    return {
      fullPath: r.fullPath,
      key: getTabKey(r),
      meta: r.meta,
      name: r.name,
      path: r.path,
      query: r.query,
    };
  }, []);

  const closeCurrentTab = useCallback(
    async (tab?: TabDefinition) => {
      await store.getState().closeTab(tab ?? currentTab(), router);
    },
    [currentTab, router, store],
  );

  const refreshTab = useCallback(
    async (key?: string) => {
      await store.getState().refresh(key ?? getTabKey(getCurrentRoute()));
    },
    [store],
  );

  return {
    closeAllTabs: () => store.getState().closeAllTabs(router),
    closeCurrentTab,
    closeLeftTabs: (tab?: TabDefinition) => store.getState().closeLeftTabs(tab ?? currentTab()),
    closeOtherTabs: (tab?: TabDefinition) => store.getState().closeOtherTabs(tab ?? currentTab()),
    closeRightTabs: (tab?: TabDefinition) => store.getState().closeRightTabs(tab ?? currentTab()),
    closeTabByKey: (key: string) => store.getState().closeTabByKey(key, router),
    getTabDisableState: (tab?: TabDefinition) => {
      const tabs = store.getState().getTabs();
      const target = tab ?? currentTab();
      const index = tabs.findIndex((item) => item.key === target.key);
      const disabled = tabs.length <= 1;
      const meta = target.meta ?? { title: '' };
      const affix = meta.affixTab ?? false;
      return {
        disabledCloseAll: disabled,
        disabledCloseCurrent: !!affix || disabled,
        disabledCloseLeft: index === 0 || disabled,
        disabledCloseOther: disabled,
        disabledCloseRight: index === tabs.length - 1 || disabled,
        disabledRefresh: !route.path || target.path !== route.path,
      };
    },
    openTabInNewWindow: (tab?: TabDefinition) =>
      store.getState().openTabInNewWindow(tab ?? currentTab()),
    pinTab: (tab?: TabDefinition) => store.getState().pinTab(tab ?? currentTab()),
    refreshTab,
    resetTabTitle: (tab?: TabDefinition) => store.getState().resetTabTitle(tab ?? currentTab()),
    setTabTitle: (title: string, tab?: TabDefinition) =>
      store.getState().setTabTitle(tab ?? currentTab(), title),
    toggleTabPin: (tab?: TabDefinition) => store.getState().toggleTabPin(tab ?? currentTab()),
    unpinTab: (tab?: TabDefinition) => store.getState().unpinTab(tab ?? currentTab()),
    /** باز کردن مسیر در زبانه‌ی جدید با کلید یکتا */
    openTab: (path: string, pageKey?: string) => {
      const url = pageKey ? `${path}${path.includes('?') ? '&' : '?'}pageKey=${encodeURIComponent(pageKey)}` : path;
      navigate(url);
    },
  };
}

/**
 * تازه‌سازی صفحه‌ی فعلی (remount)
 */
function useRefresh() {
  const refresh = useCallback(async () => {
    await useTabbarStore.getState().refresh(getTabKey(getCurrentRoute()));
  }, []);
  return { refresh };
}

export { useRefresh, useTabRouter, useTabs };
