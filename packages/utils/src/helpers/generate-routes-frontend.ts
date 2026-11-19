import type { RouteComponent, RouteRecordRaw } from '@vben-core/typings';

import { cloneDeep, filterTree, mapTree } from '@vben-core/shared';

/**
 * تولید مسیرها در حالت frontend: فیلتر بر اساس نقش کاربر
 */
async function generateRoutesByFrontend(
  routes: RouteRecordRaw[],
  roles: string[],
  forbiddenComponent?: RouteComponent,
): Promise<RouteRecordRaw[]> {
  const finalRoutes = filterTree(cloneDeep(routes), (route) =>
    hasAuthority(route, roles),
  );
  if (!forbiddenComponent) return finalRoutes;

  // منوهایی که دیده می‌شوند ولی دسترسی ندارند → صفحه‌ی 403
  return mapTree(finalRoutes, (route) => {
    if (menuHasVisibleWithForbidden(route) && !canAccess(route, roles)) {
      return { ...route, component: forbiddenComponent };
    }
    return route;
  });
}

function canAccess(route: RouteRecordRaw, access: string[]) {
  const authority = route.meta?.authority;
  if (!authority) return true;
  return access.some((value) => authority.includes(value));
}

/**
 * آیا مسیر قابل دسترسی است
 */
function hasAuthority(route: RouteRecordRaw, access: string[]) {
  return canAccess(route, access) || menuHasVisibleWithForbidden(route);
}

function menuHasVisibleWithForbidden(route: RouteRecordRaw) {
  return !!route.meta?.authority && !!route.meta?.menuVisibleWithForbidden;
}

export { generateRoutesByFrontend, hasAuthority };
