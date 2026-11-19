import type { PointerEvent as ReactPointerEvent } from 'react';

import { useRef, useState } from 'react';

import { $t } from '@vben/locales';
import { ChevronsRight, CircleCheckBig } from '@vben-core/icons';
import { cn, isRtl } from '@vben-core/shared';

interface SliderCaptchaProps {
  className?: string;
  onChange?: (value: boolean) => void;
  onSuccess?: (info: { time: number }) => void;
  successText?: string;
  text?: string;
  value?: boolean;
}

/**
 * کپچای اسلایدری: دستگیره را تا انتها بکشید
 */
function SliderCaptcha({ className, onChange, onSuccess, successText, text, value }: SliderCaptchaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ startTime: 0, x: 0 });
  const passed = !!value;
  const handleSize = 40;

  function maxOffset() {
    return (wrapperRef.current?.clientWidth ?? 0) - handleSize;
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (passed) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { startTime: Date.now(), x: e.clientX };
    setDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || passed) return;
    const delta = (e.clientX - startRef.current.x) * (isRtl() ? -1 : 1);
    setOffset(Math.max(0, Math.min(maxOffset(), delta)));
  }

  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    if (offset >= maxOffset() - 2) {
      setOffset(maxOffset());
      onChange?.(true);
      onSuccess?.({ time: (Date.now() - startRef.current.startTime) / 1000 });
    } else {
      setOffset(0);
    }
  }

  return (
    <div
      className={cn('relative h-10 w-full overflow-hidden rounded-md border border-border bg-background-deep text-center select-none', className)}
      ref={wrapperRef}
    >
      <div
        className={cn('absolute inset-y-0 start-0 bg-success/80', !dragging && 'transition-[width] duration-300')}
        style={{ width: passed ? '100%' : offset + handleSize / 2 }}
      />
      <div className={cn('relative z-1 flex h-full items-center justify-center text-sm', passed ? 'text-white' : 'text-muted-foreground')}>
        {passed
          ? (successText ?? $t('ui.captcha.sliderSuccessText'))
          : (text ?? $t('ui.captcha.sliderDefaultText'))}
      </div>
      <div
        className={cn(
          'absolute top-0 z-2 flex h-full cursor-grab items-center justify-center rounded-md border border-border bg-background shadow-sm active:cursor-grabbing',
          !dragging && 'transition-[inset-inline-start] duration-300',
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ insetInlineStart: passed ? `calc(100% - ${handleSize}px)` : offset, width: handleSize }}
      >
        {passed ? (
          <CircleCheckBig className="size-4 text-success" />
        ) : (
          <ChevronsRight className="size-4 text-muted-foreground rtl:rotate-180" />
        )}
      </div>
    </div>
  );
}

export { SliderCaptcha };
export type { SliderCaptchaProps };
