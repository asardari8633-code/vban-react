import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { LOGIN_PATH } from '@vben/constants';
import { useRoute } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { useAccessStore, useTimezoneStore, useUserStore } from '@vben/stores';
import { VbenFullScreenLoading } from '@vben-core/base-ui';

import { $t } from '#/locales';
import { fetchUserInfo, useAuthStore } from '#/store/auth';

import { generateAccess } from './access';
import { accessRoutes } from './routes';

let accessPromise: null | Promise<{ homePath?: string }> = null;

/**
 * تولید مسیرهای دسترسی (یک بار، حتی اگر چند نگهبان هم‌زمان درخواست کنند)
 */
function ensureAccess() {
  if (!accessPromise) {
    accessPromise = (async () => {
      const userInfo = useUserStore.getState().userInfo || (await fetchUserInfo());
      const { accessibleMenus, accessibleRoutes } = await generateAccess({
        roles: userInfo.roles ?? [],
        routes: accessRoutes,
      });
      useAccessStore.setState({
        accessMenus: accessibleMenus,
        accessRoutes: accessibleRoutes,
        isAccessChecked: true,
      });
      void useTimezoneStore.getState().initTimezone().catch(() => undefined);
      return { homePath: userInfo.homePath };
    })().finally(() => {
      accessPromise = null;
    });
  }
  return accessPromise;
}

function AccessLoader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    ensureAccess()
      .then(({ homePath }) => {
        if (cancelled) return;
        // ورود به خانه‌ی پیش‌فرض → خانه‌ی اختصاصی کاربر
        const path = location.pathname;
        if (path === '/' || path === preferences.app.defaultHomePath) {
          navigate(homePath || preferences.app.defaultHomePath, { replace: true });
        }
      })
      .catch((error_) => {
        console.error(error_);
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex-col-center h-full gap-2 text-muted-foreground">
        <span>{$t('ui.fallback.internalErrorDesc')}</span>
      </div>
    );
  }
  return <VbenFullScreenLoading text={`${$t('common.loadingMenu')}...`} />;
}

/**
 * نگهبان دسترسی (معادل router guard در Vben):
 * بدون توکن → صفحه‌ی ورود؛ توکن بدون مسیرهای دسترسی → تولید مسیرها
 */
function AccessGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const route = useRoute();
  const accessToken = useAccessStore((s) => s.accessToken);
  const isAccessChecked = useAccessStore((s) => s.isAccessChecked);
  const loginExpired = useAccessStore((s) => s.loginExpired);

  // در حالت «مودال» انقضای ورود، صفحه باقی می‌ماند و مودال ورود نمایش داده می‌شود
  if (!accessToken && !(loginExpired && isAccessChecked)) {
    if (route.meta?.ignoreAccess) return <>{children}</>;
    const fullPath = `${location.pathname}${location.search}`;
    const query =
      fullPath === preferences.app.defaultHomePath || fullPath === '/'
        ? ''
        : `?redirect=${encodeURIComponent(fullPath)}`;
    return <Navigate replace to={`${LOGIN_PATH}${query}`} />;
  }

  if (!isAccessChecked) return <AccessLoader />;

  return <>{children}</>;
}

/**
 * اگر کاربر وارد شده و به صفحه‌ی ورود رفت، به مقصد هدایت شود
 */
function GuestGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const accessToken = useAccessStore((s) => s.accessToken);
  const userInfo = useUserStore((s) => s.userInfo);
  const loginLoading = useAuthStore((s) => s.loginLoading);
  // در حین ورود، هدایت بر عهده‌ی authLogin است
  if (accessToken && !loginLoading && location.pathname === LOGIN_PATH) {
    const redirect = new URLSearchParams(location.search).get('redirect');
    return (
      <Navigate
        replace
        to={redirect ? decodeURIComponent(redirect) : userInfo?.homePath || preferences.app.defaultHomePath}
      />
    );
  }
  return <>{children}</>;
}

export { AccessGuard, GuestGuard };
