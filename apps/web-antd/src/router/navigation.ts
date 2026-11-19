import type { NavigateFunction, NavigateOptions } from 'react-router';

let navigateRef: NavigateFunction | null = null;

/**
 * ثبت تابع navigate روتر (از داخل درخت React)
 */
function setNavigate(navigate: NavigateFunction) {
  navigateRef = navigate;
}

/**
 * ناوبری خارج از کامپوننت‌ها (storeها، رهگیرها)
 */
function appNavigate(to: string, options?: NavigateOptions) {
  if (navigateRef) {
    void navigateRef(to, options);
  } else {
    window.location.href = to;
  }
}

function currentFullPath() {
  const { hash, pathname, search } = window.location;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) || '/' : pathname;
  return `${path}${search}${hash}`;
}

export { appNavigate, currentFullPath, setNavigate };
