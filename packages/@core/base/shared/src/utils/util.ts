/**
 * تأخیر
 */
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * debounce ساده با امکان لغو
 */
function debounce<T extends (...args: any[]) => any>(fn: T, wait = 150) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };
  return debounced as typeof debounced & { cancel: () => void };
}

/**
 * throttle ساده
 */
function throttle<T extends (...args: any[]) => any>(fn: T, wait = 100) {
  let last = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - last);
    if (remaining <= 0) {
      last = now;
      fn(...args);
    } else if (!timer) {
      timer = setTimeout(() => {
        last = Date.now();
        timer = undefined;
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * تبدیل به رشته‌ی kebab-case
 */
function kebabCase(str: string) {
  return str
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * تبدیل به camelCase
 */
function camelCase(str: string) {
  return str.replaceAll(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * ساخت شناسه‌ی تصادفی کوتاه
 */
function uid(prefix = 'vben') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * ادغام کلاس‌ها (معادل clsx ساده)
 */
function cn(...inputs: Array<false | null | Record<string, any> | string | undefined>): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

/**
 * تبدیل ارقام لاتین به فارسی
 */
function toPersianDigits(value: number | string) {
  return String(value).replaceAll(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] as string);
}

/**
 * قالب‌بندی عدد با جداکننده‌ی هزارگان فارسی
 */
function formatNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('fa-IR', options).format(value);
}

export {
  camelCase,
  capitalizeFirstLetter,
  cn,
  debounce,
  formatNumber,
  kebabCase,
  sleep,
  throttle,
  toPersianDigits,
  uid,
};
