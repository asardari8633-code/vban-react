import type { RouteLocation, RouteMeta } from './router';

/**
 * تعریف یک زبانه در نوار زبانه‌ها
 */
interface TabDefinition {
  fullPath: string;
  /** کلید یکتای زبانه */
  key: string;
  meta: RouteMeta;
  name: string;
  params?: RouteLocation['params'];
  path: string;
  query?: RouteLocation['query'];
}

export type { TabDefinition };
