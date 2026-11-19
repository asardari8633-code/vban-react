import { useState } from 'react';

import { Avatar, Badge, Button, Empty, Popover } from 'antd';

import { Bell, CircleCheckBig, MailCheck, Trash2 } from '@vben/icons';
import { $t } from '@vben/locales';
import { VbenIconButton } from '@vben-core/base-ui';
import { cn } from '@vben-core/shared';

interface NotificationItem {
  avatar: string;
  date: string;
  id: number | string;
  isRead?: boolean;
  link?: string;
  message: string;
  query?: Record<string, any>;
  title: string;
}

interface NotificationProps {
  dot?: boolean;
  notifications: NotificationItem[];
  onClear?: () => void;
  onClick?: (item: NotificationItem) => void;
  onMakeAll?: () => void;
  onRead?: (item: NotificationItem) => void;
  onRemove?: (item: NotificationItem) => void;
  onViewAll?: () => void;
}

/**
 * اعلان‌های سربرگ
 */
function Notification({
  dot,
  notifications,
  onClear,
  onClick,
  onMakeAll,
  onRead,
  onRemove,
  onViewAll,
}: NotificationProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="w-[340px] max-w-[90vw]">
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="font-medium text-foreground">{$t('ui.widgets.notifications')}</div>
        <VbenIconButton disabled={notifications.length === 0} onClick={onMakeAll} tooltip={$t('ui.widgets.markAllAsRead')}>
          <MailCheck className="size-4" />
        </VbenIconButton>
      </div>
      {notifications.length > 0 ? (
        <ul className="vben-scrollbar m-0 flex max-h-[360px] list-none flex-col overflow-y-auto p-0">
          {notifications.map((item) => (
            <li
              className="group relative flex cursor-pointer gap-3 rounded-md border-b border-border px-2 py-3 last:border-none hover:bg-accent"
              key={item.id}
              onClick={() => {
                onRead?.(item);
                onClick?.(item);
              }}
            >
              {!item.isRead && <span className="absolute end-2 top-2 size-2 rounded-full bg-primary" />}
              <Avatar size={36} src={item.avatar} />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="m-0 truncate text-sm font-semibold">{item.title}</p>
                <p className="m-0 line-clamp-2 text-xs text-muted-foreground">{item.message}</p>
                <p className="m-0 text-xs text-muted-foreground">{item.date}</p>
              </div>
              <div className="invisible absolute end-2 top-1/2 flex -translate-y-1/2 flex-col gap-1 group-hover:visible">
                {!item.isRead && (
                  <VbenIconButton
                    className="size-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRead?.(item);
                    }}
                    tooltip="خوانده شد"
                  >
                    <CircleCheckBig className="size-3.5" />
                  </VbenIconButton>
                )}
                <VbenIconButton
                  className="size-6 text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(item);
                  }}
                  tooltip={$t('common.delete')}
                >
                  <Trash2 className="size-3.5" />
                </VbenIconButton>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="py-6" description={$t('common.noData')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      <div className="flex items-center justify-between border-t border-border pt-2">
        <Button disabled={notifications.length === 0} onClick={onClear} size="small" type="text">
          {$t('ui.widgets.clearNotifications')}
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            onViewAll?.();
          }}
          size="small"
          type="primary"
        >
          {$t('ui.widgets.viewAll')}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover content={content} onOpenChange={setOpen} open={open} placement="bottomRight" trigger="click">
      <span className="inline-flex">
        <VbenIconButton className={cn('relative')}>
          <Badge dot={dot} offset={[-2, 2]}>
            <Bell className={cn('size-4', dot && 'animate-[shrink_1s_ease-in-out_2]')} />
          </Badge>
        </VbenIconButton>
      </span>
    </Popover>
  );
}

export { Notification };
export type { NotificationItem, NotificationProps };
