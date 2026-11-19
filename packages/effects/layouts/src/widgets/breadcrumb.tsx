import type { BreadcrumbStyleType } from '@vben/types';

import { useMemo } from 'react';
import { useNavigate } from 'react-router';

import { Breadcrumb as AntdBreadcrumb } from 'antd';

import { useRoute } from '@vben/hooks';
import { House, VbenIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { cn, findMenuByPath } from '@vben/utils';

interface BreadcrumbProps {
  hideWhenOnlyOne?: boolean;
  showHome?: boolean;
  showIcon?: boolean;
  type?: BreadcrumbStyleType;
}

/**
 * مسیرنما بر اساس سلسله‌مراتب مسیر فعلی
 */
function Breadcrumb({ hideWhenOnlyOne, showHome, showIcon, type = 'normal' }: BreadcrumbProps) {
  const route = useRoute();
  const navigate = useNavigate();
  const accessRoutes = useAccessStore((s) => s.accessRoutes);
  const accessMenus = useAccessStore((s) => s.accessMenus);

  const items = useMemo(() => {
    let matched = route.matched;
    // ساخت مسیرنما از activePath
    if (route.meta?.breadcrumbUseActivePath && route.meta.activePath) {
      const stack = [...accessRoutes];
      while (stack.length > 0) {
        const r = stack.shift()!;
        if (r.fullPath === route.meta.activePath) {
          matched = [...r.matched, ...matched.slice(-1)];
          break;
        }
        stack.push(...r.children);
      }
    }
    const result = matched
      .filter((r) => !r.meta?.hideInBreadcrumb && r.fullPath !== '/')
      .map((r) => {
        const menu = findMenuByPath(accessMenus, r.fullPath);
        const children = (menu?.children ?? []).filter((c) => c.show !== false);
        return {
          icon: r.meta?.icon,
          isCurrent: r.fullPath === route.matched[route.matched.length - 1]?.fullPath,
          path: r.redirect ?? r.fullPath,
          siblings: children,
          title: $t(r.meta?.title ?? r.name),
        };
      });
    return result;
  }, [accessMenus, accessRoutes, route.matched, route.meta]);

  if (hideWhenOnlyOne && items.length <= 1) return null;

  const antdItems = [
    ...(showHome
      ? [
          {
            key: 'home',
            title: (
              <span className="flex cursor-pointer items-center" onClick={() => navigate(preferences.app.defaultHomePath)}>
                <House className="size-4" />
              </span>
            ),
          },
        ]
      : []),
    ...items.map((item, index) => ({
      key: `${item.path}-${index}`,
      menu:
        item.siblings.length > 0
          ? {
              items: item.siblings.map((child) => ({
                key: child.path,
                label: (
                  <span className="flex items-center gap-1.5">
                    {showIcon && child.icon && <VbenIcon icon={child.icon} size={14} />}
                    {$t(child.name)}
                  </span>
                ),
                onClick: () => navigate(child.path),
              })),
            }
          : undefined,
      title: (
        <span
          className={cn('inline-flex items-center gap-1', !item.isCurrent && 'cursor-pointer')}
          onClick={() => !item.isCurrent && item.siblings.length === 0 && navigate(item.path)}
        >
          {showIcon && item.icon && <VbenIcon icon={item.icon} size={14} />}
          {item.title}
        </span>
      ),
    })),
  ];

  return (
    <AntdBreadcrumb
      className={cn(
        'breadcrumb-enter ms-2 text-sm',
        type === 'background' && 'rounded-md bg-accent px-3 py-1',
      )}
      items={antdItems}
      key={route.path}
    />
  );
}

export { Breadcrumb };
