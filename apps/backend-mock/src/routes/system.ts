import { fakerFA as faker } from '@faker-js/faker';
import { Hono } from 'hono';

import { verifyAccessToken } from '../utils/jwt';
import { getMenuIds, MOCK_MENU_LIST } from '../utils/mock-data';
import {
  queryInt,
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
  useResponseError,
  useResponseSuccess,
} from '../utils/response';

const system = new Hono();

faker.seed(2024);

const formatter = (date: Date) =>
  new Date(date).toISOString().replace('T', ' ').slice(0, 19);

/* ---------------------------------- بخش‌ها ---------------------------------- */

interface Dept {
  children?: Dept[];
  createTime: string;
  id: string;
  name: string;
  pid: number | string;
  remark: string;
  status: number;
}

const deptNames = ['دفتر مرکزی', 'فناوری اطلاعات', 'منابع انسانی', 'مالی', 'بازاریابی', 'پشتیبانی', 'فروش'];

function generateDepts(): Dept[] {
  return deptNames.slice(0, 4).map((name, i) => {
    const id = `${i + 1}`;
    const children = deptNames.slice(4).map((child, j) => ({
      createTime: formatter(faker.date.past()),
      id: `${id}${j + 1}`,
      name: `${child} ${name}`,
      pid: id,
      remark: faker.lorem.sentence(),
      status: faker.helpers.arrayElement([0, 1]),
    }));
    return {
      children,
      createTime: formatter(faker.date.past()),
      id,
      name,
      pid: 0,
      remark: faker.lorem.sentence(),
      status: 1,
    };
  });
}

let depts = generateDepts();

function walkDepts(list: Dept[], fn: (item: Dept, siblings: Dept[], index: number) => boolean | void): boolean {
  for (let i = 0; i < list.length; i++) {
    const item = list[i] as Dept;
    if (fn(item, list, i)) return true;
    if (item.children && walkDepts(item.children, fn)) return true;
  }
  return false;
}

system.get('/system/dept/list', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(300);
  return c.json(useResponseSuccess(depts));
});

system.post('/system/dept', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const body = await c.req.json();
  const item: Dept = { ...body, createTime: formatter(new Date()), id: faker.string.numeric(6) };
  if (!body.pid) depts.push({ ...item, pid: 0 });
  else walkDepts(depts, (d) => (d.id === body.pid ? ((d.children ??= []).push(item), true) : false));
  return c.json(useResponseSuccess(item));
});

system.put('/system/dept/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const id = c.req.param('id');
  const body = await c.req.json();
  walkDepts(depts, (d) => (d.id === id ? (Object.assign(d, body), true) : false));
  return c.json(useResponseSuccess(null));
});

system.delete('/system/dept/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const id = c.req.param('id');
  walkDepts(depts, (d, siblings, index) => (d.id === id ? (siblings.splice(index, 1), true) : false));
  return c.json(useResponseSuccess(null));
});

/* ---------------------------------- نقش‌ها ---------------------------------- */

const menuIds = getMenuIds(MOCK_MENU_LIST);

const roles = Array.from({ length: 50 }, (_, i) => ({
  createTime: formatter(faker.date.between({ from: '2022-01-01', to: '2025-01-01' })),
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement(['مدیر', 'ویرایشگر', 'بازبین', 'کاربر', 'مهمان', 'پشتیبان']) + ` ${i + 1}`,
  permissions: faker.helpers.arrayElements(menuIds),
  remark: faker.lorem.sentence(),
  status: faker.helpers.arrayElement([0, 1]),
}));

system.get('/system/role/list', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(400);
  const { endTime, id, name, page, pageSize, remark, startTime, status } = c.req.query();
  let list = structuredClone(roles);
  if (name) list = list.filter((item) => item.name.includes(name));
  if (id) list = list.filter((item) => item.id.includes(id));
  if (remark) list = list.filter((item) => item.remark?.includes(remark));
  if (startTime) list = list.filter((item) => item.createTime >= startTime);
  if (endTime) list = list.filter((item) => item.createTime <= endTime);
  if (['0', '1'].includes(status ?? '')) list = list.filter((item) => item.status === Number(status));
  return c.json(usePageResponseSuccess(queryInt(page, 1), queryInt(pageSize, 20), list));
});

system.post('/system/role', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const body = await c.req.json();
  const item = { ...body, createTime: formatter(new Date()), id: faker.string.uuid() };
  roles.unshift(item);
  return c.json(useResponseSuccess(item));
});

