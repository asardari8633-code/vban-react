import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: lazy(() => import('#/views/dashboard/analytics')),
        meta: { affixTab: true, icon: 'lucide:area-chart', title: 'page.dashboard.analytics' },
        name: 'Analytics',
        path: 'analytics',
      },
      {
        component: lazy(() => import('#/views/dashboard/workspace')),
        meta: { icon: 'carbon:workspace', title: 'page.dashboard.workspace' },
        name: 'Workspace',
        path: 'workspace',
      },
    ],
    meta: { icon: 'lucide:layout-dashboard', order: -1, title: 'page.dashboard.title' },
    name: 'Dashboard',
    path: '/dashboard',
  },
];

export default routes;
