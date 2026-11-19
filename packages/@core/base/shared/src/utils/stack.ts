/**
 * پشته با امکان یکتا بودن عناصر و حداکثر اندازه (برای تاریخچه‌ی بازدید زبانه‌ها)
 */
class Stack<T> {
  items: T[] = [];
  private readonly dedup: boolean;
  private readonly maxSize: number;

  constructor(dedup = true, maxSize = Infinity, items: T[] = []) {
    this.dedup = dedup;
    this.maxSize = maxSize;
    this.push(...items);
  }

  get size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  push(...values: T[]) {
    for (const value of values) {
      if (this.dedup) this.items = this.items.filter((i) => i !== value);
      this.items.push(value);
    }
    while (this.items.length > this.maxSize) this.items.shift();
  }

  remove(...values: T[]) {
    this.items = this.items.filter((i) => !values.includes(i));
  }

  retain(values: T[]) {
    this.items = this.items.filter((i) => values.includes(i));
  }

  toArray() {
    return [...this.items];
  }
}

function createStack<T>(dedup = true, maxSize = Infinity, items: T[] = []) {
  return new Stack<T>(dedup, maxSize, items);
}

export { createStack, Stack };
