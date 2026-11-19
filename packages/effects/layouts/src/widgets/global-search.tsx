import type { MenuRecordRaw } from '@vben/types';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Input, Modal } from 'antd';

import {
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  Search,
  SearchX,
  VbenIcon,
  X,
} from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { cn, isMacOs } from '@vben-core/shared';

import { useNavigation } from '../basic/menu/use-navigation';

const HISTORY_KEY = '__vben_search_history__';

interface SearchItem {
  icon?: MenuRecordRaw['icon'];
  name: string;
  path: string;
  trail: string;
}

function flattenMenus(menus: MenuRecordRaw[], trail: string[] = []): SearchItem[] {
  const result: SearchItem[] = [];
  for (const menu of menus) {
    const name = $t(menu.name);
    const path = [...trail, name];
    if (menu.children?.length) {
      result.push(...flattenMenus(menu.children, path));
    } else {
      result.push({ icon: menu.icon, name, path: menu.path, trail: path.join(' / ') });
    }
  }
  return result;
}

function readHistory(): SearchItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/**
 * جست‌وجوی سراسری منوها (Ctrl/⌘ + K)
 */
function GlobalSearch() {
  const { globalSearchShortcutKey } = usePreferences();
  const menus = useAccessStore((s) => s.accessMenus);
  const { navigation } = useNavigation();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [history, setHistory] = useState<SearchItem[]>(readHistory);
  const listRef = useRef<HTMLUListElement>(null);

  const allItems = useMemo(() => flattenMenus(menus), [menus]);
  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return [];
    return allItems.filter(
      (item) => item.trail.toLowerCase().includes(kw) || item.path.toLowerCase().includes(kw),
    );
  }, [allItems, keyword]);

  const showHistory = !keyword.trim();
  const list = showHistory ? history : results;

  useEffect(() => {
    if (!globalSearchShortcutKey) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [globalSearchShortcutKey]);

  useEffect(() => setActiveIndex(0), [keyword, open]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  function select(item?: SearchItem) {
    if (!item) return;
    const next = [item, ...history.filter((h) => h.path !== item.path)].slice(0, 10);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setOpen(false);
    setKeyword('');
    void navigation(item.path);
  }

  function removeHistory(path: string) {
    const next = history.filter((h) => h.path !== path);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  }

  const shortcut = isMacOs() ? '⌘ K' : 'Ctrl K';

  return (
    <>
      <div
        className="me-2 flex cursor-pointer items-center gap-2 rounded-2xl bg-accent px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground md:min-w-40"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="hidden text-xs md:block">{$t('ui.widgets.search.title')}</span>
        {globalSearchShortcutKey && (
          <kbd className="ms-auto hidden rounded-sm bg-background px-1.5 text-[10px] leading-5 md:block" dir="ltr">
            {shortcut}
          </kbd>
        )}
      </div>
      <Modal
        afterOpenChange={(visible) => visible && document.querySelector<HTMLInputElement>('#vben-global-search')?.focus()}
        closable={false}
        destroyOnHidden
        footer={
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CornerDownLeft className="size-3" />
              {$t('ui.widgets.search.select')}
            </span>
            <span className="flex items-center gap-1">
              <ArrowUp className="size-3" />
              <ArrowDown className="size-3" />
              {$t('ui.widgets.search.navigate')}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded-sm bg-accent px-1">Esc</kbd>
              {$t('ui.widgets.search.close')}
            </span>
          </div>
        }
        onCancel={() => setOpen(false)}
        open={open}
        styles={{ body: { padding: 0 } }}
        width={560}
      >
        <Input
          allowClear
          id="vben-global-search"
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(list.length - 1, i + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(0, i - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              select(list[activeIndex]);
            }
          }}
          placeholder={$t('ui.widgets.search.searchNavigate')}
          prefix={<Search className="size-4 text-muted-foreground" />}
          size="large"
          value={keyword}
          variant="borderless"
        />
        <div className="border-t border-border" />
        <div className="vben-scrollbar max-h-[50vh] min-h-40 overflow-y-auto p-3">
          {list.length === 0 ? (
            <div className="flex-col-center py-8 text-muted-foreground">
              <SearchX className="mb-3 size-10 opacity-60" />
              <p>
                {showHistory ? $t('ui.widgets.search.noRecent') : $t('ui.widgets.search.noResults')}
              </p>
            </div>
          ) : (
            <>
              {showHistory && (
                <div className="mb-2 text-xs text-muted-foreground">{$t('ui.widgets.search.recent')}</div>
              )}
              <ul className="m-0 list-none p-0" ref={listRef}>
                {list.map((item, index) => (
                  <li
                    className={cn(
                      'group mb-2 flex cursor-pointer items-center gap-3 rounded-md bg-accent px-4 py-3 transition-colors',
                      index === activeIndex && 'bg-primary! text-primary-foreground',
                    )}
                    data-active={index === activeIndex}
                    key={item.path}
                    onClick={() => select(item)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <VbenIcon fallback icon={item.icon} size={18} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate">{item.name}</span>
                      <span className="truncate text-xs opacity-70">{item.trail}</span>
                    </div>
                    {showHistory && (
                      <X
                        className="size-4 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHistory(item.path);
                        }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}

export { GlobalSearch };
