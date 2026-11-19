import type { MenuRecordRaw, RouteRecordNormalized } from '@vben-core/typings';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createNamespacedStorage,
  registerStoreHydrate,
  registerStoreReset,
} from '../setup';

type AccessToken = null | string;

interface AccessState {
  /** کدهای دسترسی (برای کنترل دکمه‌ها) */
  accessCodes: string[];
  /** منوهای قابل دسترس */
  accessMenus: MenuRecordRaw[];
  /** مسیرهای قابل دسترس (نرمال‌شده) */
  accessRoutes: RouteRecordNormalized[];
  /** توکن دسترسی */
  accessToken: AccessToken;
  /** آیا مسیرهای دسترسی تولید شده‌اند */
  isAccessChecked: boolean;
  /** آیا صفحه قفل است */
  isLockScreen: boolean;
  /** رمز قفل صفحه */
  lockScreenPassword?: string;
  /** آیا ورود منقضی شده */
  loginExpired: boolean;
  /** refresh token */
  refreshToken: AccessToken;
}

interface AccessActions {
  getMenuByPath: (path: string) => MenuRecordRaw | undefined;
  lockScreen: (password: string) => void;
  reset: () => void;
  setAccessCodes: (codes: string[]) => void;
  setAccessMenus: (menus: MenuRecordRaw[]) => void;
  setAccessRoutes: (routes: RouteRecordNormalized[]) => void;
  setAccessToken: (token: AccessToken) => void;
  setIsAccessChecked: (isAccessChecked: boolean) => void;
  setLoginExpired: (loginExpired: boolean) => void;
  setRefreshToken: (token: AccessToken) => void;
  unlockScreen: () => void;
}

const initialState = (): AccessState => ({
  accessCodes: [],
  accessMenus: [],
  accessRoutes: [],
  accessToken: null,
  isAccessChecked: false,
  isLockScreen: false,
  lockScreenPassword: undefined,
  loginExpired: false,
  refreshToken: null,
});

function findMenu(menus: MenuRecordRaw[], path: string): MenuRecordRaw | undefined {
  for (const menu of menus) {
    if (menu.path === path) return menu;
    if (menu.children) {
      const matched = findMenu(menu.children, path);
      if (matched) return matched;
    }
  }
  return undefined;
}

const useAccessStore = create<AccessActions & AccessState>()(
  persist(
    (set, get) => ({
      ...initialState(),
      getMenuByPath: (path) => findMenu(get().accessMenus, path),
      lockScreen: (password) => set({ isLockScreen: true, lockScreenPassword: password }),
      reset: () => set(initialState()),
      setAccessCodes: (accessCodes) => set({ accessCodes }),
      setAccessMenus: (accessMenus) => set({ accessMenus }),
      setAccessRoutes: (accessRoutes) => set({ accessRoutes }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setIsAccessChecked: (isAccessChecked) => set({ isAccessChecked }),
      setLoginExpired: (loginExpired) => set({ loginExpired }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      unlockScreen: () => set({ isLockScreen: false, lockScreenPassword: undefined }),
    }),
    {
      name: 'core-access',
      partialize: (state) => ({
        accessCodes: state.accessCodes,
        accessToken: state.accessToken,
        isLockScreen: state.isLockScreen,
        lockScreenPassword: state.lockScreenPassword,
        refreshToken: state.refreshToken,
      }),
      skipHydration: true,
      storage: createJSONStorage(() => createNamespacedStorage(() => localStorage)),
    },
  ),
);

registerStoreHydrate(() => useAccessStore.persist.rehydrate());
registerStoreReset(() => useAccessStore.getState().reset());

export { useAccessStore };
export type { AccessState };
