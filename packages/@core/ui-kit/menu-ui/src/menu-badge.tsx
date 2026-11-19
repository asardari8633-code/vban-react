import type { MenuRecordBadgeRaw } from '@vben-core/typings';

import { cn } from '@vben-core/shared';

const variantClass: Record<string, string> = {
  default: 'bg-muted-foreground text-white',
  destructive: 'bg-destructive text-destructive-foreground',
  primary: 'bg-primary text-primary-foreground',
  success: 'bg-success text-success-foreground',
  warning: 'bg-warning text-warning-foreground',
};

interface MenuBadgeProps extends MenuRecordBadgeRaw {
  className?: string;
}

/**
 * نشان منو (نقطه یا متن)
 */
function MenuBadge({ badge, badgeType, badgeVariants = 'destructive', className }: MenuBadgeProps) {
  if (!badge && badgeType !== 'dot') return null;
  const color = variantClass[badgeVariants];
  const style = color ? undefined : { backgroundColor: badgeVariants };
  if (badgeType === 'dot') {
    return (
      <span className={cn('vben-menu-badge relative ms-1 inline-flex size-1.5 shrink-0', className)}>
        <span className={cn('absolute inline-flex size-full animate-ping rounded-full opacity-75', color)} style={style} />
        <span className={cn('relative inline-flex size-1.5 rounded-full', color)} style={style} />
      </span>
    );
  }
  return (
    <span
      className={cn('vben-menu-badge ms-1 inline-flex h-4 shrink-0 items-center rounded-full px-1.5 text-[10px] leading-none', color, className)}
      style={style}
    >
      {badge}
    </span>
  );
}

export { MenuBadge };
