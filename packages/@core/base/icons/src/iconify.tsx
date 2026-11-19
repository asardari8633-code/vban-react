import type { CSSProperties, ComponentType } from 'react';

import { Icon } from '@iconify/react';

interface IconifyIconProps {
  className?: string;
  /** نام آیکون iconify، مثل `lucide:user` */
  icon: string;
  size?: number | string;
  style?: CSSProperties;
}

/**
 * آیکون iconify (به‌صورت آنلاین از API آیکون‌ها بارگذاری می‌شود)
 */
function IconifyIcon({ className, icon, size, style }: IconifyIconProps) {
  return (
    <Icon
      className={className}
      height={size ?? '1em'}
      icon={icon}
      style={style}
      width={size ?? '1em'}
    />
  );
}

/**
 * ساخت کامپوننت آیکون از نام iconify
 */
function createIconifyIcon(icon: string): ComponentType<Omit<IconifyIconProps, 'icon'>> {
  const Comp = (props: Omit<IconifyIconProps, 'icon'>) => (
    <IconifyIcon icon={icon} {...props} />
  );
  Comp.displayName = `Icon(${icon})`;
  return Comp;
}

export { createIconifyIcon, IconifyIcon };
export type { IconifyIconProps };
