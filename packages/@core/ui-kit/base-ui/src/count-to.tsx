import { useEffect, useRef, useState } from 'react';

interface VbenCountToAnimatorProps {
  className?: string;
  /** اعداد با ارقام فارسی نمایش داده شوند */
  localeDigits?: boolean;
  decimals?: number;
  /** مدت انیمیشن (ms) */
  duration?: number;
  endVal: number;
  prefix?: string;
  separator?: string;
  startVal?: number;
  suffix?: string;
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t);
}

/**
 * شمارنده‌ی متحرک عدد
 */
function VbenCountToAnimator({
  className,
  decimals = 0,
  duration = 1500,
  endVal,
  localeDigits = true,
  prefix = '',
  separator = ',',
  startVal = 0,
  suffix = '',
}: VbenCountToAnimatorProps) {
  const [value, setValue] = useState(startVal);
  const frame = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const from = startVal;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setValue(from + (endVal - from) * easeOutExpo(progress));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [duration, endVal, startVal]);

  const text = localeDigits
    ? new Intl.NumberFormat('fa-IR', {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
        useGrouping: !!separator,
      }).format(value)
    : value.toFixed(decimals).replaceAll(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

export { VbenCountToAnimator };
export type { VbenCountToAnimatorProps };
