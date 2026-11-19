import type { Recordable } from './helper';
import type { IconType } from './router';

interface MenuRecordBadgeRaw {
  /** نشان */
  badge?: string;
  /** نوع نشان */
  badgeType?: 'dot' | 'normal';
  /** رنگ نشان */
  badgeVariants?: 'destructive' | 'primary' | (string & {});
}

/**
 * داده‌ی خام منو
 */
interface MenuRecordRaw extends MenuRecordBadgeRaw {
  /** آیکون حالت فعال */
  activeIcon?: string;
  /** زیرمنوها */
  children?: MenuRecordRaw[];
  /** غیرفعال */
  disabled?: boolean;
  /** آیکون */
  icon?: IconType;
  /** نام منو */
  name: string;
  /** ترتیب */
  order?: number;
  /** مسیر والد */
  parent?: string;
  /** مسیر همه‌ی والدها */
  parents?: string[];
  /** مسیر منو؛ یکتا و قابل استفاده به‌عنوان کلید */
  path: string;
  /** پارامترهای منو */
  query?: Recordable<any>;
  /** نمایش در منو */
  show?: boolean;
}

export type { MenuRecordBadgeRaw, MenuRecordRaw };
