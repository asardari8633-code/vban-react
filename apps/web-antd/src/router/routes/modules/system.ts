import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: lazy(() => import('#/views/system/user/list')),
        meta: { icon: 'mdi:account', title: 'system.user.title' },
        name: 'SystemUser',
        path: '/system/user',
      },
      {
        component: lazy(() => import('#/views/system/role/list')),
        meta: { icon: 'mdi:account-group', title: 'system.role.title' },
        name: 'SystemRole',
        path: '/system/role',
      },
      {
        component: lazy(() => import('#/views/system/menu/list')),
        meta: { icon: 'mdi:menu', title: 'system.menu.title' },
        name: 'SystemMenu',
        path: '/system/menu',
      },
      {
        component: lazy(() => import('#/views/system/dept/list')),
        meta: { icon: 'charm:organisation', title: 'system.dept.title' },
        name: 'SystemDept',
        path: '/system/dept',
      },
    ],
    meta: {
      badge: 'جدید',
      badgeType: 'normal',
      badgeVariants: 'primary',
      icon: 'ion:settings-outline',
      order: 9997,
      title: 'system.title',
    },
    name: 'System',
    path: '/system',
  },
];

export default routes;
