import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordRaw,
  RouteRecordStringComponent,
} from '@vben-core/typings';

import { mapTree } from '@vben-core/shared';

/**
 * تولید مسیرها در حالت backend: منو از سرور گرفته و رشته‌ی کامپوننت به کامپوننت واقعی نگاشت می‌شود
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, forbiddenComponent, layoutMap = {}, pageMap = {} } = options;

  const menuRoutes = await fetchMenuListAsync?.();
  if (!menuRoutes) return [];

  const normalizePageMap: ComponentRecordType = {};
  for (const [key, value] of Object.entries(pageMap)) {
    normalizePageMap[normalizeViewPath(key)] = value;
  }

  let routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap);
  if (forbiddenComponent) {
    routes = mapTree(routes, (route) => {
      if (route.meta?.menuVisibleWithForbidden) {
        return { ...route, component: forbiddenComponent };
      }
      return route;
    });
  }
  return routes;
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  return mapTree(routes, (node) => {
    const { children: _children, component, ...rest } = node;
    const route: RouteRecordRaw = { ...rest } as RouteRecordRaw;
    if (!node.name) console.error('route name is required', node);

    if (component && layoutMap[component]) {
      route.component = layoutMap[component];
    } else if (component) {
      const normalizePath = normalizeViewPath(component);
      const key = findPageKey(pageMap, normalizePath);
      if (key) {
        route.component = pageMap[key];
      } else {
        console.error(`route component is invalid: ${normalizePath}`, node);
        route.component =
          pageMap['/_core/fallback/not-found'] ?? pageMap[findPageKey(pageMap, '/_core/fallback/not-found') ?? ''];
      }
    }
    return route;
  });
}

const PAGE_EXTENSIONS = ['', '.tsx', '/index.tsx', '.jsx', '/index.jsx'];

function findPageKey(pageMap: ComponentRecordType, path: string) {
  const base = path.replace(/\.(tsx|jsx|vue)$/, '');
  for (const ext of PAGE_EXTENSIONS) {
    if (pageMap[`${base}${ext}`]) return `${base}${ext}`;
  }
  return undefined;
}

/**
 * نرمال‌سازی مسیر view: حذف ./ و ../ و پیشوند /views
 */
function normalizeViewPath(path: string): string {
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');
  const viewPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return viewPath.replace(/^\/views/, '');
}

export { generateRoutesByBackend, normalizeViewPath };
