import type { RefObject } from 'react';

import { useCallback, useEffect, useState } from 'react';

/**
 * حالت تمام‌صفحه (Fullscreen API)
 */
function useFullscreen(target?: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(
    () => typeof document !== 'undefined' && !!document.fullscreenElement,
  );

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const enter = useCallback(async () => {
    const el = target?.current ?? document.documentElement;
    if (!document.fullscreenElement) await el.requestFullscreen?.();
  }, [target]);

  const exit = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen?.();
  }, []);

  const toggle = useCallback(async () => {
    await (document.fullscreenElement ? exit() : enter());
  }, [enter, exit]);

  return {
    enter,
    exit,
    isFullscreen,
    isSupported: typeof document !== 'undefined' && !!document.fullscreenEnabled,
    toggle,
  };
}

export { useFullscreen };
