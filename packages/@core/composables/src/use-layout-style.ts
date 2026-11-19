import { useEffect } from 'react';

import {
  CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT,
  CSS_VARIABLE_LAYOUT_HEADER_HEIGHT,
} from '@vben-core/shared';

function setRootVar(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

/**
 * تنظیم ارتفاع header چیدمان در متغیر CSS
 */
function useLayoutHeaderHeight(height: number) {
  useEffect(() => {
    setRootVar(CSS_VARIABLE_LAYOUT_HEADER_HEIGHT, `${height}px`);
  }, [height]);
}

/**
 * تنظیم ارتفاع footer چیدمان در متغیر CSS
 */
function useLayoutFooterHeight(height: number) {
  useEffect(() => {
    setRootVar(CSS_VARIABLE_LAYOUT_FOOTER_HEIGHT, `${height}px`);
  }, [height]);
}

/**
 * قفل اسکرول body
 */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

export { useLayoutFooterHeight, useLayoutHeaderHeight, useScrollLock };
