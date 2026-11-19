import type { UserInfo } from '@vben/types';

import { create } from 'zustand';

import { registerStoreReset } from '../setup';

interface UserState {
  /** اطلاعات کاربر */
  userInfo: null | UserInfo;
  /** نقش‌های کاربر */
  userRoles: string[];
}

interface UserActions {
  reset: () => void;
  setUserInfo: (userInfo: null | UserInfo) => void;
  setUserRoles: (roles: string[]) => void;
}

const useUserStore = create<UserActions & UserState>()((set) => ({
  reset: () => set({ userInfo: null, userRoles: [] }),
  setUserInfo: (userInfo) => set({ userInfo, userRoles: userInfo?.roles ?? [] }),
  setUserRoles: (userRoles) => set({ userRoles }),
  userInfo: null,
  userRoles: [],
}));

registerStoreReset(() => useUserStore.getState().reset());

export { useUserStore };
export type { UserState };
