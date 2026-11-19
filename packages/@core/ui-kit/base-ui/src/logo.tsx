import type { ReactNode } from 'react';

import { cn } from '@vben-core/shared';

interface VbenLogoProps {
  className?: string;
  /** آیا جمع شده (فقط آیکون) */
  collapsed?: boolean;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fullLogoHeight?: number | string;
  href?: string;
  logoMode?: 'full' | 'icon';
  logoSize?: number;
  onClick?: () => void;
  showText?: boolean;
  src?: string;
  srcDark?: string;
  text?: ReactNode;
  theme?: 'dark' | 'light';
}

/**
 * لوگوی برنامه
 */
function VbenLogo({
  className,
  collapsed = false,
  fit = 'contain',
  fullLogoHeight,
  href = 'javascript:void 0',
  logoMode = 'icon',
  logoSize = 32,
  onClick,
  showText = true,
  src,
  srcDark,
  text,
  theme = 'light',
}: VbenLogoProps) {
  const logoSrc = theme === 'dark' && srcDark ? srcDark : src;
  const isFull = logoMode === 'full';

  return (
    <div className={cn('flex h-full items-center text-lg', theme, className)}>
      <a
        className="flex h-full w-full items-center gap-2 overflow-hidden px-3 text-lg leading-normal transition-all duration-500"
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {logoSrc && (
          <img
            alt="logo"
            className={cn('relative shrink-0 rounded-none bg-transparent', isFull && !collapsed && 'w-full')}
            src={logoSrc}
            style={{
              height: isFull && !collapsed ? (fullLogoHeight ?? logoSize) : logoSize,
              objectFit: fit,
              width: isFull && !collapsed ? 'auto' : logoSize,
            }}
          />
        )}
        {!collapsed && showText && !(isFull && logoSrc) && (
          <div className="truncate font-semibold text-foreground text-nowrap">{text}</div>
        )}
      </a>
    </div>
  );
}

export { VbenLogo };
export type { VbenLogoProps };
