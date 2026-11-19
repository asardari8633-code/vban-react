import type { DragEvent, MouseEvent, ReactNode } from 'react';

import type { TabConfig, TabContextMenuItem } from './types';

import { Dropdown } from 'antd';

import { Pin, VbenIcon, X } from '@vben-core/icons';
import { cn } from '@vben-core/shared';

interface TabItemProps {
  active: boolean;
  closable: boolean;
  contextMenus?: TabContextMenuItem[];
  dragProps: Record<string, any>;
  dropTarget: boolean;
  index: number;
  onClick: () => void;
  onClose: () => void;
  onMouseDown: (e: MouseEvent) => void;
  onUnpin: () => void;
  showIcon: boolean;
  styleType: string;
  tab: TabConfig;
}

function ContextMenu({ children, items }: { children: ReactNode; items?: TabContextMenuItem[] }) {
  if (!items?.length) return <>{children}</>;
  const menuItems: any[] = [];
  items.forEach((item) => {
    if (item.separator) menuItems.push({ key: `${item.key}-divider`, type: 'divider' });
    menuItems.push({
      disabled: item.disabled,
      icon: item.icon,
      key: item.key,
      label: item.label,
      onClick: item.handler,
    });
  });
  return (
    <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
      {children}
    </Dropdown>
  );
}

function CloseOrPin({ active, closable, onClose, onUnpin, tab }: Pick<TabItemProps, 'active' | 'closable' | 'onClose' | 'onUnpin' | 'tab'>) {
  if (!closable) return null;
  if (tab.affixTab) {
    return (
      <Pin
        className={cn('mt-px size-3.5 cursor-pointer rounded-full text-accent-foreground/80 transition-all hover:text-accent-foreground', active && 'text-accent-foreground')}
        onClick={(e) => {
          e.stopPropagation();
          onUnpin();
        }}
      />
    );
  }
  return (
    <X
      className={cn('mt-0.5 size-3 cursor-pointer rounded-full text-accent-foreground/80 transition-all hover:bg-accent hover:text-accent-foreground', active && 'text-accent-foreground')}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    />
  );
}

/**
 * زبانه‌ی سبک کروم
 */
function ChromeTabItem(props: TabItemProps) {
  const { active, contextMenus, dragProps, dropTarget, index, onClick, onMouseDown, showIcon, tab } = props;
  return (
    <div
      className={cn(
        'group tabs-chrome__item relative -me-3 flex h-full cursor-pointer items-center select-none',
        active && 'is-active z-2',
        dropTarget && 'opacity-60',
      )}
      data-active={active}
      data-tab-item="true"
      onClick={onClick}
      onMouseDown={onMouseDown}
      {...dragProps}
      onDragStart={(e: DragEvent) => dragProps.onDragStart?.(e)}
    >
      <ContextMenu items={contextMenus}>
        <div className="relative size-full px-1" style={{ '--gap': '7px' } as any}>
          {index !== 0 && !active && (
            <div className="tabs-chrome__divider absolute start-(--gap) top-1/2 z-0 h-4 w-px -translate-y-1/2 bg-border transition-all" />
          )}
          <div className="tabs-chrome__background absolute -z-1 size-full px-[calc(var(--gap)-1px)] py-0 transition-opacity duration-150">
            <div
              className={cn(
                'tabs-chrome__background-content h-full rounded-ss-(--gap) rounded-se-(--gap) duration-150',
                active && 'bg-primary/15 dark:bg-accent',
              )}
            />
            <svg
              className={cn(
                'absolute -start-px bottom-0 fill-transparent transition-all duration-150 rtl:-scale-x-100',
                active && 'fill-primary/15 dark:fill-accent',
              )}
              height="7"
              width="7"
            >
              <path d="M 0 7 A 7 7 0 0 0 7 0 L 7 7 Z" />
            </svg>
            <svg
              className={cn(
                'absolute -end-px bottom-0 fill-transparent transition-all duration-150 rtl:-scale-x-100',
                active && 'fill-primary/15 dark:fill-accent',
              )}
              height="7"
              width="7"
            >
              <path d="M 0 0 A 7 7 0 0 0 7 7 L 0 7 Z" />
            </svg>
          </div>
          <div className="absolute end-(--gap) top-1/2 z-3 flex size-4 -translate-y-1/2 items-center justify-center">
            <CloseOrPin {...props} />
          </div>
          <div
            className={cn(
              'tabs-chrome__item-main z-2 mx-[calc(var(--gap)*2)] my-0 flex h-full items-center overflow-hidden rounded-ss-[5px] rounded-se-[5px] ps-2 pe-4 text-accent-foreground duration-150',
              active && 'text-primary dark:text-accent-foreground',
            )}
          >
            {showIcon && (
              <VbenIcon className="me-1 flex size-4 items-center overflow-hidden group-hover:animate-[shrink_0.3s_ease-in-out]" icon={tab.icon} />
            )}
            <span className="flex-1 overflow-hidden text-sm whitespace-nowrap">{tab.title}</span>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

const styleClasses: Record<string, string> = {
  brisk:
    "h-full after:content-[''] after:absolute after:bottom-0 after:start-0 after:w-full after:h-[1.5px] after:bg-primary after:scale-x-0 after:transition-[transform] after:ease-out after:duration-300 hover:after:scale-x-100 after:origin-left rtl:after:origin-right [&.is-active]:after:scale-x-100 [&:not(:first-child)]:border-s last:border-e border-border",
  card: 'h-[calc(100%-6px)] rounded-md ms-2 border border-border transition-all',
  plain: 'h-full [&:not(:first-child)]:border-s last:border-e border-border',
};

/**
 * زبانه‌ی سبک‌های card / plain / brisk
 */
function BasicTabItem(props: TabItemProps) {
  const { active, contextMenus, dragProps, dropTarget, onClick, onMouseDown, showIcon, styleType, tab } = props;
  return (
    <div
      className={cn(
        'group tab-item relative flex cursor-pointer select-none',
        active ? 'is-active bg-primary/15 dark:bg-accent' : 'hover:bg-accent',
        styleClasses[styleType] ?? styleClasses.plain,
        dropTarget && 'opacity-60',
      )}
      data-active={active}
      data-tab-item="true"
      onClick={onClick}
      onMouseDown={onMouseDown}
      {...dragProps}
    >
      <ContextMenu items={contextMenus}>
        <div className="relative flex size-full items-center">
          <div className="absolute end-1.5 top-1/2 z-3 flex -translate-y-1/2 items-center overflow-hidden">
            <CloseOrPin {...props} />
          </div>
          <div
            className={cn(
              'mx-3 me-4 flex h-full items-center overflow-hidden pe-3 text-accent-foreground transition-all duration-300',
              active && 'text-primary dark:text-accent-foreground',
            )}
          >
            {showIcon && (
              <VbenIcon className="me-2 flex size-4 items-center overflow-hidden group-hover:animate-[shrink_0.3s_ease-in-out]" fallback icon={tab.icon} />
            )}
            <span className="flex-1 overflow-hidden text-sm whitespace-nowrap">{tab.title}</span>
          </div>
        </div>
      </ContextMenu>
    </div>
  );
}

export { BasicTabItem, ChromeTabItem };
export type { TabItemProps };
