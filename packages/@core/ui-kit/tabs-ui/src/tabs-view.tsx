import type { TabsViewProps } from './types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSortable } from '@vben-core/composables';
import { ChevronsLeft, ChevronsRight } from '@vben-core/icons';
import { cn, isRtl } from '@vben-core/shared';

import { BasicTabItem, ChromeTabItem } from './tab-item';
import './style.css';

/**
 * نوار زبانه‌ها با سبک‌های مختلف، منوی راست‌کلیک، مرتب‌سازی با کشیدن و اسکرول با چرخ ماوس
 */
function TabsView({
  active,
  contextMenus,
  draggable = true,
  middleClickToClose = false,
  onActiveChange,
  onClose,
  onSortTabs,
  onUnpin,
  showIcon = true,
  styleType = 'chrome',
  tabs,
  wheelable = true,
}: TabsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ atEnd: true, atStart: true, overflow: false });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setScrollState({ atEnd: pos >= max - 1, atStart: pos <= 1, overflow: max > 1 });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, [updateScrollState, tabs.length]);

  // زبانه‌ی فعال در دید قرار گیرد
  useEffect(() => {
    const el = scrollRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [active, tabs.length]);

  // اسکرول افقی با چرخ ماوس (listener غیرفعال‌نشدنی برای preventDefault)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !wheelable) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollBy({ left: isRtl() ? -e.deltaY : e.deltaY });
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [wheelable]);

  const { getItemProps, overIndex } = useSortable({
    canDrag: (index) => !tabs[index]?.affixTab,
    canDrop: (index) => !tabs[index]?.affixTab,
    disabled: !draggable,
    onSort: (from, to) => onSortTabs?.(from, to),
  });

  function scrollDirection(direction: 'end' | 'start') {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (direction === 'end' ? 1 : -1);
    el.scrollBy({ behavior: 'smooth', left: isRtl() ? -amount : amount });
  }

  const ItemComponent = styleType === 'chrome' ? ChromeTabItem : BasicTabItem;

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {scrollState.overflow && (
        <span
          className={cn(
            'flex items-center border-e px-2',
            scrollState.atStart ? 'pointer-events-none opacity-30' : 'cursor-pointer text-muted-foreground hover:bg-muted',
          )}
          onClick={() => scrollDirection('start')}
        >
          <ChevronsLeft className="size-4 rtl:rotate-180" />
        </span>
      )}
      <div className={cn('size-full flex-1 overflow-hidden', styleType === 'chrome' && 'pt-0.75')}>
        <div
          className="vben-scrollbar-hidden h-full overflow-x-auto overflow-y-hidden"
          onScroll={updateScrollState}
          ref={scrollRef}
        >
          <div
            className={cn(
              'flex h-full w-max pe-6',
              styleType === 'chrome' ? 'tabs-chrome overflow-y-hidden' : 'relative items-center overflow-hidden',
            )}
          >
            {tabs.map((tab, index) => (
              <ItemComponent
                active={tab.key === active}
                closable={tab.closable && tabs.length > 1}
                contextMenus={contextMenus?.(tab)}
                dragProps={getItemProps(index)}
                dropTarget={overIndex === index}
                index={index}
                key={tab.key}
                onClick={() => onActiveChange?.(tab.key)}
                onClose={() => onClose?.(tab.key)}
                onMouseDown={(e) => {
                  // کلیک میانی ماوس
                  if (e.button === 1 && middleClickToClose && !tab.affixTab && tab.closable) {
                    e.preventDefault();
                    onClose?.(tab.key);
                  }
                }}
                onUnpin={() => onUnpin?.(tab)}
                showIcon={showIcon}
                styleType={styleType}
                tab={tab}
              />
            ))}
          </div>
        </div>
      </div>
      {scrollState.overflow && (
        <span
          className={cn(
            'flex items-center border-s px-2',
            scrollState.atEnd ? 'pointer-events-none opacity-30' : 'cursor-pointer text-muted-foreground hover:bg-muted',
          )}
          onClick={() => scrollDirection('end')}
        >
          <ChevronsRight className="size-4 rtl:rotate-180" />
        </span>
      )}
    </div>
  );
}

export { TabsView };
