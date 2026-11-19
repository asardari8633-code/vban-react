import type { TabConfig, TabContextMenuItem } from '@vben-core/tabs-ui';

import { useEffect, useMemo, useRef } from 'react';

import { Dropdown } from 'antd';

import { useContentMaximize, useRoute, useTabRouter, useTabs } from '@vben/hooks';
import {
  ArrowLeftToLine,
  ArrowRightLeft,
  ArrowRightToLine,
  ExternalLink,
  FoldHorizontal,
  Fullscreen,
  Minimize2,
  Pin,
  PinOff,
  RotateCw,
  X,
} from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import { getTabKey, sortedTabs, useAccessStore, useTabbarStore } from '@vben/stores';
import { flattenRoutes } from '@vben/utils';
import { TabsView } from '@vben-core/tabs-ui';

/**
 * نوار زبانه‌های چیدمان: همگام با مسیر، منوی راست‌کلیک، ابزارهای بیشتر و بزرگ‌نمایی
 */
function LayoutTabbar({ showIcon }: { showIcon?: boolean }) {
  const route = useRoute();
  const router = useTabRouter();
  const tabsApi = useTabs();
  const { preferences } = usePreferences();
  const { contentIsMaximize, toggleMaximize } = useContentMaximize();
  const tabsRaw = useTabbarStore((s) => s.tabs);
  const accessRoutes = useAccessStore((s) => s.accessRoutes);
  const affixInitialized = useRef(false);

  const tabs = useMemo(() => sortedTabs(tabsRaw), [tabsRaw]);
  const currentKey = getTabKey(route);

  // زبانه‌های ثابت (affixTab) یک بار پس از بارگذاری مسیرها
  useEffect(() => {
    if (affixInitialized.current || accessRoutes.length === 0) return;
    affixInitialized.current = true;
    const affix = flattenRoutes(accessRoutes).filter((r) => r.meta?.affixTab && r.component);
    useTabbarStore.getState().setAffixTabs(affix);
  }, [accessRoutes]);

  // افزودن زبانه با تغییر مسیر
  useEffect(() => {
    // فقط مسیرهایی که صفحه رندر می‌کنند (نه پوشه‌های دارای redirect)
    const record = route.matched[route.matched.length - 1];
    if (!route.name || !record?.component) return;
    useTabbarStore.getState().addTab(route);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.fullPath, route.name]);

  const tabConfigs: TabConfig[] = tabs.map((tab) => ({
    affixTab: !!tab.meta?.affixTab,
    closable: true,
    icon: tab.meta?.icon,
    key: tab.key,
    title: $t(tab.meta?.newTabTitle || tab.meta?.title || tab.name),
  }));

  function buildMenus(config: TabConfig): TabContextMenuItem[] {
    const tab = tabs.find((t) => t.key === config.key);
    if (!tab) return [];
    const index = tabs.findIndex((t) => t.key === config.key);
    const isCurrent = tab.key === currentKey;
    const affix = !!tab.meta?.affixTab;
    const single = tabs.length <= 1;
    const closableRight = tabs.slice(index + 1).some((t) => !t.meta?.affixTab);
    const closableLeft = tabs.slice(0, index).some((t) => !t.meta?.affixTab);
    const closableOther = tabs.some((t) => t.key !== tab.key && !t.meta?.affixTab);

    return [
      {
        disabled: affix || single,
        handler: () => void tabsApi.closeCurrentTab(tab),
        icon: <X className="size-4" />,
        key: 'close',
        label: $t('preferences.tabbar.contextMenu.close'),
      },
      {
        handler: () => tabsApi.toggleTabPin(tab),
        icon: affix ? <PinOff className="size-4" /> : <Pin className="size-4" />,
        key: 'affix',
        label: affix ? $t('preferences.tabbar.contextMenu.unpin') : $t('preferences.tabbar.contextMenu.pin'),
      },
      {
        disabled: !isCurrent,
        handler: () => toggleMaximize(),
        icon: contentIsMaximize ? <Minimize2 className="size-4" /> : <Fullscreen className="size-4" />,
        key: 'maximize',
        label: contentIsMaximize
          ? $t('preferences.tabbar.contextMenu.restoreMaximize')
          : $t('preferences.tabbar.contextMenu.maximize'),
      },
      {
        disabled: !isCurrent,
        handler: () => void tabsApi.refreshTab(tab.key),
        icon: <RotateCw className="size-4" />,
        key: 'reload',
        label: $t('preferences.tabbar.contextMenu.reload'),
      },
      {
        handler: () => tabsApi.openTabInNewWindow(tab),
        icon: <ExternalLink className="size-4" />,
        key: 'open-in-new-window',
        label: $t('preferences.tabbar.contextMenu.openInNewWindow'),
        separator: true,
      },
      {
        disabled: !closableLeft,
        handler: () => tabsApi.closeLeftTabs(tab),
        icon: <ArrowLeftToLine className="size-4 rtl:rotate-180" />,
        key: 'close-left',
        label: $t('preferences.tabbar.contextMenu.closeLeft'),
        separator: true,
      },
      {
        disabled: !closableRight,
        handler: () => tabsApi.closeRightTabs(tab),
        icon: <ArrowRightToLine className="size-4 rtl:rotate-180" />,
        key: 'close-right',
        label: $t('preferences.tabbar.contextMenu.closeRight'),
      },
      {
        disabled: !closableOther,
        handler: () => tabsApi.closeOtherTabs(tab),
        icon: <FoldHorizontal className="size-4" />,
        key: 'close-other',
        label: $t('preferences.tabbar.contextMenu.closeOther'),
        separator: true,
      },
      {
        disabled: single,
        handler: () => void tabsApi.closeAllTabs(),
        icon: <ArrowRightLeft className="size-4" />,
        key: 'close-all',
        label: $t('preferences.tabbar.contextMenu.closeAll'),
      },
    ];
  }

  const currentConfig = tabConfigs.find((t) => t.key === currentKey);
  const moreItems = currentConfig ? buildMenus(currentConfig) : [];

  return (
    <>
      <TabsView
        active={currentKey}
        contextMenus={buildMenus}
        draggable={preferences.tabbar.draggable}
        middleClickToClose={preferences.tabbar.middleClickToClose}
        onActiveChange={(key) => {
          const tab = tabs.find((t) => t.key === key);
          if (tab && tab.key !== currentKey) router.replace(tab.fullPath || tab.path);
        }}
        onClose={(key) => void tabsApi.closeTabByKey(key)}
        onSortTabs={(from, to) => useTabbarStore.getState().sortTabs(from, to)}
        onUnpin={(config) => {
          const tab = tabs.find((t) => t.key === config.key);
          if (tab) tabsApi.unpinTab(tab);
        }}
        showIcon={showIcon}
        styleType={preferences.tabbar.styleType}
        tabs={tabConfigs}
        wheelable={preferences.tabbar.wheelable}
      />
      {preferences.tabbar.showMore && (
        <Dropdown
          menu={{
            items: moreItems.flatMap((item) => [
              ...(item.separator ? [{ key: `${item.key}-d`, type: 'divider' as const }] : []),
              { disabled: item.disabled, icon: item.icon, key: item.key, label: item.label, onClick: item.handler },
            ]),
          }}
          trigger={['click']}
        >
          <div className="flex-center h-full cursor-pointer border-s border-border px-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect height="7" rx="1" width="7" x="3" y="3" />
              <rect height="7" rx="1" width="7" x="14" y="3" />
              <rect height="7" rx="1" width="7" x="14" y="14" />
              <rect height="7" rx="1" width="7" x="3" y="14" />
            </svg>
          </div>
        </Dropdown>
      )}
      {preferences.tabbar.showMaximize && (
        <div
          className="flex-center h-full cursor-pointer border-s border-border px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={toggleMaximize}
        >
          {contentIsMaximize ? <Minimize2 className="size-4" /> : <Fullscreen className="size-4" />}
        </div>
      )}
    </>
  );
}

export { LayoutTabbar };
