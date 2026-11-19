import type { ReactNode } from 'react';

import { useAccess } from './use-access';

interface AccessControlProps {
  children?: ReactNode;
  /** کدها یا نقش‌های مجاز */
  codes?: string[];
  /** محتوای جایگزین در صورت نداشتن دسترسی */
  fallback?: ReactNode;
  /** نوع بررسی: role (نقش) یا code (کد دسترسی) */
  type?: 'code' | 'role';
}

/**
 * کنترل دسترسی در سطح کامپوننت (معادل AccessControl و دستور v-access در Vben)
 */
function AccessControl({ children, codes = [], fallback = null, type = 'role' }: AccessControlProps) {
  const { hasAccessByCodes, hasAccessByRoles } = useAccess();
  if (codes.length === 0) return <>{children}</>;
  const allowed = type === 'role' ? hasAccessByRoles(codes) : hasAccessByCodes(codes);
  return <>{allowed ? children : fallback}</>;
}

export { AccessControl };
export type { AccessControlProps };
