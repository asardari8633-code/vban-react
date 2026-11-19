function isUndefined(value?: unknown): value is undefined {
  return value === undefined;
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

function isObject(value: unknown): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * شیء ساده (نه آرایه، نه کلاس). اشیای React (مثل lazy/memo/element که $$typeof دارند)
 * ساده محسوب نمی‌شوند تا در clone/merge دست‌نخورده بمانند.
 */
function isPlainObject(value: unknown): value is Record<string, any> {
  if (!isObject(value)) return false;
  if ('$$typeof' in value) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * بررسی خالی بودن مقدار (null/undefined، رشته/آرایه‌ی خالی، Map/Set/شیء خالی)
 */
function isEmpty<T = unknown>(value?: T): value is T {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value) || isString(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

/**
 * آیا رشته یک آدرس http(s) است
 */
function isHttpUrl(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\/.*$/.test(url);
}

function isWindow(value: any): value is Window {
  return (
    typeof window !== 'undefined' && value !== null && value === value.window
  );
}

function isMacOs(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /macintosh|mac os x/i.test(navigator.userAgent);
}

function isWindowsOs(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /windows|win32/i.test(navigator.userAgent);
}

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export {
  isBoolean,
  isDate,
  isEmpty,
  isFunction,
  isHttpUrl,
  isMacOs,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isUndefined,
  isWindow,
  isWindowsOs,
};
