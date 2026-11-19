import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@vben-core/shared';

interface PageProps {
  /** ارتفاع محتوا برابر ارتفاع ناحیه‌ی قابل مشاهده */
  autoContentHeight?: boolean;
  children?: ReactNode;
  className?: string;
  contentClass?: string;
  description?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  footerClass?: string;
  headerClass?: string;
  style?: CSSProperties;
  title?: ReactNode;
}

/**
 * کانتینر استاندارد صفحه با سربرگ (عنوان/توضیح)، محتوا و پاورقی
 */
function Page({
  autoContentHeight = false,
  children,
  className,
  contentClass,
  description,
  extra,
  footer,
  footerClass,
  headerClass,
  style,
  title,
}: PageProps) {
  const showHeader = !!(title || description || extra);
  return (
    <div className={cn('relative flex min-h-full flex-col', className)} style={style}>
      {showHeader && (
        <div className={cn('relative flex items-end border-b border-border bg-card px-6 py-4', headerClass)}>
          <div className="flex-auto">
            {title && <div className="mb-2 flex text-lg font-semibold">{title}</div>}
            {description && <p className="mb-0 text-sm text-muted-foreground">{description}</p>}
          </div>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div
        className={cn('h-full p-4', contentClass)}
        style={
          autoContentHeight
            ? { height: 'calc(var(--vben-content-height, 100%) - 0px)', overflowY: 'auto' }
            : undefined
        }
      >
        {children}
      </div>
      {footer && (
        <div className={cn('align-center flex border-t border-border bg-card px-6 py-4', footerClass)}>
          {footer}
        </div>
      )}
    </div>
  );
}

export { Page };
export type { PageProps };
