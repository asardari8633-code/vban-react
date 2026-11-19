import type {
  MenuRecordRaw,
  RouteRecordNormalized,
} from '@vben-core/typings';

import { filterTree, sortTree } from '@vben-core/shared';

/**
 * ساخت منو از روی مسیرهای قابل دسترس
 */
function generateMenus(routes: RouteRecordNormalized[]): MenuRecordRaw[] {
  const build = (
    list: RouteRecordNormalized[],
    parents: string[] = [],
  ): MenuRecordRaw[] =>
    list.map((route) => {
      const {
        activeIcon,
        badge,
        badgeType,
        badgeVariants,
        hideChildrenInMenu = false,
        hideInMenu,
        icon,
        link,
        order,
        query,
        title,
      } = route.meta;
      const path = route.fullPath;
      const children = hideChildrenInMenu
        ? []
        : build(route.children, [...parents, path]);
      const resultPath = hideChildrenInMenu
        ? route.redirect || path
        : link || path;
      return {
        activeIcon,
        badge,
        badgeType,
        badgeVariants,
        children,
        icon,
        name: title || route.name,
        order,
        parent: parents[parents.length - 1],
        parents,
        path: resultPath,
        query,
        show: !hideInMenu,
      };
    });

  let menus = build(routes);
  menus = sortTree(menus, (a, b) => (a?.order ?? 999) - (b?.order ?? 999));
  return filterTree(menus, (menu) => !!menu.show);
}

export { generateMenus };
