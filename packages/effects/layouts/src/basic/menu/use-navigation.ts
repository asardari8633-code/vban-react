import type { RouteRecordNormalized } from '@vben/types';

import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useAllRouteRecords } from '@vben/hooks';
import { flattenRoutes, isHttpUrl, openRouteInNewWindow, openWindow } from '@vben/utils';

/**
 * ناوبری منو: لینک خارجی در پنجره‌ی جدید، openInNewWindow، یا ناوبری داخلی
 */
function useNavigation() {
  const navigate = useNavigate();
  const records = useAllRouteRecords();

  const routeMap = useMemo(() => {
    const map = new Map<string, RouteRecordNormalized>();
    flattenRoutes(records).forEach((r) => map.set(r.fullPath, r));
    return map;
  }, [records]);

  const willOpenedByWindow = useCallback(
    (path: string) => {
      if (isHttpUrl(path)) return true;
      return !!routeMap.get(path)?.meta?.openInNewWindow;
    },
    [routeMap],
  );

  const navigation = useCallback(
    async (path: string) => {
      if (isHttpUrl(path)) {
        openWindow(path, { target: '_blank' });
        return;
      }
      const route = routeMap.get(path);
      const query = route?.meta?.query;
      const search = query && Object.keys(query).length > 0 ? `?${new URLSearchParams(query)}` : '';
      if (route?.meta?.openInNewWindow) {
        openRouteInNewWindow(`${path}${search}`);
        return;
      }
      navigate(`${path}${search}`);
    },
    [navigate, routeMap],
  );

  return { navigation, willOpenedByWindow };
}

export { useNavigation };
