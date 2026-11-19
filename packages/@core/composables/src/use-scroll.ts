import type { RefObject } from 'react';

import { useEffect, useRef, useState } from 'react';

interface ScrollState {
  arrivedBottom: boolean;
  arrivedTop: boolean;
  directionDown: boolean;
  directionUp: boolean;
  y: number;
}

/**
 * وضعیت اسکرول یک عنصر (معادل useScroll در vueuse)
 */
function useScroll(
  ref: RefObject<HTMLElement | null>,
  onScroll?: (state: ScrollState) => void,
) {
  const [state, setState] = useState<ScrollState>({
    arrivedBottom: false,
    arrivedTop: true,
    directionDown: false,
    directionUp: false,
    y: 0,
  });
  const lastY = useRef(0);
  const onScrollRef = useRef(onScroll);
  onScrollRef.current = onScroll;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      const y = el.scrollTop;
      const next: ScrollState = {
        arrivedBottom: el.scrollHeight - y - el.clientHeight <= 1,
        arrivedTop: y <= 0,
        directionDown: y > lastY.current,
        directionUp: y < lastY.current,
        y,
      };
      lastY.current = y;
      setState(next);
      onScrollRef.current?.(next);
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, [ref]);

  return state;
}

export { useScroll };
export type { ScrollState };
