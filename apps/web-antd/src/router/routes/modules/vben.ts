import type { RouteRecordRaw } from '@vben/types';

import { lazy } from 'react';

import {
  VBEN_ANT_PREVIEW_URL,
  VBEN_DOC_URL,
  VBEN_GITHUB_URL,
  VBEN_LOGO_URL,
} from '@vben/constants';
import { IFrameView } from '@vben/layouts';

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: IFrameView,
        meta: { icon: 'lucide:book-open-text', iframeSrc: VBEN_DOC_URL, keepAlive: true, title: 'demos.vben.document' },
        name: 'VbenDocument',
        path: 'document',
      },
      {
        component: IFrameView,
        meta: { icon: 'mdi:github', link: VBEN_GITHUB_URL, title: 'Github' },
        name: 'VbenGithub',
        path: 'github',
      },
      {
        component: IFrameView,
        meta: { badgeType: 'dot', icon: 'logos:vue', link: VBEN_ANT_PREVIEW_URL, title: 'demos.vben.antdv' },
        name: 'VbenAntdv',
        path: 'antdv',
      },
    ],
    meta: { badgeType: 'dot', icon: VBEN_LOGO_URL, order: 9998, title: 'demos.vben.title' },
    name: 'VbenProject',
    path: '/vben-admin',
  },
  {
    component: lazy(() => import('#/views/_core/about')),
    meta: { icon: 'lucide:copyright', order: 9999, title: 'demos.vben.about' },
    name: 'VbenAbout',
    path: '/vben-admin/about',
  },
  {
    component: lazy(() => import('#/views/_core/profile')),
    meta: { hideInMenu: true, icon: 'lucide:user', title: 'page.auth.profile' },
    name: 'Profile',
    path: '/profile',
  },
];

export default routes;
