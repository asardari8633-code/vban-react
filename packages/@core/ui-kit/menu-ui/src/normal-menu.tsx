import type { MenuRecordRaw } from '@vben-core/typings';

import { VbenIcon } from '@vben-core/icons';
import { cn } from '@vben-core/shared';

import { MenuBadge } from './menu-badge';

interface NormalMenuProps {
  /** مسیر فعال */
  activePath?: string;
  /** جمع‌شده (فقط آیکون) */
  collapse?: boolean;
  menus: MenuRecordRaw[];
  onEnter?: (menu: MenuRecordRaw) => void;
  onSelect?: (menu: MenuRecordRaw) => void;
  rounded?: boolean;
  theme?: 'dark' | 'light';
}

/**
 * ستون اول منوی دوستونه: آیکون + عنوان کوچک برای منوهای ریشه
 */
function NormalMenu({ activePath, collapse, menus, onEnter, onSelect, rounded = true, theme }: NormalMenuProps) {
  return (
    <ul className={cn('relative mb-0 flex list-none flex-col px-1.5', theme)}>
      {menus.map((menu) => {
        const active = activePath === menu.path;
        return (
          <li
            className={cn(
              'mb-1 flex cursor-pointer flex-col items-center justify-center gap-1 px-1 py-2.5 text-center text-foreground/80 transition-colors hover:bg-accent hover:text-foreground',
              rounded ? 'rounded-lg' : 'rounded-none',
              active && '!bg-primary !text-primary-foreground',
              collapse && 'py-3',
            )}
            key={menu.path}
            onClick={() => onSelect?.(menu)}
            onMouseEnter={() => onEnter?.(menu)}
          >
            <span className="relative inline-flex">
              <VbenIcon
                fallback
                icon={active ? menu.activeIcon || menu.icon : menu.icon}
                size={20}
              />
              {(menu.badge || menu.badgeType === 'dot') && (
                <MenuBadge
                  badge={menu.badgeType === 'dot' ? undefined : menu.badge}
                  badgeType={menu.badgeType}
                  badgeVariants={menu.badgeVariants}
                  className="absolute -end-2 -top-1 ms-0"
                />
              )}
            </span>
            {!collapse && (
              <span className="w-full truncate text-xs leading-tight">{menu.name}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export { NormalMenu };
export type { NormalMenuProps };
