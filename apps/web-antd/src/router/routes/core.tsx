import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

/**
 * مسیرهای ثابت برنامه (بدون نیاز به دسترسی)
 * چیدمان پایه برای مسیر «/» در router/index.tsx اعمال می‌شود.
 */
const authRoutes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: lazy(() => import('#/views/_core/authentication/login')),
        meta: { title: 'page.auth.login' },
        name: 'Login',
        path: 'login',
      },
      {
        component: lazy(() => import('#/views/_core/authentication/code-login')),
        meta: { title: 'page.auth.codeLogin' },
        name: 'CodeLogin',
        path: 'code-login',
      },
      {
        component: lazy(() => import('#/views/_core/authentication/qrcode-login')),
        meta: { title: 'page.auth.qrcodeLogin' },
        name: 'QrCodeLogin',
        path: 'qrcode-login',
      },
      {
        component: lazy(() => import('#/views/_core/authentication/forget-password')),
        meta: { title: 'page.auth.forgetPassword' },
        name: 'ForgetPassword',
        path: 'forget-password',
      },
      {
        component: lazy(() => import('#/views/_core/authentication/register')),
        meta: { title: 'page.auth.register' },
        name: 'Register',
        path: 'register',
      },
    ],
    meta: { hideInTab: true, title: 'Authentication' },
    name: 'Authentication',
    path: '/auth',
  },
];

/** صفحه‌ی ۴۰۴ سراسری */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: lazy(() => import('#/views/_core/fallback/not-found')),
  meta: { hideInBreadcrumb: true, hideInMenu: true, hideInTab: true, title: '404' },
  name: 'FallbackNotFound',
  path: '*',
};

const rootRoute: RouteRecordRaw = {
  meta: { hideInBreadcrumb: true, hideInTab: true, title: 'Root' },
  name: 'Root',
  path: '/',
};

const coreRoutes: RouteRecordRaw[] = [rootRoute, ...authRoutes];

export { authRoutes, coreRoutes, fallbackNotFoundRoute };
