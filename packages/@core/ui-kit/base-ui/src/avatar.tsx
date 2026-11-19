import type { CSSProperties } from 'react';

import { Avatar } from 'antd';

import { cn } from '@vben-core/shared';

interface VbenAvatarProps {
  alt?: string;
  className?: string;
  /** نقطه‌ی وضعیت */
  dot?: boolean;
  dotClass?: string;
  size?: number;
  src?: string;
  style?: CSSProperties;
}

function VbenAvatar({ alt = 'avatar', className, dot, dotClass, size = 32, src, style }: VbenAvatarProps) {
  return (
    <div className={cn('relative inline-flex shrink-0 items-center', className)} style={style}>
      <Avatar alt={alt} size={size} src={src}>
        {alt?.slice(0, 1)}
      </Avatar>
      {dot && (
        <span
          className={cn(
            'absolute end-0 bottom-0 size-2.5 rounded-full border-2 border-background bg-green-500',
            dotClass,
          )}
        />
      )}
    </div>
  );
}

export { VbenAvatar };
export type { VbenAvatarProps };
