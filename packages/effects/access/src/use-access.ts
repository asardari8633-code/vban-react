import { useCallback } from 'react';

import { preferences, updatePreferences, usePreferencesStore } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

/**
 * بررسی دسترسی بر اساس نقش (خارج از React)
 */
function hasAccessByRoles(roles: string[]) {
  const userRoleSet = new Set(useUserStore.getState().userRoles);
  return roles.some((item) => userRoleSet.has(item));
}

/**
 * بررسی دسترسی بر اساس کد دسترسی (خارج از React)
 */
function hasAccessByCodes(codes: string[]) {
  const userCodesSet = new Set(useAccessStore.getState().accessCodes);
  return codes.some((item) => userCodesSet.has(item));
}

/**
 * هوک دسترسی
 */
function useAccess() {
  const accessMode = usePreferencesStore((s) => s.preferences.app.accessMode);
  const userRoles = useUserStore((s) => s.userRoles);
  const accessCodes = useAccessStore((s) => s.accessCodes);

  const byRoles = useCallback(
    (roles: string[]) => {
      const set = new Set(userRoles);
      return roles.some((item) => set.has(item));
    },
    [userRoles],
  );

  const byCodes = useCallback(
    (codes: string[]) => {
      const set = new Set(accessCodes);
      return codes.some((item) => set.has(item));
    },
    [accessCodes],
  );

  const toggleAccessMode = useCallback(() => {
    updatePreferences({
      app: {
        accessMode: preferences.app.accessMode === 'frontend' ? 'backend' : 'frontend',
      },
    });
  }, []);

  return {
    accessMode,
    hasAccessByCodes: byCodes,
    hasAccessByRoles: byRoles,
    toggleAccessMode,
  };
}

export { hasAccessByCodes, hasAccessByRoles, useAccess };
