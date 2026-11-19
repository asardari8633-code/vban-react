import type { Recordable, UserInfo } from '@vben/types';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';
import { create } from 'zustand';

import { notification } from '#/adapter/antd-static';
import { getAccessCodesApi, getUserInfoApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';
import { appNavigate, currentFullPath } from '#/router/navigation';

interface AuthState {
  loginLoading: boolean;
}

/**
 * store احراز هویت برنامه (معادل useAuthStore در Vben)
 */
const useAuthStore = create<AuthState>()(() => ({ loginLoading: false }));

/**
 * دریافت اطلاعات کاربر
 */
async function fetchUserInfo() {
  const userInfo = await getUserInfoApi();
  useUserStore.getState().setUserInfo(userInfo);
  return userInfo;
}

/**
 * ورود
 * @param params نام کاربری/رمز عبور
 * @param onSuccess در صورت وجود، به‌جای هدایت پیش‌فرض اجرا می‌شود
 */
async function authLogin(params: Recordable<any>, onSuccess?: () => Promise<void> | void) {
  let userInfo: null | UserInfo = null;
  const accessStore = useAccessStore.getState();
  try {
    useAuthStore.setState({ loginLoading: true });
    const { accessToken } = await loginApi(params);
    if (accessToken) {
      accessStore.setAccessToken(accessToken);
      const [fetchedUserInfo, accessCodes] = await Promise.all([fetchUserInfo(), getAccessCodesApi()]);
      userInfo = fetchedUserInfo;
      useAccessStore.getState().setAccessCodes(accessCodes);

      if (useAccessStore.getState().loginExpired) {
        // ورود مجدد از مودال انقضا: در همان صفحه می‌مانیم
        useAccessStore.getState().setLoginExpired(false);
      } else if (onSuccess) {
        await onSuccess();
      } else {
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        appNavigate(
          redirect ? decodeURIComponent(redirect) : userInfo.homePath || preferences.app.defaultHomePath,
          { replace: true },
        );
      }

      if (userInfo?.realName) {
        notification.success({
          description: `${$t('authentication.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
          title: $t('authentication.loginSuccess'),
        });
      }
    }
  } finally {
    useAuthStore.setState({ loginLoading: false });
  }
  return { userInfo };
}

/**
 * خروج
 * @param redirect آدرس فعلی برای بازگشت پس از ورود ذخیره شود
 */
async function logout(redirect = true) {
  try {
    await logoutApi();
  } catch {
    // خطای خروج نادیده گرفته می‌شود
  }
  resetAllStores();
  useAccessStore.getState().setLoginExpired(false);

  const fullPath = currentFullPath();
  const alreadyOnLogin = fullPath.startsWith(LOGIN_PATH);
  const query = redirect && !alreadyOnLogin ? `?redirect=${encodeURIComponent(fullPath)}` : '';
  appNavigate(`${LOGIN_PATH}${query}`, { replace: true });
}

export { authLogin, fetchUserInfo, logout, useAuthStore };
