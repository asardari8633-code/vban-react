import type {
  RouteLocation,
  RouteRecordNormalized,
  TabDefinition,
} from '@vben-core/typings';

import { preferences } from '@vben-core/preferences';
import { openRouteInNewWindow, startProgress, stopProgress } from '@vben-core/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createNamespacedStorage,
  registerStoreHydrate,
  registerStoreReset,
} from '../setup';

/**
 * رابط ناوبری که لایه‌ی React (react-router) به store می‌دهد —
 * معادل پارامتر router در متدهای store نسخه‌ی Vue.
 */
interface TabRouter {
  currentRoute: () => Pick<RouteLocation, 'fullPath' | 'meta' | 'path' | 'query'>;
  replace: (to: string) => Promise<void> | void;
}

interface TabbarState {
  /** کلید زبانه‌هایی که باید زنده نگه داشته شوند (keep-alive) */
  cachedTabs: Set<string>;
  /** کلید زبانه‌هایی که موقتاً از کش خارج شده‌اند (برای refresh) */
  excludeCachedTabs: Set<string>;
  /** شمارنده‌ی تازه‌سازی هر زبانه (برای remount) */
  refreshKeys: Record<string, number>;
  /** همه‌ی زبانه‌ها */
  tabs: TabDefinition[];
  updateTime: number;
  /** تاریخچه‌ی بازدید (کلید زبانه‌ها) */
  visitHistory: string[];
}

interface TabbarActions {
  addTab: (route: RouteLocation | TabDefinition) => TabDefinition;
  closeAllTabs: (router: TabRouter) => Promise<void>;
  closeLeftTabs: (tab: TabDefinition) => void;
  closeOtherTabs: (tab: TabDefinition) => void;
  closeRightTabs: (tab: TabDefinition) => void;
  closeTab: (tab: TabDefinition, router: TabRouter) => Promise<void>;
  closeTabByKey: (key: string, router: TabRouter) => Promise<void>;
  getTabByKey: (key: string) => TabDefinition | undefined;
  getTabs: () => TabDefinition[];
  openTabInNewWindow: (tab: TabDefinition) => void;
  pinTab: (tab: TabDefinition) => void;
  refresh: (key: string) => Promise<void>;
  reset: () => void;
  resetTabTitle: (tab: TabDefinition) => void;
  setAffixTabs: (routes: RouteRecordNormalized[]) => void;
  setTabTitle: (tab: TabDefinition, title: string) => void;
  sortTabs: (oldIndex: number, newIndex: number) => void;
  toggleTabPin: (tab: TabDefinition) => void;
  unpinTab: (tab: TabDefinition) => void;
}

const MAX_VISIT_HISTORY = 50;

/**
 * کلید یکتای زبانه: query.pageKey ← یا path (اگر fullPathKey=false) ← یا fullPath
 */
function getTabKey(tab: Partial<RouteLocation> & Pick<RouteLocation, 'path'>) {
  const { fullPath, meta, path, query = {} } = tab as RouteLocation;
  const pageKey = query?.pageKey;
  const rawKey = pageKey || (meta?.fullPathKey === false ? path : (fullPath ?? path));
  try {
    return decodeURIComponent(rawKey);
  } catch {
    return rawKey;
  }
}

function getTabKeyFromTab(tab: TabDefinition): string {
  return tab.key ?? getTabKey(tab);
}

function equalTab(a: TabDefinition, b: TabDefinition) {
  return getTabKeyFromTab(a) === getTabKeyFromTab(b);
}

function isAffixTab(tab: TabDefinition) {
  return tab?.meta?.affixTab ?? false;
}

function isTabShown(tab: RouteLocation | TabDefinition) {
  const matched = 'matched' in tab ? (tab.matched ?? []) : [];
  return !tab.meta?.hideInTab && matched.every((item) => !item.meta?.hideInTab);
}

function toTab(route: RouteLocation | TabDefinition): TabDefinition {
  return {
    fullPath: route.fullPath,
    key: 'key' in route && route.key ? route.key : getTabKey(route as RouteLocation),
    meta: { ...route.meta },
    name: route.name,
    params: route.params,
    path: route.path,
    query: route.query,
  };
}

/**
 * زبانه‌ها به ترتیب نمایش: ابتدا ثابت‌ها (بر اساس affixTabOrder) سپس بقیه
 */
function sortedTabs(tabs: TabDefinition[]) {
  const affix = tabs
    .filter((tab) => isAffixTab(tab))
    .toSorted((a, b) => (a.meta?.affixTabOrder ?? 0) - (b.meta?.affixTabOrder ?? 0));
  const normal = tabs.filter((tab) => !isAffixTab(tab));
  return [...affix, ...normal];
}

function computeCachedTabs(tabs: TabDefinition[]) {
  const cache = new Set<string>();
  for (const tab of tabs) {
    if (tab.meta?.keepAlive) cache.add(getTabKeyFromTab(tab));
  }
  return cache;
}

