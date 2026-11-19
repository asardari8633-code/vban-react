import type { RequestClient } from './request-client';
import type { MakeErrorMessageFn, ResponseInterceptorConfig } from './types';

import { $t } from '@vben/locales';
import { isFunction } from '@vben/utils';
import axios from 'axios';

/**
 * رهگیر پیش‌فرض پاسخ: بررسی کد موفقیت و استخراج data
 */
export const defaultResponseInterceptor = ({
  codeField = 'code',
  dataField = 'data',
  successCode = 0,
}: {
  /** نام فیلد کد در پاسخ */
  codeField?: string;
  /** نام فیلد داده یا تابع استخراج */
  dataField?: ((response: any) => any) | string;
  /** کد موفقیت یا تابع بررسی */
  successCode?: ((code: any) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    fulfilled: (response) => {
      const { config, data: responseData, status } = response;

      if (config.responseReturn === 'raw') return response;

      if (status >= 200 && status < 400) {
        if (config.responseReturn === 'body') return responseData;
        if (
          isFunction(successCode)
            ? successCode(responseData?.[codeField])
            : responseData?.[codeField] === successCode
        ) {
          return isFunction(dataField) ? dataField(responseData) : responseData[dataField];
        }
      }
      throw Object.assign({}, response, { response });
    },
  };
};

/**
 * رهگیر احراز هویت: مدیریت 401 و تازه‌سازی توکن با صف درخواست‌ها
 */
export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient;
  doReAuthenticate: () => Promise<void>;
  doRefreshToken: () => Promise<string>;
  enableRefreshToken: (() => boolean) | boolean;
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error;
      if (response?.status !== 401) throw error;

      const refreshEnabled = isFunction(enableRefreshToken)
        ? enableRefreshToken()
        : enableRefreshToken;

      if (!refreshEnabled || config.__isRetryRequest) {
        await doReAuthenticate();
        throw error;
      }

      // اگر در حال تازه‌سازی است، درخواست در صف قرار می‌گیرد
      if (client.isRefreshing) {
        return new Promise((resolve, reject) => {
          client.refreshTokenQueue.push((newToken, refreshError) => {
            if (!newToken) {
              reject(refreshError ?? new Error('Token refresh failed'));
              return;
            }
            config.headers.Authorization = formatToken(newToken);
            config.__isRetryRequest = true;
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      client.isRefreshing = true;
      config.__isRetryRequest = true;
      try {
        const newToken = await doRefreshToken();
        client.refreshTokenQueue.forEach((callback) => callback(newToken));
        client.refreshTokenQueue = [];
        return client.request(error.config.url, { ...error.config });
      } catch (refreshError) {
        client.refreshTokenQueue.forEach((callback) => callback(null, refreshError));
        client.refreshTokenQueue = [];
        console.error('Refresh token failed, please login again.');
        await doReAuthenticate();
        throw refreshError;
      } finally {
        client.isRefreshing = false;
      }
    },
  };
};

/**
 * رهگیر پیام خطا
 */
export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn,
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) return Promise.reject(error);

      const err: string = error?.toString?.() ?? '';
      let errMsg = '';
      if (err?.includes('Network Error')) {
        errMsg = $t('ui.fallback.http.networkError');
      } else if (error?.message?.includes?.('timeout')) {
        errMsg = $t('ui.fallback.http.requestTimeout');
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      let errorMessage: string;
      const status = error?.response?.status;
      switch (status) {
        case 400: {
          errorMessage = $t('ui.fallback.http.badRequest');
          break;
        }
        case 401: {
          errorMessage = $t('ui.fallback.http.unauthorized');
          break;
        }
        case 403: {
          errorMessage = $t('ui.fallback.http.forbidden');
          break;
        }
        case 404: {
          errorMessage = $t('ui.fallback.http.notFound');
          break;
        }
        case 408: {
          errorMessage = $t('ui.fallback.http.requestTimeout');
          break;
        }
        default: {
          errorMessage = $t('ui.fallback.http.internalServerError');
        }
      }
      makeErrorMessage?.(errorMessage, error);
      return Promise.reject(error);
    },
  };
};
