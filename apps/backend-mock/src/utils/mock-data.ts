export interface UserInfo {
  homePath?: string;
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
}

export interface TimezoneOption {
  label: string;
  offset: number;
  timezone: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    homePath: '/dashboard/workspace',
    id: 0,
    password: '123456',
    realName: 'وبن',
    roles: ['super'],
    username: 'vben',
  },
  {
    homePath: '/dashboard/workspace',
    id: 1,
    password: '123456',
    realName: 'مدیر سیستم',
    roles: ['admin'],
    username: 'admin',
  },
  {
    homePath: '/dashboard/analytics',
    id: 2,
    password: '123456',
    realName: 'جک',
    roles: ['user'],
    username: 'jack',
  },
];

export const MOCK_CODES = [
  { codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'], username: 'vben' },
  { codes: ['AC_100010', 'AC_100020', 'AC_100030'], username: 'admin' },
  { codes: ['AC_1000001', 'AC_1000002'], username: 'jack' },
];

const dashboardMenus = [
  {
    children: [
      {
        component: '/dashboard/analytics/index',
        meta: { affixTab: true, icon: 'lucide:area-chart', title: 'page.dashboard.analytics' },
        name: 'Analytics',
        path: 'analytics',
      },
      {
        component: '/dashboard/workspace/index',
        meta: { icon: 'carbon:workspace', title: 'page.dashboard.workspace' },
        name: 'Workspace',
        path: 'workspace',
      },
    ],
    meta: { icon: 'lucide:layout-dashboard', order: -1, title: 'page.dashboard.title' },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/dashboard/analytics',
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: { icon: 'mdi:button-cursor', title: 'demos.access.adminVisible' },
      name: 'AccessAdminVisibleDemo',
      path: 'admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: { icon: 'mdi:button-cursor', title: 'demos.access.superVisible' },
      name: 'AccessSuperVisibleDemo',
      path: 'super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: { icon: 'mdi:button-cursor', title: 'demos.access.userVisible' },
      name: 'AccessUserVisibleDemo',
      path: 'user-visible',
    },
  };

  return [
    {
      children: [
        {
          children: [
            {
              component: '/demos/access/index',
              meta: { icon: 'mdi:page-previous-outline', title: 'demos.access.pageAccess' },
              name: 'AccessPageControlDemo',
              path: 'page-control',
            },
            {
              component: '/demos/access/button-control',
              meta: { icon: 'mdi:button-cursor', title: 'demos.access.buttonControl' },
              name: 'AccessButtonControlDemo',
              path: 'button-control',
            },
            {
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
              name: 'AccessMenuVisible403Demo',
              path: 'menu-visible-403',
            },
            roleWithMenus[role],
          ],
          meta: { icon: 'mdi:cloud-key-outline', title: 'demos.access.backendPermissions' },
          name: 'AccessDemos',
          path: 'access',
          redirect: '/demos/access/page-control',
        },
      ],
      meta: { icon: 'ic:baseline-view-in-ar', keepAlive: true, order: 1000, title: 'demos.title' },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
    },
  ];
};

export const MOCK_MENUS = [
  { menus: [...dashboardMenus, ...createDemosMenus('super')], username: 'vben' },
  { menus: [...dashboardMenus, ...createDemosMenus('admin')], username: 'admin' },
  { menus: [...dashboardMenus, ...createDemosMenus('user')], username: 'jack' },
];

/**
 * فهرست منوها برای صفحه‌ی «مدیریت منو»
 */
