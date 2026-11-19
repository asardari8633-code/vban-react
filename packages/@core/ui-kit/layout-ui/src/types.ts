import type { ReactNode } from 'react';

import type {
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
} from '@vben-core/typings';

interface VbenLayoutProps {
  contentCompact?: ContentCompactType;
  contentCompactWidth?: number;
  contentPadding?: number;
  contentPaddingBottom?: number;
  contentPaddingLeft?: number;
  contentPaddingRight?: number;
  contentPaddingTop?: number;
  footerEnable?: boolean;
  footerFixed?: boolean;
  footerHeight?: number;
  headerHeight?: number;
  headerHidden?: boolean;
  headerMode?: LayoutHeaderModeType;
  headerTheme?: 'dark' | 'light';
  headerToggleSidebarButton?: boolean;
  headerVisible?: boolean;
  isMobile?: boolean;
  layout?: LayoutType;
  sidebarCollapse?: boolean;
  sidebarCollapsedButton?: boolean;
  sidebarCollapseShowTitle?: boolean;
  sidebarDraggable?: boolean;
  sidebarEnable?: boolean;
  sidebarExpandOnHover?: boolean;
  sidebarExtraCollapse?: boolean;
  sidebarExtraCollapsedWidth?: number;
  sidebarExtraTitleHeight?: number;
  sidebarExtraVisible?: boolean;
  sidebarFixedButton?: boolean;
  sidebarHidden?: boolean;
  sidebarLogoVisible?: boolean;
  sidebarMixedWidth?: number;
  sidebarTheme?: 'dark' | 'light';
  sidebarThemeSub?: 'dark' | 'light';
  sidebarWidth?: number;
  sideCollapseWidth?: number;
  tabbarEnable?: boolean;
  tabbarHeight?: number;
  zIndex?: number;

  /* رویدادها */
  onSideMouseLeave?: () => void;
  onSidebarCollapseChange?: (value: boolean) => void;
  onSidebarExpandOnHoverChange?: (value: boolean) => void;
  onSidebarExtraCollapseChange?: (value: boolean) => void;
  onSidebarExtraVisibleChange?: (value: boolean) => void;
  onSidebarWidthChange?: (value: number) => void;
  onToggleSidebar?: () => void;

  /* اسلات‌ها */
  content?: ReactNode;
  contentOverlay?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  logo?: ReactNode;
  menu?: ReactNode;
  mixedMenu?: ReactNode;
  sideExtra?: ReactNode;
  sideExtraTitle?: ReactNode;
  tabbar?: ReactNode;
}

export type { VbenLayoutProps };
