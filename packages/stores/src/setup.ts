import type { StateStorage } from 'zustand/middleware';

let namespace = 'vben';

const hydrators = new Set<() => Promise<void> | void>();
const resetters = new Set<() => void>();

/**
 * ثبت تابع بازنشانی یک store (برای resetAllStores)
 */
function registerStoreReset(reset: () => void) {
  resetters.add(reset);
}

/**
 * ثبت تابع rehydrate یک store ماندگار
 */
function registerStoreHydrate(hydrate: () => Promise<void> | void) {
  hydrators.add(hydrate);
}

/**
 * ساخت storage با پیشوند فضای نام برنامه
 */
function createNamespacedStorage(storage: () => Storage): StateStorage {
  return {
    getItem: (name) => storage().getItem(`${namespace}-${name}`),
    removeItem: (name) => storage().removeItem(`${namespace}-${name}`),
    setItem: (name, value) => storage().setItem(`${namespace}-${name}`, value),
  };
}

interface InitStoreOptions {
  /** فضای نام ذخیره‌سازی (برای جداسازی برنامه‌ها/محیط‌ها) */
  namespace: string;
}

/**
 * مقداردهی storeها: تنظیم فضای نام و بازیابی وضعیت ذخیره‌شده
 */
async function initStores({ namespace: ns }: InitStoreOptions) {
  namespace = ns;
  for (const hydrate of hydrators) {
    await hydrate();
  }
}

/**
 * بازنشانی همه‌ی storeها (هنگام خروج)
 */
function resetAllStores() {
  resetters.forEach((reset) => reset());
}

export {
  createNamespacedStorage,
  initStores,
  registerStoreHydrate,
  registerStoreReset,
  resetAllStores,
};
export type { InitStoreOptions };
