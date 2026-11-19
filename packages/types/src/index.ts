import type { BasicUserInfo } from '@vben-core/typings';

export type * from '@vben-core/typings';

/** اطلاعات کاربر برنامه */
interface UserInfo extends BasicUserInfo {
  /** توضیح کاربر */
  desc?: string;
  /** مسیر خانه‌ی اختصاصی کاربر */
  homePath: string;
  /** توکن */
  token?: string;
}

export type { UserInfo };