function pushHistory(history: string[], key: string) {
  const next = history.filter((k) => k !== key);
  next.push(key);
  while (next.length > MAX_VISIT_HISTORY) next.shift();
  return next;
}

const initialState = (): TabbarState => ({
  cachedTabs: new Set(),
  excludeCachedTabs: new Set(),
  refreshKeys: {},
  tabs: [],
  updateTime: Date.now(),
  visitHistory: [],
});

const useTabbarStore = create<TabbarActions & TabbarState>()(
  persist(
    (set, get) => {
      /** اعمال فهرست جدید زبانه‌ها و به‌روزرسانی کش */
      const commitTabs = (tabs: TabDefinition[], extra: Partial<TabbarState> = {}) => {
        set({ cachedTabs: computeCachedTabs(tabs), tabs, ...extra });
      };

      const bulkCloseByKeys = (keys: string[]) => {
        const keySet = new Set(keys);
        const tabs = get().tabs.filter((item) => !keySet.has(getTabKeyFromTab(item)));
        const visitHistory = preferences.tabbar.visitHistory
          ? get().visitHistory.filter((k) => !keySet.has(k))
          : get().visitHistory;
        commitTabs(tabs, { visitHistory });
      };

      const goToTab = async (tab: TabDefinition, router: TabRouter) => {
        await router.replace(tab.fullPath || tab.path);
      };

      const goToDefaultTab = async (router: TabRouter) => {
        const first = get().getTabs()[0];
        if (first) await goToTab(first, router);
      };

      return {
        ...initialState(),

        addTab: (routeTab) => {
          let tab = toTab(routeTab);
          if (!isTabShown(routeTab)) return tab;

          const tabs = [...get().tabs];
          const tabIndex = tabs.findIndex((item) => equalTab(item, tab));
          if (tabIndex === -1) {
            const maxCount = preferences.tabbar.maxCount;
            const maxNumOfOpenTab = routeTab.meta?.maxNumOfOpenTab ?? -1;
            if (
              maxNumOfOpenTab > 0 &&
              tabs.filter((t) => t.name === routeTab.name).length >= maxNumOfOpenTab
            ) {
              const index = tabs.findIndex((item) => item.name === routeTab.name);
              if (index !== -1) tabs.splice(index, 1);
            } else if (maxCount > 0 && tabs.length >= maxCount) {
              const index = tabs.findIndex((item) => !item.meta?.affixTab);
              if (index !== -1) tabs.splice(index, 1);
            }
            tabs.push(tab);
          } else {
            const current = tabs[tabIndex] as TabDefinition;
            const merged: TabDefinition = {
              ...current,
              ...tab,
              meta: { ...current.meta, ...tab.meta },
            };
            if (current.meta && 'affixTab' in current.meta) {
              merged.meta.affixTab = current.meta.affixTab;
            }
            if (current.meta?.newTabTitle) {
              merged.meta.newTabTitle = current.meta.newTabTitle;
            }
            tab = merged;
            tabs.splice(tabIndex, 1, merged);
          }
          const visitHistory = preferences.tabbar.visitHistory
            ? pushHistory(get().visitHistory, tab.key)
            : get().visitHistory;
          commitTabs(tabs, { visitHistory });
          return tab;
        },

        closeAllTabs: async (router) => {
          const affix = get().tabs.filter((tab) => isAffixTab(tab));
          const tabs = affix.length > 0 ? affix : get().tabs.slice(0, 1);
          const keys = new Set(tabs.map((t) => getTabKeyFromTab(t)));
          commitTabs(tabs, {
            visitHistory: get().visitHistory.filter((k) => keys.has(k)),
          });
          await goToDefaultTab(router);
        },

        closeLeftTabs: (tab) => {
          const list = get().getTabs();
          const index = list.findIndex((item) => equalTab(item, tab));
          if (index < 1) return;
          bulkCloseByKeys(
            list.slice(0, index).filter((t) => !isAffixTab(t)).map((t) => getTabKeyFromTab(t)),
          );
        },

        closeOtherTabs: (tab) => {
          bulkCloseByKeys(
            get()
              .tabs.filter((t) => !equalTab(t, tab) && !isAffixTab(t))
              .map((t) => getTabKeyFromTab(t)),
          );
        },

        closeRightTabs: (tab) => {
          const list = get().getTabs();
          const index = list.findIndex((item) => equalTab(item, tab));
          if (index === -1 || index >= list.length - 1) return;
          bulkCloseByKeys(
            list.slice(index + 1).filter((t) => !isAffixTab(t)).map((t) => getTabKeyFromTab(t)),
          );
        },

        closeTab: async (tab, router) => {
          if (isAffixTab(tab)) return;
          const currentKey = getTabKey(router.currentRoute() as RouteLocation);
          const tabKey = getTabKeyFromTab(tab);

          // بستن زبانه‌ای غیر از زبانه‌ی فعلی
          if (currentKey !== tabKey) {
            bulkCloseByKeys([tabKey]);
            return;
          }

          const list = get().getTabs();
          if (list.length <= 1) {
            console.error('Failed to close the tab; only one tab remains open.');
            return;
          }

          if (preferences.tabbar.visitHistory) {
            bulkCloseByKeys([tabKey]);
            const history = [...get().visitHistory];
            let previous: TabDefinition | undefined;
            while (history.length > 0) {
              const key = history.pop() as string;
              previous = get().getTabByKey(key);
              if (previous) break;
            }
            set({ visitHistory: history });
            await (previous ? goToTab(previous, router) : goToDefaultTab(router));
            return;
          }

          const index = list.findIndex((item) => getTabKeyFromTab(item) === currentKey);
          const before = list[index - 1];
          const after = list[index + 1];
          bulkCloseByKeys([tabKey]);
          if (after) await goToTab(after, router);
          else if (before) await goToTab(before, router);
        },

        closeTabByKey: async (key, router) => {
          let decoded = key;
          try {
            decoded = decodeURIComponent(key);
          } catch {
            /* ignore */
          }
          const tab = get().tabs.find(
            (item) => getTabKeyFromTab(item) === key || getTabKeyFromTab(item) === decoded,
          );
          if (tab) await get().closeTab(tab, router);
        },

        getTabByKey: (key) => get().getTabs().find((item) => getTabKeyFromTab(item) === key),

        getTabs: () => sortedTabs(get().tabs),

        openTabInNewWindow: (tab) => {
          openRouteInNewWindow(tab.fullPath || tab.path);
        },

        pinTab: (tab) => {
          const tabs = [...get().tabs];
          const index = tabs.findIndex((item) => equalTab(item, tab));
          if (index === -1) return;
          const old = tabs[index] as TabDefinition;
          tabs.splice(index, 1, { ...old, meta: { ...old.meta, affixTab: true } });
          commitTabs(tabs);
        },

        refresh: async (key) => {
          const exclude = new Set(get().excludeCachedTabs);
          exclude.add(key);
          set({
            excludeCachedTabs: exclude,
            refreshKeys: { ...get().refreshKeys, [key]: (get().refreshKeys[key] ?? 0) + 1 },
          });
          void startProgress();
          await new Promise((resolve) => setTimeout(resolve, 200));
          const next = new Set(get().excludeCachedTabs);
          next.delete(key);
          set({ excludeCachedTabs: next });
          void stopProgress();
        },

        reset: () => set(initialState()),

        resetTabTitle: (tab) => {
          const tabs = get().tabs.map((item) =>
            equalTab(item, tab) ? { ...item, meta: { ...item.meta, newTabTitle: undefined } } : item,
          );
          commitTabs(tabs);
        },

        setAffixTabs: (routes) => {
          for (const route of routes) {
            get().addTab({
              fullPath: route.fullPath,
              hash: '',
              matched: route.matched,
              meta: { ...route.meta, affixTab: true },
              name: route.name,
              params: {},
              path: route.fullPath,
              query: {},
            });
          }
        },

        setTabTitle: (tab, title) => {
          const tabs = get().tabs.map((item) =>
            equalTab(item, tab) ? { ...item, meta: { ...item.meta, newTabTitle: title } } : item,
          );
          commitTabs(tabs);
        },

        sortTabs: (oldIndex, newIndex) => {
          const list = get().getTabs();
          const current = list[oldIndex];
          if (!current) return;
          const next = list.toSpliced(oldIndex, 1);
          next.splice(newIndex, 0, current);
          commitTabs(next);
        },

        toggleTabPin: (tab) => {
          if (tab.meta?.affixTab) get().unpinTab(tab);
          else get().pinTab(tab);
        },

        unpinTab: (tab) => {
          const tabs = [...get().tabs];
          const index = tabs.findIndex((item) => equalTab(item, tab));
          if (index === -1) return;
          const old = tabs[index] as TabDefinition;
          tabs.splice(index, 1, { ...old, meta: { ...old.meta, affixTab: false } });
          commitTabs(tabs);
        },
      };
    },
    {
      merge: (persisted, current) => {
        const state = persisted as Partial<TabbarState>;
        const tabs = state?.tabs ?? current.tabs;
        return {
          ...current,
          cachedTabs: computeCachedTabs(tabs),
          tabs,
          visitHistory: state?.visitHistory ?? current.visitHistory,
        };
      },
      name: 'core-tabbar',
      partialize: (state) =>
        preferences.tabbar.persist
          ? { tabs: state.tabs, visitHistory: state.visitHistory }
          : { tabs: [], visitHistory: [] },
      skipHydration: true,
      storage: createJSONStorage(() => createNamespacedStorage(() => sessionStorage)),
    },
  ),
);

registerStoreHydrate(() => useTabbarStore.persist.rehydrate());
registerStoreReset(() => useTabbarStore.getState().reset());

export { getTabKey, getTabKeyFromTab, isAffixTab, sortedTabs, useTabbarStore };
export type { TabRouter };
