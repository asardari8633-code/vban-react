import type { Context } from 'hono';

export function useResponseSuccess<T = any>(data: T) {
  return { code: 0, data, error: null, message: 'ok' };
}

export function useResponseError(message: string, error: any = null) {
  return { code: -1, data: null, error, message };
}

export function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * pageSize;
  return offset + pageSize >= array.length
    ? array.slice(offset)
    : array.slice(offset, offset + pageSize);
}

export function usePageResponseSuccess<T = any>(
  page: number | string,
  pageSize: number | string,
  list: T[],
  { message = 'ok' } = {},
) {
  const pageData = pagination(Number.parseInt(`${page}`), Number.parseInt(`${pageSize}`), list);
  return { ...useResponseSuccess({ items: pageData, total: list.length }), message };
}

export function forbiddenResponse(c: Context, message = 'Forbidden Exception') {
  return c.json(useResponseError(message, message), 403);
}

export function unAuthorizedResponse(c: Context) {
  return c.json(useResponseError('Unauthorized Exception', 'Unauthorized Exception'), 401);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function queryInt(value: string | undefined, fallback: number) {
  const n = Number.parseInt(value ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
}
