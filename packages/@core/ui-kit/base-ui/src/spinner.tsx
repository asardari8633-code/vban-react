import type { ReactNode } from 'react';

import { Spin } from 'antd';

import { cn } from '@vben-core/shared';

interface VbenSpinnerProps {
  className?: string;
  /** تأخیر نمایش (میلی‌ثانیه) */
  minLoadingTime?: number;
  spinning?: boolean;
  text?: ReactNode;
}

/**
 * لودینگ تمام‌کانتینر
 */
function VbenSpinner({ className, spinning = true, text }: VbenSpinnerProps) {
  if (!spinning) return null;
  return (
    <div
      className={cn(
        'absolute inset-0 z-100 flex flex-col items-center justify-center gap-3 bg-overlay-content backdrop-blur-[1px]',
        className,
      )}
    >
      <Spin size="large" />
      {text && <div className="text-sm text-muted-foreground">{text}</div>}
    </div>
  );
}

/**
 * لودینگ تمام‌صفحه (برای Suspense سطح بالا)
 */
function VbenFullScreenLoading({ text }: { text?: ReactNode }) {
  return (
    <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3">
      <Spin size="large" />
      {text && <div className="text-sm text-muted-foreground">{text}</div>}
    </div>
  );
}

export { VbenFullScreenLoading, VbenSpinner };
export type { VbenSpinnerProps };
