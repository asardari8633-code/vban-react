import type { RouteRecordRaw } from '@vben/types';

import { mergeRouteModules, normalizeRoutes } from '@vben/utils';

import { authRoutes, coreRoutes, fallbackNotFoundRoute } from './core';

const dynamicRouteFiles = import.meta.glob('./modules/**/*.ts', { eager: true });

/** مسیرهای پویا (بر اساس دسترسی فیلتر می‌شوند) */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** مسیرهای ثابت بدون کنترل دسترسی (در صورت نیاز اضافه کنید) */
const staticRoutes: RouteRecordRaw[] = [];

const accessRoutes = [...dynamicRoutes, ...staticRoutes];

/** نسخه‌ی نرمال‌شده‌ی مسیرهای ثابت (برای meta و عنوان صفحات) */
const normalizedCoreRoutes = normalizeRoutes([...coreRoutes, fallbackNotFoundRoute]);

export { accessRoutes, authRoutes, fallbackNotFoundRoute, normalizedCoreRoutes };
