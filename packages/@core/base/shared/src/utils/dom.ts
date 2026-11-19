/**
 * نوشتن مجموعه‌ای از متغیرهای CSS روی ریشه‌ی سند
 */
function updateCSSVariables(
  variables: Record<string, string>,
  id = '__vben-styles__',
): void {
  const styleElement =
    document.querySelector(`#${id}`) || document.createElement('style');
  styleElement.id = id;
  let cssText = ':root {';
  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      cssText += `${key}: ${variables[key]};`;
    }
  }
  cssText += '}';
  styleElement.textContent = cssText;
  if (!document.querySelector(`#${id}`)) {
    setTimeout(() => {
      document.head.append(styleElement);
    });
  }
}

/**
 * آیا جهت سند راست‌به‌چپ است
 */
function isRtl(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dir === 'rtl';
}

/**
 * مخفی کردن لودینگ سراسری صفحه‌ی index.html
 */
function unmountGlobalLoading() {
  const loadingElement = document.querySelector('#__app-loading__');
  if (loadingElement) {
    loadingElement.classList.add('hidden');
    const injectLoadingElements = document.querySelectorAll(
      '[data-app-loading^="inject"]',
    );
    loadingElement.addEventListener(
      'transitionend',
      () => {
        loadingElement.remove();
        injectLoadingElements.forEach((el) => el.remove());
      },
      { once: true },
    );
  }
}

/**
 * کپی متن در کلیپ‌بورد
 */
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    textarea.remove();
    return ok;
  }
}

/**
 * گرفتن عنصر container برای پاپ‌آپ‌ها
 */
function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.closest('form') ?? node?.parentNode ?? document.body) as HTMLElement;
}

export {
  copyToClipboard,
  getPopupContainer,
  isRtl,
  unmountGlobalLoading,
  updateCSSVariables,
};
