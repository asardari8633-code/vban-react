import type { RouteRecordStringComponent, TimezoneOption, UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export * from './auth';

/** اطلاعات کاربر */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

/** همه‌ی منوهای کاربر (حالت backend) */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}

/** منطقه‌ی زمانی کاربر */
export async function getTimezoneApi() {
  return requestClient.get<null | string>('/timezone/getTimezone');
}

/** گزینه‌های منطقه‌ی زمانی */
export async function getTimezoneOptionsApi() {
  return requestClient.get<TimezoneOption[]>('/timezone/getTimezoneOptions');
}

/** تنظیم منطقه‌ی زمانی کاربر */
export async function setUserTimezoneApi(timezone: string) {
  await requestClient.post('/timezone/setTimezone', { timezone });
}
