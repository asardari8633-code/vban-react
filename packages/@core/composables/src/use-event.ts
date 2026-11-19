import type { RefObject } from 'react';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * همیشه آخرین مقدار را در ref نگه می‌دارد
 */
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

/**
 * تابعی با مرجع ثابت که همیشه آخرین نسخه‌ی fn را صدا می‌زند
 */
function useMemoizedFn<T extends (...args: any[]) => any>(fn: T): T {
  const fnRef = useLatest(fn);
  return useCallback(((...args: any[]) => fnRef.current(...args)) as T, []);
}

type Target = Document | HTMLElement | null | RefObject<HTMLElement | null> | Window;

function resolveTarget(target: Target | undefined) {
  if (!target) return null;
  if ('current' in (target as any)) return (target as RefObject<HTMLElement | null>).current;
  return target as Document | HTMLElement | Window;
}

/**
 * افزودن شنونده‌ی رویداد با پاکسازی خودکار
 */
function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (e: WindowEventMap[K]) => void,
  target?: Target,
  options?: AddEventListenerOptions | boolean,
) {
  const handlerRef = useLatest(handler);
  useEffect(() => {
    const el = target === undefined ? window : resolveTarget(target);
    if (!el) return;
    const listener = (e: Event) => handlerRef.current(e as WindowEventMap[K]);
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, target]);
}

/**
 * media query
 */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** نقاط شکست tailwind */
const breakpointsTailwind = {
  '2xl': 1536,
  lg: 1024,
  md: 768,
  sm: 640,
  xl: 1280,
};

/**
 * آیا عرض صفحه کوچک‌تر از md است (موبایل)
 */
function useIsMobile() {
  return useMediaQuery(`(max-width: ${breakpointsTailwind.md - 0.02}px)`);
}

/**
 * اندازه‌ی یک عنصر با ResizeObserver
 */
function useElementSize<T extends HTMLElement>(ref: RefObject<null | T>) {
  const [size, setSize] = useState({ height: 0, width: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { height, width } = entry.contentRect;
      setSize({ height, width });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/**
 * اجرای تابع در هر بازه‌ی زمانی
 */
function useInterval(fn: () => void, delay: null | number) {
  const fnRef = useLatest(fn);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => fnRef.current(), delay);
    return () => clearInterval(id);
  }, [delay, fnRef]);
}

/**
 * مقدار قبلی
 */
function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export {
  breakpointsTailwind,
  useElementSize,
  useEventListener,
  useInterval,
  useIsMobile,
  useLatest,
  useMediaQuery,
  useMemoizedFn,
  usePrevious,
};
