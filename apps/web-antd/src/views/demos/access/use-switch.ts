import { useNavigate } from 'react-router';

import { updatePreferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useTabbarStore } from '@vben/stores';

import { authLogin } from '#/store/auth';

/**
 * ابزار تعویض حساب و حالت دسترسی در نمونه‌های دسترسی
 */
export function useAccessSwitch() {
  const navigate = useNavigate();

  /** ورود با حساب دیگر و بازسازی مسیرها */
  async function changeAccount(username: string) {
    const current = `${window.location.pathname}${window.location.search}`;
    resetAllStores();
    await authLogin({ password: '123456', username }, async () => {
      navigate(current, { replace: true });
    });
  }

  /** تغییر حالت دسترسی frontend/backend و بازسازی مسیرها */
  function changeAccessMode(mode: 'backend' | 'frontend') {
    updatePreferences({ app: { accessMode: mode } });
    useTabbarStore.getState().reset();
    useAccessStore.setState({ accessMenus: [], accessRoutes: [], isAccessChecked: false });
    navigate(window.location.pathname, { replace: true });
  }

  return { changeAccessMode, changeAccount };
}
