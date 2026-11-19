import { fakerFA as faker } from '@faker-js/faker';
import { Hono } from 'hono';

import { verifyAccessToken } from '../utils/jwt';
import { TIME_ZONE_OPTIONS } from '../utils/mock-data';
import {
  queryInt,
  sleep,
  unAuthorizedResponse,
  usePageResponseSuccess,
  useResponseError,
  useResponseSuccess,
} from '../utils/response';

const misc = new Hono();

/* --------------------------- جدول نمونه --------------------------- */

const tableData = Array.from({ length: 100 }, () => ({
  available: faker.datatype.boolean(),
  category: faker.commerce.department(),
  color: faker.color.human(),
  currency: 'IRR',
  description: faker.commerce.productDescription(),
  id: faker.string.uuid(),
  imageUrl: faker.image.avatar(),
  inProduction: faker.datatype.boolean(),
  open: faker.datatype.boolean(),
  price: faker.commerce.price({ max: 5_000_000, min: 50_000 }),
  productName: faker.commerce.productName(),
  quantity: faker.number.int({ max: 100, min: 1 }),
  rating: faker.number.float({ fractionDigits: 1, max: 5, min: 1 }),
  releaseDate: faker.date.past().toISOString(),
  status: faker.helpers.arrayElement(['success', 'error', 'warning']),
  tags: Array.from({ length: 2 }, () => faker.commerce.productAdjective()),
  weight: faker.number.float({ fractionDigits: 2, max: 10, min: 0.1 }),
}));

misc.get('/table/list', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(500);
  const { page, pageSize, sortBy, sortOrder } = c.req.query();
  const list = structuredClone(tableData);
  if (sortBy && list[0] && sortBy in list[0]) {
    const desc = sortOrder === 'desc';
    list.sort((a: any, b: any) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      const an = Number(av);
      const bn = Number(bv);
      const result = Number.isFinite(an) && Number.isFinite(bn) ? an - bn : String(av).localeCompare(String(bv), 'fa');
      return desc ? -result : result;
    });
  }
  return c.json(
    usePageResponseSuccess(
      Math.max(1, queryInt(page, 1)),
      Math.min(100, Math.max(1, queryInt(pageSize, 10))),
      list,
    ),
  );
});

/* --------------------------- منطقه‌ی زمانی --------------------------- */

const userTimezones = new Map<string, string>();

misc.get('/timezone/getTimezoneOptions', (c) => c.json(useResponseSuccess(TIME_ZONE_OPTIONS)));

misc.get('/timezone/getTimezone', async (c) => {
  const user = await verifyAccessToken(c);
  if (!user) return unAuthorizedResponse(c);
  return c.json(useResponseSuccess(userTimezones.get(user.username) ?? null));
});

misc.post('/timezone/setTimezone', async (c) => {
  const user = await verifyAccessToken(c);
  if (!user) return unAuthorizedResponse(c);
  const { timezone } = await c.req.json();
  userTimezones.set(user.username, timezone);
  return c.json(useResponseSuccess({}));
});

/* --------------------------- آپلود و وضعیت --------------------------- */

misc.post('/upload', async (c) => {
  if (!(await verifyAccessToken(c))) return unAuthorizedResponse(c);
  await sleep(800);
  return c.json(
    useResponseSuccess({
      url: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    }),
  );
});

misc.get('/status', (c) => {
  const status = Number(c.req.query('status') ?? '200');
  if (status >= 400) {
    return c.json(useResponseError(`Status ${status}`, `Status ${status}`), status as any);
  }
  return c.json(useResponseSuccess({ status }), status as any);
});

misc.get('/test', (c) => c.text('Test get handler'));
misc.post('/test', (c) => c.text('Test post handler'));

export { misc };
