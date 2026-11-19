import type { CSSProperties, ReactNode, Ref, UIEvent } from 'react';

import { useState } from 'react';

import { cn } from '@vben-core/shared';

interface VbenScrollbarProps {
  children?: ReactNode;
  className?: string;
  /** جهت اسکرول */
  horizontal?: boolean;
  onScroll?: (e: UIEvent<HTMLDivElement>) => void;
  ref?: Ref<HTMLDivElement>;
  /** سایه‌ی بالا/پایین هنگام اسکرول */
  shadow?: boolean;
  /** خط مرزی در سایه */
  shadowBorder?: boolean;
  style?: CSSProperties;
}

/**
 * ناحیه‌ی اسکرول با نوار اسکرول ظریف و سایه‌ی اختیاری
 */
function VbenScrollbar({
  children,
  className,
  horizontal,
  onScroll,
  ref,
  shadow,
  shadowBorder,
  style,
}: VbenScrollbarProps) {
  const [state, setState] = useState({ bottom: false, top: true });

  return (
    <div className={cn('relative', className)} style={style}>
      <div
        className={cn(
          'vben-scrollbar size-full',
          horizontal ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden',
        )}
        onScroll={(e) => {
          const el = e.currentTarget;
          if (shadow) {
            setState({
              bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
              top: el.scrollTop <= 0,
            });
          }
          onScroll?.(e);
        }}
        ref={ref}
      >
        {children}
      </div>
      {shadow && !state.top && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-10 h-3 bg-linear-to-b from-[hsl(var(--scroll-shadow,var(--background)))] to-transparent',
            shadowBorder && 'border-t border-border',
          )}
        />
      )}
      {shadow && state.bottom && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-3 bg-linear-to-t from-[hsl(var(--scroll-shadow,var(--background)))] to-transparent',
            shadowBorder && 'border-b border-border',
          )}
        />
      )}
    </div>
  );
}

export { VbenScrollbar };
export type { VbenScrollbarProps };
