import type { AxiosAdapter, AxiosResponse } from 'axios';

import { app } from '../../../backend-mock/src/app';

/**
 * آداپتور axios که درخواست‌ها را به‌جای شبکه، مستقیماً به سرور ماک (Hono)
 * که داخل مرورگر اجرا می‌شود می‌دهد؛ برای استقرار ایستا (GitHub Pages).
 */
const COOKIE_KEY = 'vben-mock-cookies';

function loadCookies(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(COOKIE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function applySetCookies(headers: Headers) {
  const list = headers.getSetCookie?.() ?? [];
  if (list.length === 0) return;
  const jar = loadCookies();
  for (const line of list) {
    const [pair = '', ...attrs] = line.split(';');
    const idx = pair.indexOf('=');
    const name = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    const expired = attrs.some((a) => /^\s*(max-age=0|expires=)/i.test(a) && (/max-age=0/i.test(a) || value === ''));
    if (expired || value === '') delete jar[name];
    else jar[name] = value;
  }
  try {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(jar));
  } catch {
    /* ignore */
  }
}

function buildUrl(config: Parameters<AxiosAdapter>[0]) {
  const base = (config.baseURL ?? '').replace(/\/$/, '');
  const path = config.url ?? '';
  const full = /^https?:/.test(path) ? path : `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  const url = new URL(full, window.location.origin);
  const params = config.params as Record<string, unknown> | undefined;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) v.forEach((i) => url.searchParams.append(k, String(i)));
      else url.searchParams.append(k, String(v));
    }
  }
  return url;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  const url = buildUrl(config);
  const headers = new Headers();
  for (const [k, v] of Object.entries(config.headers?.toJSON?.() ?? config.headers ?? {})) {
    if (v !== undefined && v !== null && typeof v !== 'object') headers.set(k, String(v));
  }
  const jar = loadCookies();
  const cookie = Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
  if (cookie) headers.set('Cookie', cookie);

  const method = (config.method ?? 'get').toUpperCase();
  let body: BodyInit | undefined;
  if (method !== 'GET' && method !== 'HEAD' && config.data !== undefined) {
    body = typeof config.data === 'string' ? config.data : JSON.stringify(config.data);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  }

  const res = await app.fetch(new Request(url.toString(), { body, headers, method }));
  applySetCookies(res.headers);

  const text = await res.text();
  let data: unknown = text;
  if ((res.headers.get('content-type') ?? '').includes('json')) {
    try {
      data = JSON.parse(text);
    } catch {
      /* keep text */
    }
  }
  const response: AxiosResponse = {
    config,
    data,
    headers: Object.fromEntries(res.headers.entries()),
    request: {},
    status: res.status,
    statusText: res.statusText,
  };
  const ok = config.validateStatus ? config.validateStatus(res.status) : res.status >= 200 && res.status < 300;
  if (ok) return response;
  const { AxiosError } = await import('axios');
  throw new AxiosError(
    `Request failed with status code ${res.status}`,
    res.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    config,
    response.request,
    response,
  );
};
