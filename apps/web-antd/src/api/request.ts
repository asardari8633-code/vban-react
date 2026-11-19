import type { RequestClientOptions } from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { i18n } from '@vben/locales';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from '#/adapter/antd-static';

import { mockAdapter } from './mock-adapter';

/** حالت دمو: سرور ماک داخل مرورگر اجرا می‌شود (بدون نیاز به بک‌اند) */
const USE_IN_BROWSER_MOCK = import.meta.env.VITE_MOCK === 'true';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({ ...options, baseURL });
  if (USE_IN_BROWSER_MOCK) client.instance.defaults.adapter = mockAdapter;

  /**
   * احراز هویت مجدد (توکن نامعتبر یا منقضی)
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired.');
    const accessStore = useAccessStore.getState();
    accessStore.setAccessToken(null);
    if (preferences.app.loginExpiredMode === 'modal' && accessStore.isAccessChecked) {
      accessStore.setLoginExpired(true);
    } else {
      const { logout } = await import('#/store/auth');
      await logout();
    }
  }

  /**
   * تازه‌سازی توکن
   */
  async function doRefreshToken() {
    const { refreshTokenApi } = await import('./core/auth');
    const resp = await refreshTokenApi();
    const newToken = resp.data;
    useAccessStore.getState().setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // افزودن توکن و زبان به هر درخواست
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      config.headers.Authorization = formatToken(useAccessStore.getState().accessToken);
      config.headers['Accept-Language'] = i18n.language || preferences.app.locale;
      return config;
    },
  });

  // پاسخ: { code, data, message } → data
  client.addResponseInterceptor(
    defaultResponseInterceptor({ codeField: 'code', dataField: 'data', successCode: 0 }),
  );

  // مدیریت 401 و refresh token
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: () => preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // نمایش پیام خطا
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.error ?? responseData?.message ?? '';
      message.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, { responseReturn: 'data' });

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
if (USE_IN_BROWSER_MOCK) baseRequestClient.instance.defaults.adapter = mockAdapter;
