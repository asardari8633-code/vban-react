import type { CSSProperties, MouseEvent, ReactNode } from 'react';

import { Tooltip } from 'antd';

import { cn } from '@vben-core/shared';

interface VbenIconButtonProps {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
  /** متن راهنما */
  tooltip?: ReactNode;
  tooltipPlacement?: 'bottom' | 'left' | 'right' | 'top';
}

/**
 * دکمه‌ی آیکونی کوچک (مثل ابزارک‌های سربرگ)
 */
function VbenIconButton({
  children,
  className,
  disabled,
  onClick,
  style,
  tooltip,
  tooltipPlacement = 'bottom',
}: VbenIconButtonProps) {
  const button = (
    <button
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-[1.05rem] text-foreground/80 transition-colors outline-none hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      style={style}
      type="button"
    >
      {children}
    </button>
  );
  if (!tooltip) return button;
  return (
    <Tooltip mouseEnterDelay={0.3} placement={tooltipPlacement} title={tooltip}>
      {button}
    </Tooltip>
  );
}

export { VbenIconButton };
export type { VbenIconButtonProps };