system.put('/system/role/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const id = c.req.param('id');
  const body = await c.req.json();
  const role = roles.find((r) => r.id === id);
  if (role) Object.assign(role, body);
  return c.json(useResponseSuccess(null));
});

system.delete('/system/role/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const index = roles.findIndex((r) => r.id === c.req.param('id'));
  if (index !== -1) roles.splice(index, 1);
  return c.json(useResponseSuccess(null));
});

/* ---------------------------------- کاربران ---------------------------------- */

const allDeptIds: string[] = [];
walkDepts(depts, (d) => void allDeptIds.push(d.id));

const users = Array.from({ length: 100 }, () => {
  const sex = faker.helpers.arrayElement(['female', 'male'] as const);
  return {
    createTime: formatter(faker.date.between({ from: '2022-01-01', to: '2025-01-01' })),
    deptId: faker.helpers.arrayElement(allDeptIds),
    email: faker.internet.email({ provider: 'example.com' }),
    gender: sex === 'female' ? 2 : 1,
    id: faker.string.uuid(),
    mobile: `09${faker.string.numeric(9)}`,
    remark: faker.lorem.sentence(),
    status: faker.helpers.arrayElement([0, 1]),
    userName: faker.person.fullName({ sex }),
  };
});

system.get('/system/user/list', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(300);
  const { deptId, gender, page, pageSize, status, userName } = c.req.query();
  let list = structuredClone(users);
  if (userName) list = list.filter((item) => item.userName.includes(userName));
  if (deptId) {
    const ids = new Set<string>([deptId]);
    walkDepts(depts, (d) => {
      if (ids.has(String(d.pid))) ids.add(d.id);
    });
    list = list.filter((item) => ids.has(item.deptId));
  }
  if (['0', '1'].includes(status ?? '')) list = list.filter((item) => item.status === Number(status));
  if (['1', '2'].includes(gender ?? '')) list = list.filter((item) => item.gender === Number(gender));
  return c.json(usePageResponseSuccess(queryInt(page, 1), queryInt(pageSize, 20), list));
});

system.post('/system/user', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const body = await c.req.json();
  const item = { ...body, createTime: formatter(new Date()), id: faker.string.uuid() };
  users.unshift(item);
  return c.json(useResponseSuccess(item));
});

system.put('/system/user/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const user = users.find((u) => u.id === c.req.param('id'));
  if (user) Object.assign(user, await c.req.json());
  return c.json(useResponseSuccess(null));
});

system.delete('/system/user/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const index = users.findIndex((u) => u.id === c.req.param('id'));
  if (index !== -1) users.splice(index, 1);
  return c.json(useResponseSuccess(null));
});

/* ----------------------------------- منوها ----------------------------------- */

const menuList = structuredClone(MOCK_MENU_LIST);

function flattenMenus(list: any[]): any[] {
  return list.flatMap((item) => [item, ...flattenMenus(item.children ?? [])]);
}

system.get('/system/menu/list', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(200);
  return c.json(useResponseSuccess(menuList));
});

system.get('/system/menu/name-exists', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const { id, name } = c.req.query();
  const exists = flattenMenus(menuList).some((item) => item.name === name && String(item.id) !== String(id));
  return c.json(useResponseSuccess(exists));
});

system.get('/system/menu/path-exists', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const { id, path } = c.req.query();
  const exists = flattenMenus(menuList).some((item) => item.path === path && String(item.id) !== String(id));
  return c.json(useResponseSuccess(exists));
});

system.post('/system/menu', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const body = await c.req.json();
  const item = { ...body, id: Number(faker.string.numeric(5)) };
  if (body.pid) {
    const parent = flattenMenus(menuList).find((m) => m.id === body.pid);
    if (parent) (parent.children ??= []).push(item);
  } else {
    menuList.push(item);
  }
  return c.json(useResponseSuccess(item));
});

system.put('/system/menu/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const menu = flattenMenus(menuList).find((m) => String(m.id) === c.req.param('id'));
  if (menu) Object.assign(menu, await c.req.json());
  return c.json(useResponseSuccess(null));
});

system.delete('/system/menu/:id', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  const id = c.req.param('id');
  const remove = (list: any[]): boolean => {
    const index = list.findIndex((m) => String(m.id) === id);
    if (index !== -1) {
      list.splice(index, 1);
      return true;
    }
    return list.some((m) => m.children && remove(m.children));
  };
  if (!remove(menuList)) return c.json(useResponseError('منو یافت نشد'), 404);
  return c.json(useResponseSuccess(null));
});

/** برای بازنشانی داده‌ها در توسعه */
export function resetSystemData() {
  depts = generateDepts();
}

export { system };
