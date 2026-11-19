interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /** آواتار */
  avatar: string;
  /** نام کامل کاربر */
  realName: string;
  /** نقش‌های کاربر */
  roles?: string[];
  /** شناسه‌ی کاربر */
  userId: string;
  /** نام کاربری */
  username: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
