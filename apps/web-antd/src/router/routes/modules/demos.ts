import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: lazy(() => import('#/views/demos/antd')),
        meta: { icon: 'ant-design:ant-design-outlined', title: 'demos.antd' },
        name: 'AntDesignDemos',
        path: 'ant-design',
      },
      {
        children: [
          {
            component: lazy(() => import('#/views/demos/access')),
            meta: { icon: 'mdi:page-previous-outline', title: 'demos.access.pageAccess' },
            name: 'AccessPageControlDemo',
            path: 'page-control',
          },
          {
            component: lazy(() => import('#/views/demos/access/button-control')),
            meta: { icon: 'mdi:button-cursor', title: 'demos.access.buttonControl' },
            name: 'AccessButtonControlDemo',
            path: 'button-control',
          },
          {
            component: lazy(() => import('#/views/demos/access/menu-visible-403')),
            meta: {
              authority: ['no-body'],
              icon: 'mdi:button-cursor',
              menuVisibleWithForbidden: true,
              title: 'demos.access.menuVisible403',
            },
            name: 'AccessMenuVisible403Demo',
            path: 'menu-visible-403',
          },
          {
            component: lazy(() => import('#/views/demos/access/super-visible')),
            meta: { authority: ['super'], icon: 'mdi:button-cursor', title: 'demos.access.superVisible' },
            name: 'AccessSuperVisibleDemo',
            path: 'super-visible',
          },
          {
            component: lazy(() => import('#/views/demos/access/admin-visible')),
            meta: { authority: ['admin'], icon: 'mdi:button-cursor', title: 'demos.access.adminVisible' },
            name: 'AccessAdminVisibleDemo',
            path: 'admin-visible',
          },
          {
            component: lazy(() => import('#/views/demos/access/user-visible')),
            meta: { authority: ['user'], icon: 'mdi:button-cursor', title: 'demos.access.userVisible' },
            name: 'AccessUserVisibleDemo',
            path: 'user-visible',
          },
        ],
        meta: { icon: 'mdi:shield-key-outline', title: 'demos.access.frontendPermissions' },
        name: 'AccessDemos',
        path: 'access',
      },
      {
        children: [
          {
            component: lazy(() => import('#/views/demos/features/tabs')),
            meta: { icon: 'lucide:app-window', title: 'demos.features.tabs' },
            name: 'FeatureTabsDemo',
            path: 'tabs',
          },
          {
            component: lazy(() => import('#/views/demos/features/tabs/tab-detail')),
            meta: {
              activePath: '/demos/features/tabs',
              hideInMenu: true,
              maxNumOfOpenTab: 3,
              title: 'demos.features.tabDetail',
            },
            name: 'FeatureTabDetailDemo',
            path: 'tabs/detail/:id',
          },
          {
            component: lazy(() => import('#/views/demos/features/keep-alive')),
            meta: { icon: 'lucide:history', keepAlive: true, title: 'demos.features.keepAlive' },
            name: 'FeatureKeepAliveDemo',
            path: 'keep-alive',
          },
          {
            component: lazy(() => import('#/views/demos/features/login-expired')),
            meta: { icon: 'mdi:encryption-expiration', title: 'demos.features.loginExpired' },
            name: 'FeatureLoginExpiredDemo',
            path: 'login-expired',
          },
          {
            component: lazy(() => import('#/views/demos/features/icons')),
            meta: { icon: 'lucide:annoyed', title: 'demos.features.icons' },
            name: 'FeatureIconsDemo',
            path: 'icons',
          },
          {
            component: lazy(() => import('#/views/demos/features/watermark')),
            meta: { icon: 'lucide:tags', title: 'demos.features.watermark' },
            name: 'FeatureWatermarkDemo',
            path: 'watermark',
          },
          {
            component: lazy(() => import('#/views/demos/features/full-screen')),
            meta: { icon: 'lucide:fullscreen', title: 'demos.features.fullScreen' },
            name: 'FeatureFullScreenDemo',
            path: 'full-screen',
          },
          {
            children: [
              {
                component: lazy(() => import('#/views/demos/features/hide-children/child')),
                meta: { hideInMenu: true, title: 'demos.features.hideChildrenInMenu' },
                name: 'HideChildrenInMenuChildDemo',
                path: 'child',
              },
            ],
            component: lazy(() => import('#/views/demos/features/hide-children')),
            meta: {
              hideChildrenInMenu: true,
              icon: 'ic:round-menu',
              title: 'demos.features.hideChildrenInMenu',
            },
            name: 'HideChildrenInMenuParentDemo',
            path: 'hide-menu-children',
          },
        ],
        meta: { icon: 'mdi:feature-highlight', title: 'demos.features.title' },
        name: 'FeaturesDemos',
        path: 'features',
      },
      {
        children: [
          {
            component: lazy(() => import('#/views/_core/fallback/forbidden')),
            meta: { icon: 'mdi:do-not-disturb', title: '403' },
            name: 'Fallback403Demo',
            path: '403',
          },
          {
            component: lazy(() => import('#/views/_core/fallback/not-found')),
            meta: { icon: 'mdi:table-off', title: '404' },
            name: 'Fallback404Demo',
            path: '404',
          },
          {
            component: lazy(() => import('#/views/_core/fallback/internal-error')),
            meta: { icon: 'mdi:server-network-off', title: '500' },
            name: 'Fallback500Demo',
            path: '500',
          },
          {
            component: lazy(() => import('#/views/_core/fallback/offline')),
            meta: { icon: 'mdi:offline', title: 'ui.fallback.offline' },
            name: 'FallbackOfflineDemo',
            path: 'offline',
          },
          {
            component: lazy(() => import('#/views/_core/fallback/coming-soon')),
            meta: { icon: 'mdi:timer-sand', title: 'ui.fallback.comingSoon' },
            name: 'FallbackComingSoonDemo',
            path: 'coming-soon',
          },
        ],
        meta: { icon: 'mdi:lightbulb-error-outline', title: 'صفحات خطا' },
        name: 'FallbackDemos',
        path: 'fallback',
      },
      {
        children: [
          {
            component: lazy(() => import('#/views/demos/nested/menu-1')),
            meta: { badge: '۱', badgeVariants: 'success', icon: 'ic:round-menu', keepAlive: true, title: 'demos.nested.menu1' },
            name: 'Menu1Demo',
            path: 'menu1',
          },
          {
            children: [
              {
                component: lazy(() => import('#/views/demos/nested/menu-2-1')),
                meta: { icon: 'ic:round-menu', keepAlive: true, title: 'demos.nested.menu2_1' },
                name: 'Menu21Demo',
                path: 'menu2-1',
              },
            ],
            meta: { badgeType: 'dot', icon: 'ic:round-menu', title: 'demos.nested.menu2' },
            name: 'Menu2Demo',
            path: 'menu2',
          },
          {
            children: [
              {
                component: lazy(() => import('#/views/demos/nested/menu-3-1')),
                meta: { icon: 'ic:round-menu', keepAlive: true, title: 'demos.nested.menu3_1' },
                name: 'Menu31Demo',
                path: 'menu3-1',
              },
              {
                children: [
                  {
                    component: lazy(() => import('#/views/demos/nested/menu-3-2-1')),
                    meta: { icon: 'ic:round-menu', keepAlive: true, title: 'demos.nested.menu3_2_1' },
                    name: 'Menu321Demo',
                    path: 'menu3-2-1',
                  },
                ],
                meta: { icon: 'ic:round-menu', title: 'demos.nested.menu3_2' },
                name: 'Menu32Demo',
                path: 'menu3-2',
              },
            ],
            meta: { icon: 'ic:round-menu', title: 'demos.nested.menu3' },
            name: 'Menu3Demo',
            path: 'menu3',
          },
        ],
        meta: { icon: 'ic:round-menu', title: 'demos.nested.title' },
        name: 'NestedDemos',
        path: 'nested',
      },
    ],
    meta: { icon: 'ic:baseline-view-in-ar', keepAlive: true, order: 1000, title: 'demos.title' },
    name: 'Demos',
    path: '/demos',
  },
];

export default routes;