export const MOCK_MENU_LIST: any[] = [
  {
    children: [
      {
        component: '/dashboard/analytics/index',
        id: 101,
        meta: { affixTab: true, icon: 'lucide:area-chart', keepAlive: true, title: 'page.dashboard.analytics' },
        name: 'Analytics',
        path: 'analytics',
        pid: 1,
        status: 1,
        type: 'menu',
      },
      {
        component: '/dashboard/workspace/index',
        id: 102,
        meta: { icon: 'carbon:workspace', title: 'page.dashboard.workspace' },
        name: 'Workspace',
        path: 'workspace',
        pid: 1,
        status: 1,
        type: 'menu',
      },
    ],
    icon: 'lucide:layout-dashboard',
    id: 1,
    meta: { icon: 'lucide:layout-dashboard', order: -1, title: 'page.dashboard.title' },
    name: 'Dashboard',
    path: '/dashboard',
    status: 1,
    type: 'catalog',
  },
  {
    children: [
      {
        authCode: 'System:Menu:List',
        children: [
          { authCode: 'System:Menu:Create', id: 20_101, meta: { title: 'common.create' }, name: 'SystemMenuCreate', pid: 201, status: 1, type: 'button' },
          { authCode: 'System:Menu:Edit', id: 20_102, meta: { title: 'common.edit' }, name: 'SystemMenuEdit', pid: 201, status: 1, type: 'button' },
          { authCode: 'System:Menu:Delete', id: 20_103, meta: { title: 'common.delete' }, name: 'SystemMenuDelete', pid: 201, status: 1, type: 'button' },
        ],
        component: '/system/menu/list',
        id: 201,
        meta: { icon: 'carbon:menu', title: 'system.menu.title' },
        name: 'SystemMenu',
        path: '/system/menu',
        pid: 2,
        status: 1,
        type: 'menu',
      },
      {
        authCode: 'System:Dept:List',
        children: [
          { authCode: 'System:Dept:Create', id: 20_401, meta: { title: 'common.create' }, name: 'SystemDeptCreate', pid: 202, status: 1, type: 'button' },
          { authCode: 'System:Dept:Edit', id: 20_402, meta: { title: 'common.edit' }, name: 'SystemDeptEdit', pid: 202, status: 1, type: 'button' },
          { authCode: 'System:Dept:Delete', id: 20_403, meta: { title: 'common.delete' }, name: 'SystemDeptDelete', pid: 202, status: 1, type: 'button' },
        ],
        component: '/system/dept/list',
        id: 202,
        meta: { icon: 'carbon:container-services', title: 'system.dept.title' },
        name: 'SystemDept',
        path: '/system/dept',
        pid: 2,
        status: 1,
        type: 'menu',
      },
      {
        authCode: 'System:Role:List',
        component: '/system/role/list',
        id: 203,
        meta: { icon: 'mdi:account-group', title: 'system.role.title' },
        name: 'SystemRole',
        path: '/system/role',
        pid: 2,
        status: 1,
        type: 'menu',
      },
      {
        authCode: 'System:User:List',
        component: '/system/user/list',
        id: 204,
        meta: { icon: 'mdi:account', title: 'system.user.title' },
        name: 'SystemUser',
        path: '/system/user',
        pid: 2,
        status: 1,
        type: 'menu',
      },
    ],
    id: 2,
    meta: {
      badge: 'جدید',
      badgeType: 'normal',
      badgeVariants: 'primary',
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
    },
    name: 'System',
    path: '/system',
    status: 1,
    type: 'catalog',
  },
  {
    children: [
      {
        component: 'IFrameView',
        id: 901,
        meta: { icon: 'carbon:book', iframeSrc: 'https://doc.vben.pro', title: 'demos.vben.document' },
        name: 'VbenDocument',
        path: '/vben-admin/document',
        pid: 9,
        status: 1,
        type: 'embedded',
      },
      {
        component: 'IFrameView',
        id: 902,
        meta: { icon: 'carbon:logo-github', link: 'https://github.com/vbenjs/vue-vben-admin', title: 'Github' },
        name: 'VbenGithub',
        path: '/vben-admin/github',
        pid: 9,
        status: 1,
        type: 'link',
      },
    ],
    id: 9,
    meta: { badgeType: 'dot', icon: 'carbon:data-center', order: 9998, title: 'demos.vben.title' },
    name: 'Project',
    path: '/vben-admin',
    status: 1,
    type: 'catalog',
  },
  {
    component: '_core/about/index',
    id: 10,
    meta: { icon: 'lucide:copyright', order: 9999, title: 'demos.vben.about' },
    name: 'About',
    path: '/about',
    status: 1,
    type: 'menu',
  },
];

export function getMenuIds(menus: any[]): number[] {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children?.length) ids.push(...getMenuIds(item.children));
  });
  return ids;
}

export const TIME_ZONE_OPTIONS: TimezoneOption[] = [
  { label: 'Asia/Tehran (GMT+3:30)', offset: 3.5, timezone: 'Asia/Tehran' },
  { label: 'Asia/Dubai (GMT+4)', offset: 4, timezone: 'Asia/Dubai' },
  { label: 'Europe/Istanbul (GMT+3)', offset: 3, timezone: 'Europe/Istanbul' },
  { label: 'Europe/London (GMT0)', offset: 0, timezone: 'Europe/London' },
  { label: 'America/New_York (GMT-5)', offset: -5, timezone: 'America/New_York' },
  { label: 'Asia/Shanghai (GMT+8)', offset: 8, timezone: 'Asia/Shanghai' },
  { label: 'Asia/Tokyo (GMT+9)', offset: 9, timezone: 'Asia/Tokyo' },
];
