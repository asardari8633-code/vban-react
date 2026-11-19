import type { ReactNode } from 'react';

import type { IconType, TabsStyleType } from '@vben-core/typings';

interface TabConfig {
  affixTab: boolean;
  closable: boolean;
  icon?: IconType;
  key: string;
  title: string;
}

interface TabContextMenuItem {
  disabled?: boolean;
  handler: () => void;
  icon?: ReactNode;
  key: string;
  label: ReactNode;
  /** خط جداکننده قبل از این آیتم */
  separator?: boolean;
}

interface TabsViewProps {
  /** کلید زبانه‌ی فعال */
  active?: string;
  contextMenus?: (tab: TabConfig) => TabContextMenuItem[];
  draggable?: boolean;
  middleClickToClose?: boolean;
  onActiveChange?: (key: string) => void;
  onClose?: (key: string) => void;
  onSortTabs?: (oldIndex: number, newIndex: number) => void;
  onUnpin?: (tab: TabConfig) => void;
  showIcon?: boolean;
  styleType?: TabsStyleType;
  tabs: TabConfig[];
  wheelable?: boolean;
}

export type { TabConfig, TabContextMenuItem, TabsViewProps };
