import type { ComponentType, CSSProperties } from 'react';

import { isValidElementType } from './utils';
import { IconifyIcon } from './iconify';

interface VbenIconProps {
  className?: string;
  /** کامپوننت آیکون، نام iconify یا آدرس تصویر */
  icon?: ComponentType<any> | string;
  /** اگر آیکون نداشت چیزی رندر شود؟ */
  fallback?: boolean;
  size?: number | string;
  style?: CSSProperties;
}

function isHttpOrDataUrl(value: string) {
  return /^(https?:)?\/\//.test(value) || value.startsWith('data:') || value.startsWith('/');
}

/**
 * آیکون عمومی: کامپوننت React، نام iconify یا آدرس تصویر را پشتیبانی می‌کند
 */
function VbenIcon({ className, fallback, icon, size, style }: VbenIconProps) {
  if (!icon) {
    return fallback ? <span className={className} style={{ display: 'inline-block', width: size ?? '1em' }} /> : null;
  }
  if (typeof icon === 'string') {
    if (isHttpOrDataUrl(icon)) {
      return (
        <img
          alt=""
          className={className}
          src={icon}
          style={{ height: size ?? '1em', width: size ?? '1em', ...style }}
        />
      );
    }
    return <IconifyIcon className={className} icon={icon} size={size} style={style} />;
  }
  if (isValidElementType(icon)) {
    const Comp = icon;
    return <Comp className={className} size={size} style={{ fontSize: size, ...style }} />;
  }
  return null;
}

export { VbenIcon };
export type { VbenIconProps };
