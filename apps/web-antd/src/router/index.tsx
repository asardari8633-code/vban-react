import type { RouteRecordNormalized } from '@vben/types';
import type { RouteObject } from 'react-router';

import { Suspense, useEffect, useLayoutEffect, useMemo } from 'react';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router';

import { LOGIN_PATH } from '@vben/constants';
import { setCoreRoutes, useRoute } from '@vben/hooks';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { flattenRoutes, normalizeRoutes, startProgress, stopProgress } from '@vben/utils';
import { VbenFullScreenLoading } from '@vben-core/base-ui';

import { AuthLayout, BasicLayout } from '#/layouts';
import { $t } from '#/locales';

import { AccessGuard, GuestGuard } from './guard';
import { setNavigate } from './navigation';
import { authRoutes, fallbackNotFoundRoute, normalizedCoreRoutes } from './routes';

setCoreRoutes(normalizedCoreRoutes);

const NotFound = fallbackNotFoundRoute.component!;

function renderRecord(record: RouteRecordNormalized) {
  const Component = record.component!;
  return <Component />;
}

/**
 * تبدیل مسیرهای Vben به ساختار react-router:
 * همه‌ی صفحات (به‌جز noBasicLayout) به‌صورت تخت زیر چیدمان پایه قرار می‌گیرند.
 */
function createRouteObjects(accessRoutes: RouteRecordNormalized[]): RouteObject[] {
  const layoutChildren: RouteObject[] = [];
  const outsideLayout: RouteObject[] = [];

  for (const record of flattenRoutes(accessRoutes)) {
    const target = record.matched[0]?.meta?.noBasicLayout ? outsideLayout : layoutChildren;
    if (record.component) {
      target.push({ element: renderRecord(record), path: record.fullPath });
    } else if (record.redirect) {
      target.push({ element: <Navigate replace to={record.redirect} />, path: record.fullPath });
    }
  }

  const authChildren: RouteObject[] = flattenRoutes(normalizeRoutes(authRoutes))
    .filter((r) => r.component)
    .map((r) => ({ element: renderRecord(r), path: r.fullPath }));

  return [
    {
      children: [{ element: <Navigate replace to={LOGIN_PATH} />, index: true }, ...authChildren],
      element: (
        <GuestGuard>
          <AuthLayout />
        </GuestGuard>
      ),
      path: '/auth',
    },
    {
      children: [
        { element: <Navigate replace to={preferences.app.defaultHomePath} />, index: true },
        ...layoutChildren,
      ],
      element: (
        <AccessGuard>
          <BasicLayout />
        </AccessGuard>
      ),
      path: '/',
    },
    ...outsideLayout.map((item) => ({ ...item, element: <AccessGuard>{item.element}</AccessGuard> })),
    {
      element: (
        <AccessGuard>
          <NotFound />
        </AccessGuard>
      ),
      path: '*',
    },
  ];
}

/**
 * اثرات سراسری مسیر: نوار پیشرفت و عنوان پویا
 */
function RouteEffects() {
  const location = useLocation();
  const route = useRoute();
  const { preferences: p } = usePreferences();

  useLayoutEffect(() => {
    if (!p.transition.progress) return;
    void startProgress();
    const timer = setTimeout(() => void stopProgress(), 300);
    return () => clearTimeout(timer);
  }, [location.pathname, p.transition.progress]);

  useEffect(() => {
    if (!p.app.dynamicTitle) {
      document.title = p.app.name;
      return;
    }
    const title = route.meta?.title;
    document.title = (title ? `${$t(title)} - ` : '') + p.app.name;
  }, [route.meta?.title, p.app.dynamicTitle, p.app.name]);

  return null;
}

/**
 * روتر برنامه: مسیرها با تغییر دسترسی‌ها دوباره ساخته می‌شوند
 */
function AppRouter() {
  const navigate = useNavigate();
  setNavigate(navigate);
  const accessRoutes = useAccessStore((s) => s.accessRoutes);
  const routes = useMemo(() => createRouteObjects(accessRoutes), [accessRoutes]);
  const element = useRoutes(routes);

  return (
    <>
      <RouteEffects />
      <Suspense fallback={<VbenFullScreenLoading />}>{element}</Suspense>
    </>
  );
}

export { AppRouter };
