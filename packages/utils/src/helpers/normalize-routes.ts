import type {
  RouteMeta,
  RouteRecordNormalized,
  RouteRecordRaw,
} from '@vben-core/typings';

/**
 * ترکیب مسیر والد و فرزند
 */
function joinPath(parent: string, child: string) {
  if (!child) return parent || '/';
  if (child.startsWith('/')) return child;
  const base = parent.endsWith('/') ? parent.slice(0, -1) : parent;
  return `${base}/${child}`.replaceAll(/\/+/g, '/');
}

/**
 * نرمال‌سازی درخت مسیرها: محاسبه‌ی مسیر کامل، نام، meta و زنجیره‌ی matched
 */
function normalizeRoutes(
  routes: RouteRecordRaw[],
  parent?: RouteRecordNormalized,
): RouteRecordNormalized[] {
  return routes.map((route) => {
    const fullPath = joinPath(parent?.fullPath ?? '', route.path);
    const meta: RouteMeta = { ...(route.meta ?? { title: '' }) } as RouteMeta;
    if (!meta.title) meta.title = route.name ?? fullPath;
    const record: RouteRecordNormalized = {
      ...route,
      children: [],
      fullPath,
      matched: [],
      meta,
      name: route.name ?? fullPath,
    };
    record.matched = [...(parent?.matched ?? []), record];
    record.children = route.children?.length
      ? normalizeRoutes(route.children, record)
      : [];
    return record;
  });
}

/**
 * تخت کردن درخت مسیرهای نرمال‌شده
 */
function flattenRoutes(routes: RouteRecordNormalized[]): RouteRecordNormalized[] {
  const result: RouteRecordNormalized[] = [];
  const walk = (list: RouteRecordNormalized[]) => {
    for (const route of list) {
      result.push(route);
      if (route.children.length > 0) walk(route.children);
    }
  };
  walk(routes);
  return result;
}

export { flattenRoutes, joinPath, normalizeRoutes };
