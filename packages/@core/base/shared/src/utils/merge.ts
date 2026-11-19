import { isPlainObject } from './inference';

/**
 * ادغام عمیق با اولویت «اولین شیء»: مقادیر اشیای بعدی فقط جاهای خالی را پر می‌کنند
 * (معادل defu). آرایه‌ها با هم ادغام (concat) می‌شوند.
 */
function merge<T = any>(...sources: any[]): T {
  return mergeInternal(sources, false) as T;
}

/**
 * مانند merge ولی آرایه‌ها جایگزین می‌شوند (ادغام نمی‌شوند)
 */
function mergeWithArrayOverride<T = any>(...sources: any[]): T {
  return mergeInternal(sources, true) as T;
}

function mergeInternal(sources: any[], arrayOverride: boolean) {
  const result: Record<string, any> = {};
  // از آخر به اول: اشیای ابتدایی‌تر اولویت بیشتری دارند
  for (let i = sources.length - 1; i >= 0; i--) {
    const source = sources[i];
    if (!isPlainObject(source)) continue;
    for (const key of Object.keys(source)) {
      if (key === '__proto__' || key === 'constructor') continue;
      const value = source[key];
      if (value === undefined) continue;
      const current = result[key];
      if (isPlainObject(value) && isPlainObject(current)) {
        result[key] = mergeInternal([value, current], arrayOverride);
      } else if (Array.isArray(value) && Array.isArray(current)) {
        result[key] = arrayOverride ? [...value] : [...value, ...current];
      } else if (isPlainObject(value)) {
        result[key] = mergeInternal([value], arrayOverride);
      } else if (Array.isArray(value)) {
        result[key] = [...value];
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * کپی عمیق ساده (توابع و کامپوننت‌ها به‌صورت مرجع کپی می‌شوند)
 */
function cloneDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item)) as T;
  }
  if (isPlainObject(value)) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = cloneDeep(v);
    return out as T;
  }
  return value;
}

/**
 * مقایسه‌ی عمیق
 */
function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, i) => isEqual(item, b[i]));
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => isEqual(a[k], b[k]));
  }
  return false;
}

/**
 * تفاوت دو شیء: فقط کلیدهایی از `obj` که با `base` فرق دارند
 */
function diff<T extends Record<string, any>>(base: T, obj: T): Partial<T> | undefined {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const a = base?.[key];
    const b = obj[key];
    if (isPlainObject(a) && isPlainObject(b)) {
      const d = diff(a, b);
      if (d && Object.keys(d).length > 0) result[key] = d;
    } else if (!isEqual(a, b)) {
      result[key] = b;
    }
  }
  return Object.keys(result).length > 0 ? (result as Partial<T>) : undefined;
}

/**
 * دسترسی به مقدار تو در تو با مسیر نقطه‌ای: get(obj, 'a.b.c')
 */
function get<T = any>(obj: any, path: string, defaultValue?: T): T {
  const value = path
    .split('.')
    .reduce((acc: any, key) => (acc == null ? undefined : acc[key]), obj);
  return (value === undefined ? defaultValue : value) as T;
}

/**
 * تنظیم مقدار تو در تو با مسیر نقطه‌ای
 */
function set(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split('.');
  let cur = obj;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) {
      cur[key] = value;
    } else {
      if (!isPlainObject(cur[key])) cur[key] = {};
      cur = cur[key];
    }
  });
  return obj;
}

export { cloneDeep, diff, get, isEqual, merge, mergeWithArrayOverride, set };
