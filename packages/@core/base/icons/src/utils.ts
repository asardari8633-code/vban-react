import type { ComponentType } from 'react';

/**
 * آیا مقدار یک نوع قابل رندر React است (تابع، کلاس، memo/forwardRef/lazy)
 */
export function isValidElementType(value: unknown): value is ComponentType<any> {
  if (typeof value === 'function') return true;
  if (value && typeof value === 'object' && '$$typeof' in (value as any)) return true;
  return false;
}
