import type { RouteRecordRaw } from '@vben-core/typings';

interface RouteModuleType {
  default: RouteRecordRaw[];
}

/**
 * ادغام ماژول‌های مسیر (خروجی import.meta.glob با eager:true)
 */
function mergeRouteModules(routeModules: Record<string, unknown>): RouteRecordRaw[] {
  const mergedRoutes: RouteRecordRaw[] = [];
  for (const routeModule of Object.values(routeModules)) {
    const moduleRoutes = (routeModule as RouteModuleType)?.default ?? [];
    mergedRoutes.push(...moduleRoutes);
  }
  return mergedRoutes;
}

export { mergeRouteModules };
export type { RouteModuleType };
