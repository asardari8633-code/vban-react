import type { MenuProps as AntdMenuProps } from 'antd';

import type { MenuRecordRaw } from '@vben-core/typings';

import { useEffect, useMemo, useState } from 'react';

import { Menu as AntdMenu } from 'antd';

import { VbenIcon } from '@vben-core/icons';
import { cn } from '@vben-core/shared';

import { MenuBadge } from './menu-badge';

type ItemType = Required<AntdMenuProps>['items'][number];

interface MenuProps {
  /** منوی آکاردئونی (فقط یک شاخه باز) */
  accordion?: boolean;
  className?: string;
  /** حالت جمع‌شده */
  collapse?: boolean;
  /** نمایش عنوان در حالت جمع‌شده */
  collapseShowTitle?: boolean;
  /** مسیر فعال */
  defaultActive?: string;
  /** چینش منوی افقی */
  menuAlign?: 'center' | 'end' | 'start';
  menus: MenuRecordRaw[];
  mode?: 'horizontal' | 'vertical';
  onOpen?: (key: string, parentsPath: string[]) => void;
  onSelect?: (key: string, mode?: 'horizontal' | 'vertical') => void;
  /** گوشه‌های گرد */
  rounded?: boolean;
  theme?: 'dark' | 'light';
}

function findParents(menus: MenuRecordRaw[], path?: string): string[] {
  if (!path) return [];
  const walk = (list: MenuRecordRaw[], parents: string[]): null | string[] => {
    for (const item of list) {
      if (item.path === path) return parents;
      if (item.children?.length) {
        const found = walk(item.children, [...parents, item.path]);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(menus, []) ?? [];
}

function renderLabel(menu: MenuRecordRaw, showIconAbove = false) {
  if (showIconAbove) {
    return (
      <div className="flex flex-col items-center gap-1 py-1.5">
        <VbenIcon className="size-5" fallback icon={menu.icon} size={20} />
        <span className="w-full truncate text-center text-[11px] leading-tight">{menu.name}</span>
      </div>
    );
  }
  return (
    <>
      <span className="vben-menu-title">{menu.name}</span>
      <MenuBadge badge={menu.badge} badgeType={menu.badgeType} badgeVariants={menu.badgeVariants} />
    </>
  );
}

function toItems(menus: MenuRecordRaw[], level: number, iconAbove: boolean): ItemType[] {
  return menus.map((menu) => {
    const hasChildren = (menu.children?.length ?? 0) > 0;
    const stacked = iconAbove && level === 0;
    const icon = stacked ? undefined : menu.icon ? <VbenIcon icon={menu.icon} size={16} /> : undefined;
    const item: any = {
      disabled: menu.disabled,
      icon,
      key: menu.path,
      label: renderLabel(menu, stacked),
    };
    if (hasChildren) {
      item.children = toItems(menu.children as MenuRecordRaw[], level + 1, false);
      item.popupClassName = 'vben-menu-popup';
    }
    return item as ItemType;
  });
}

/**
 * منوی ناوبری مبتنی بر antd Menu
 */
function Menu({
  accordion = true,
  className,
  collapse = false,
  collapseShowTitle = false,
  defaultActive,
  menuAlign = 'start',
  menus,
  mode = 'vertical',
  onOpen,
  onSelect,
  rounded = true,
  theme = 'light',
}: MenuProps) {
  const isHorizontal = mode === 'horizontal';
  const showTitleCollapsed = !isHorizontal && collapse && collapseShowTitle;
  const items = useMemo(() => toItems(menus, 0, showTitleCollapsed), [menus, showTitleCollapsed]);

  const activeParents = useMemo(() => findParents(menus, defaultActive), [menus, defaultActive]);
  const [openKeys, setOpenKeys] = useState<string[]>(activeParents);

  // با تغییر مسیر فعال، شاخه‌ی والد باز شود
  useEffect(() => {
    if (isHorizontal || collapse) return;
    setOpenKeys((prev) => {
      const next = accordion ? activeParents : Array.from(new Set([...prev, ...activeParents]));
      return next.length === prev.length && next.every((k, i) => k === prev[i]) ? prev : next;
    });
  }, [activeParents, accordion, collapse, isHorizontal]);

  const handleOpenChange = (keys: string[]) => {
    const latest = keys.find((key) => !openKeys.includes(key));
    if (latest) {
      const parents = findParents(menus, latest);
      onOpen?.(latest, [...parents, latest]);
      if (accordion) {
        setOpenKeys([...parents, latest]);
        return;
      }
    }
    setOpenKeys(keys);
  };

  const antdMode: AntdMenuProps['mode'] = isHorizontal
    ? 'horizontal'
    : showTitleCollapsed
      ? 'vertical'
      : 'inline';

  const menu = (
    <AntdMenu
      className={cn(
        'vben-menu',
        rounded ? 'vben-menu--rounded' : 'vben-menu--plain',
        showTitleCollapsed && 'vben-menu--collapse-show-title',
        isHorizontal && 'h-full min-w-0 flex-1',
        className,
      )}
      {...(antdMode === 'inline' ? { inlineCollapsed: collapse, inlineIndent: 16 } : {})}
      items={items}
      mode={antdMode}
      onClick={({ key }) => onSelect?.(String(key), mode)}
      selectedKeys={defaultActive ? [defaultActive] : []}
      theme={theme}
      {...(antdMode === 'horizontal' || showTitleCollapsed || collapse
        ? {}
        : { onOpenChange: handleOpenChange, openKeys })}
    />
  );

  if (!isHorizontal) return menu;

  return (
    <div
      className={cn(
        'flex h-full w-full min-w-0 items-center',
        menuAlign === 'center' && 'justify-center',
        menuAlign === 'end' && 'justify-end',
      )}
    >
      {menu}
    </div>
  );
}

export { Menu };
export type { MenuProps };
