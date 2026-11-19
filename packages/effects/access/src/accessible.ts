import type {
  AccessModeType,
  GenerateMenuAndRoutesOptions,
  MenuRecordRaw,
  RouteRecordNormalized,
  RouteRecordRaw,
} from '@vben/types';

import {
  generateMenus,
  generateRoutesByBackend,
  generateRoutesByFrontend,
  normalizeRoutes,
} from '@vben/utils';

/**
 * تولید مسیرها و منوهای قابل دسترس
 */
async function generateAccessible(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
): Promise<{
  accessibleMenus: MenuRecordRaw[];
  accessibleRoutes: RouteRecordNormalized[];
}> {
  const rawRoutes = await generateRoutes(mode, options);
  const accessibleRoutes = applyRedirects(normalizeRoutes(rawRoutes));
  const accessibleMenus = generateMenus(accessibleRoutes);
  return { accessibleMenus, accessibleRoutes };
}

async function generateRoutes(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { forbiddenComponent, roles = [], routes } = options;
  switch (mode) {
    case 'backend': {
      return generateRoutesByBackend(options);
    }
    case 'mixed': {
      const [frontendRoutes, backendRoutes] = await Promise.all([
        generateRoutesByFrontend(routes, roles, forbiddenComponent),
        generateRoutesByBackend(options),
      ]);
      return mergeRoutesByName(backendRoutes, frontendRoutes);
    }
    default: {
      return generateRoutesByFrontend(routes, roles, forbiddenComponent);
    }
  }
}

/**
 * برای مسیرهای والد بدون redirect، به اولین فرزند هدایت اضافه می‌شود
 */
function applyRedirects(routes: RouteRecordNormalized[]): RouteRecordNormalized[] {
  for (const route of routes) {
    if (route.children.length > 0) {
      applyRedirects(route.children);
      if (!route.redirect) {
        const first = route.children[0] as RouteRecordNormalized;
        if (!first.path.startsWith(':')) {
          route.redirect = first.redirect ?? first.fullPath;
        }
      }
    }
  }
  return routes;
}

/**
 * ادغام مسیرهای سرور و کلاینت بر اساس name (سرور اولویت دارد)
 */
function mergeRoutesByName(
  baseRoutes: RouteRecordRaw[],
  extraRoutes: RouteRecordRaw[],
): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];
  const routeMap = new Map<string, RouteRecordRaw>();

  for (const route of baseRoutes) {
    const clone = { ...route };
    result.push(clone);
    if (clone.name) routeMap.set(clone.name, clone);
  }

  for (const route of extraRoutes) {
    const existing = route.name ? routeMap.get(route.name) : undefined;
    if (existing) {
      const merged: RouteRecordRaw = {
        ...route,
        ...existing,
        meta: { ...route.meta, ...existing.meta } as RouteRecordRaw['meta'],
      };
      if ((existing.children?.length ?? 0) > 0 || (route.children?.length ?? 0) > 0) {
        merged.children = mergeRoutesByName(existing.children ?? [], route.children ?? []);
      }
      Object.assign(existing, merged);
    } else {
      const clone = { ...route };
      result.push(clone);
      if (clone.name) routeMap.set(clone.name, clone);
    }
  }
  return result;
}

export { generateAccessible };
