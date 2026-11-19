import type { CSSProperties } from 'react';

import type { ECOption } from './echarts';

import { useEffect, useImperativeHandle, useRef } from 'react';

import { usePreferences } from '@vben/preferences';

import echarts from './echarts';

interface EchartsUIHandle {
  getInstance: () => echarts.ECharts | null;
  renderEcharts: (options: ECOption, clear?: boolean) => void;
  resize: () => void;
}

interface EchartsUIProps {
  className?: string;
  height?: number | string;
  /** گزینه‌های نمودار؛ با تغییر دوباره رندر می‌شود */
  options?: ECOption;
  ref?: React.Ref<EchartsUIHandle>;
  style?: CSSProperties;
  width?: number | string;
}

/**
 * نمودار ECharts با تغییر اندازه‌ی خودکار و هماهنگی با تم تیره/روشن
 */
function EchartsUI({ className, height = '300px', options, ref, style, width = '100%' }: EchartsUIProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);
  const lastOptions = useRef<ECOption | undefined>(options);
  const { isDark } = usePreferences();

  function render(opts?: ECOption, clear = true) {
    const el = elRef.current;
    if (!el || !opts) return;
    lastOptions.current = opts;
    if (!chartRef.current) {
      chartRef.current = echarts.init(el, isDark ? 'dark' : null);
    }
    if (clear) chartRef.current.clear();
    chartRef.current.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'inherit' },
      ...opts,
    } as ECOption);
  }

  useImperativeHandle(ref, () => ({
    getInstance: () => chartRef.current,
    renderEcharts: (opts, clear) => render(opts, clear),
    resize: () => chartRef.current?.resize(),
  }));

  // تغییر تم: نمونه دوباره ساخته می‌شود
  useEffect(() => {
    chartRef.current?.dispose();
    chartRef.current = null;
    render(lastOptions.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  useEffect(() => {
    if (options) render(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => chartRef.current?.resize({ animation: { duration: 300 } }));
    observer.observe(el);
    return () => {
      observer.disconnect();
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, []);

  return <div className={className} ref={elRef} style={{ height, width, ...style }} />;
}

export { EchartsUI };
export type { EchartsUIHandle, EchartsUIProps };
