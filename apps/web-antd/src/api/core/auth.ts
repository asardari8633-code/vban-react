import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** پارامترهای ورود */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** نتیجه‌ی ورود */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/** ورود */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data);
}

/** تازه‌سازی توکن */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', undefined, {
    withCredentials: true,
  });
}

/** خروج */
export async function logoutApi() {
  return baseRequestClient.post('/auth/logout', undefined, { withCredentials: true });
}

/** کدهای دسترسی کاربر */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
