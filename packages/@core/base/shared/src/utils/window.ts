interface OpenWindowOptions {
  noopener?: boolean;
  noreferrer?: boolean;
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
}

/**
 * باز کردن آدرس در پنجره‌ی جدید
 */
function openWindow(url: string, options: OpenWindowOptions = {}): void {
  const { noopener = true, noreferrer = true, target = '_blank' } = options;
  const features = [noopener && 'noopener=yes', noreferrer && 'noreferrer=yes']
    .filter(Boolean)
    .join(',');
  window.open(url, target, features);
}

/**
 * باز کردن مسیر داخلی (با در نظر گرفتن base و hash router)
 */
function openRouteInNewWindow(path: string) {
  const { hash, origin } = location;
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${origin}${hash && hash.startsWith('#') ? '/#' : ''}${fullPath}`;
  openWindow(url, { target: '_blank' });
}

export { openRouteInNewWindow, openWindow };
export type { OpenWindowOptions };
