import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        children: [
          {
            component: lazy(() => import('#/views/examples/form/basic')),
            meta: { title: 'examples.form.basic' },
            name: 'FormBasicExample',
            path: 'basic',
          },
          {
            component: lazy(() => import('#/views/examples/form/query')),
            meta: { title: 'examples.form.query' },
            name: 'FormQueryExample',
            path: 'query',
          },
          {
            component: lazy(() => import('#/views/examples/form/dynamic')),
            meta: { title: 'examples.form.dynamic' },
            name: 'FormDynamicExample',
            path: 'dynamic',
          },
        ],
        meta: { icon: 'mdi:form-select', title: 'examples.form.title' },
        name: 'FormExample',
        path: 'form',
      },
      {
        component: lazy(() => import('#/views/examples/table/remote')),
        meta: { icon: 'lucide:table', title: 'examples.table.remote' },
        name: 'TableRemoteExample',
        path: 'table',
      },
      {
        component: lazy(() => import('#/views/examples/modal')),
        meta: { icon: 'system-uicons:window-content', title: 'examples.modal.title' },
        name: 'ModalExample',
        path: 'modal',
      },
      {
        component: lazy(() => import('#/views/examples/drawer')),
        meta: { icon: 'iconoir:drawer', title: 'examples.drawer.title' },
        name: 'DrawerExample',
        path: 'drawer',
      },
      {
        component: lazy(() => import('#/views/examples/count-to')),
        meta: { icon: 'mdi:animation-play', title: 'examples.countTo.title' },
        name: 'CountToExample',
        path: 'count-to',
      },
      {
        component: lazy(() => import('#/views/examples/captcha')),
        meta: { icon: 'mdi:security', title: 'examples.captcha.title' },
        name: 'CaptchaExample',
        path: 'captcha',
      },
    ],
    meta: { icon: 'ion:layers-outline', keepAlive: true, order: 1001, title: 'examples.title' },
    name: 'Examples',
    path: '/examples',
  },
];

export default routes;
