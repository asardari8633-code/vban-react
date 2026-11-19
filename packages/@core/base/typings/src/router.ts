import type { ComponentType, LazyExoticComponent } from 'react';

import type { Recordable } from './helper';

/**
 * آیکون: نام iconify (مثل `lucide:user`)، آدرس تصویر، یا کامپوننت React
 */
type IconType = ComponentType<any> | string;

/** هر کامپوننتی که بتوان برای مسیر رندر کرد (از جمله React.lazy) */
type RouteComponent =
  | ComponentType<any>
  | LazyExoticComponent<ComponentType<any>>;

interface RouteMeta {
  /** آیکون فعال (منو/زبانه) */
  activeIcon?: string;
  /** منوی فعال؛ وقتی می‌خواهید به‌جای منوی فعلی، منوی والد فعال شود */
  activePath?: string;
  /** ساخت مسیرنما از روی سلسله‌مراتب activePath */
  breadcrumbUseActivePath?: boolean;
  /** زبانه‌ی ثابت */
  affixTab?: boolean;
  /** ترتیب زبانه‌ی ثابت */
  affixTabOrder?: number;
  /** نقش‌های لازم برای دسترسی */
  authority?: string[];
  /** نشان (badge) */
  badge?: string;
  /** نوع نشان */
  badgeType?: 'dot' | 'normal';
  /** رنگ نشان */
  badgeVariants?:
    | 'default'
    | 'destructive'
    | 'primary'
    | 'success'
    | 'warning'
    | (string & {});
  /** کلید زبانه بر اساس مسیر کامل (پیش‌فرض true) */
  fullPathKey?: boolean;
  /** زیرمنوها در منو نمایش داده نشوند */
  hideChildrenInMenu?: boolean;
  /** در مسیرنما نمایش داده نشود */
  hideInBreadcrumb?: boolean;
  /** در منو نمایش داده نشود */
  hideInMenu?: boolean;
  /** در نوار زبانه نمایش داده نشود */
  hideInTab?: boolean;
  /** آیکون (منو/زبانه) */
  icon?: IconType;
  /** آدرس iframe */
  iframeSrc?: string;
  /** بدون بررسی دسترسی قابل مشاهده است */
  ignoreAccess?: boolean;
  /** نگه‌داشتن صفحه در حافظه (keep-alive) */
  keepAlive?: boolean;
  /** لینک خارجی */
  link?: string;
  /** آیا مسیر قبلاً بارگذاری شده است */
  loaded?: boolean;
  /** حداکثر تعداد زبانه‌های باز از این مسیر */
  maxNumOfOpenTab?: number;
  /** منو دیده شود اما دسترسی به 403 هدایت شود */
  menuVisibleWithForbidden?: boolean;
  /** عنوان دلخواه زبانه */
  newTabTitle?: string;
  /** بدون چیدمان پایه (فقط در سطح اول) */
  noBasicLayout?: boolean;
  /** باز شدن در پنجره‌ی جدید */
  openInNewWindow?: boolean;
  /** ترتیب در منو */
  order?: number;
  /** پارامترهای همراه منو */
  query?: Recordable<any>;
  /** عنوان (کلید ترجمه یا متن) */
  title: string;
}

/**
 * تعریف مسیر — معادل RouteRecordRaw در vue-router.
 * مسیر فرزند اگر با `/` شروع نشود نسبت به والد محاسبه می‌شود.
 */
interface RouteRecordRaw {
  children?: RouteRecordRaw[];
  component?: RouteComponent;
  meta?: RouteMeta;
  name?: string;
  path: string;
  redirect?: string;
}

/**
 * مسیر نرمال‌شده: مسیر کامل و زنجیره‌ی والدین محاسبه شده است
 */
interface RouteRecordNormalized extends Omit<RouteRecordRaw, 'children'> {
  children: RouteRecordNormalized[];
  fullPath: string;
  meta: RouteMeta;
  /** زنجیره‌ی والدها از ریشه تا خود مسیر */
  matched: RouteRecordNormalized[];
  name: string;
}

/** مسیری که از سرور می‌آید؛ کامپوننت به‌صورت رشته است */
type RouteRecordStringComponent<T = string> = Omit<
  RouteRecordRaw,
  'children' | 'component'
> & {
  children?: RouteRecordStringComponent<T>[];
  component?: T;
};

type ComponentRecordType = Record<string, RouteComponent>;

/**
 * وضعیت مسیر فعلی (معادل useRoute در vue-router)
 */
interface RouteLocation {
  fullPath: string;
  hash: string;
  matched: RouteRecordNormalized[];
  meta: RouteMeta;
  name: string;
  params: Record<string, string | undefined>;
  path: string;
  query: Recordable<string>;
}

interface GenerateMenuAndRoutesOptions {
  fetchMenuListAsync?: () => Promise<RouteRecordStringComponent[]>;
  forbiddenComponent?: RouteComponent;
  layoutMap?: ComponentRecordType;
  pageMap?: ComponentRecordType;
  roles?: string[];
  routes: RouteRecordRaw[];
}

export type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  IconType,
  RouteComponent,
  RouteLocation,
  RouteMeta,
  RouteRecordNormalized,
  RouteRecordRaw,
  RouteRecordStringComponent,
};
