import type { Location } from 'react-router';

import type {
  RouteLocation,
  RouteRecordNormalized,
} from '@vben/types';

import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router';

import { useAccessStore } from '@vben/stores';
import { flattenRoutes } from '@vben/utils';
import { create } from 'zustand';

interface RouteRegistryState {
  /** مسیرهای ثابت (ورود، خطاها و …) */
  coreRoutes: RouteRecordNormalized[];
}

const useRouteRegistry = create<RouteRegistryState>()(() => ({
  coreRoutes: [],
}));

/**
 * ثبت مسیرهای ثابت برنامه برای تشخیص meta مسیر فعلی
 */
function setCoreRoutes(routes: RouteRecordNormalized[]) {
  useRouteRegistry.setState({ coreRoutes: routes });
}

const emptyMeta = { title: '' };

const routeObjectsCache = new WeakMap<
  RouteRecordNormalized[],
  { id: string; path: string; record: RouteRecordNormalized }[]
>();

function buildRouteObjects(records: RouteRecordNormalized[]) {
  let cached = routeObjectsCache.get(records);
  if (!cached) {
    cached = flattenRoutes(records).map((record) => ({
      id: record.fullPath,
      path: record.fullPath,
      record,
    }));
    routeObjectsCache.set(records, cached);
  }
  return cached;
}

function parseQuery(search: string) {
  return Object.fromEntries(new URLSearchParams(search).entries());
}

/**
 * یافتن رکورد مسیر برای یک location
 */
function resolveRouteLocation(
  location: Pick<Location, 'hash' | 'pathname' | 'search'>,
  records: RouteRecordNormalized[],
): RouteLocation {
  const objects = buildRouteObjects(records);
  const matches = matchRoutes(objects, location.pathname) ?? [];
  const best = matches[matches.length - 1];
  const record = (best?.route as any)?.record as RouteRecordNormalized | undefined;
  const fullPath = `${location.pathname}${location.search}${location.hash}`;
  return {
    fullPath,
    hash: location.hash,
    matched: record?.matched ?? [],
    meta: record?.meta ?? emptyMeta,
    name: record?.name ?? '',
    params: (best?.params ?? {}) as Record<string, string | undefined>,
    path: location.pathname,
    query: parseQuery(location.search),
  };
}

/**
 * همه‌ی مسیرهای ثبت‌شده (ثابت + قابل دسترس) — برای جست‌وجو و منوها
 */
function useAllRouteRecords() {
  const coreRoutes = useRouteRegistry((s) => s.coreRoutes);
  const accessRoutes = useAccessStore((s) => s.accessRoutes);
  return useMemo(() => [...accessRoutes, ...coreRoutes], [accessRoutes, coreRoutes]);
}

/**
 * وضعیت مسیر فعلی همراه با meta (معادل useRoute در vue-router)
 */
function useRoute(): RouteLocation {
  const location = useLocation();
  const records = useAllRouteRecords();
  return useMemo(
    () => resolveRouteLocation(location, records),
    [location.pathname, location.search, location.hash, records],
  );
}

/**
 * گرفتن مسیر فعلی خارج از React
 */
function getCurrentRoute(): RouteLocation {
  const records = [
    ...useAccessStore.getState().accessRoutes,
    ...useRouteRegistry.getState().coreRoutes,
  ];
  return resolveRouteLocation(window.location, records);
}

export {
  getCurrentRoute,
  resolveRouteLocation,
  setCoreRoutes,
  useAllRouteRecords,
  useRoute,
  useRouteRegistry,
};
