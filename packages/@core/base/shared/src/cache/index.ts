interface StorageItem<T> {
  expiry?: number;
  value: T;
}

interface StorageManagerOptions {
  /** پیشوند کلیدها (برای جداسازی برنامه‌ها) */
  prefix?: string;
  storageType?: 'localStorage' | 'sessionStorage';
}

/**
 * مدیریت ذخیره‌سازی با پیشوند و انقضا
 */
class StorageManager {
  private prefix: string;
  private storage: Storage;

  constructor({ prefix = '', storageType = 'localStorage' }: StorageManagerOptions = {}) {
    this.prefix = prefix;
    this.storage =
      storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => this.storage.removeItem(key));
  }

  clearExpiredItems(): void {
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        const shortKey = key.replace(this.prefix, '');
        this.getItem(shortKey);
      }
    }
  }

  getItem<T>(key: string, defaultValue: null | T = null): null | T {
    const fullKey = this.getFullKey(key);
    const itemStr = this.storage.getItem(fullKey);
    if (!itemStr) return defaultValue;
    try {
      const item: StorageItem<T> = JSON.parse(itemStr);
      if (item.expiry && Date.now() > item.expiry) {
        this.storage.removeItem(fullKey);
        return defaultValue;
      }
      return item.value;
    } catch {
      this.storage.removeItem(fullKey);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    this.storage.removeItem(this.getFullKey(key));
  }

  setItem<T>(key: string, value: T, ttl?: number): void {
    const item: StorageItem<T> = {
      expiry: ttl ? Date.now() + ttl : undefined,
      value,
    };
    try {
      this.storage.setItem(this.getFullKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  private getFullKey(key: string): string {
    return `${this.prefix}-${key}`;
  }
}

export { StorageManager };
export type { StorageManagerOptions };
