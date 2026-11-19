import type { ReactNode } from 'react';

import { Avatar, Card, Checkbox } from 'antd';

import { VbenAvatar } from '@vben-core/base-ui';
import { VbenIcon } from '@vben-core/icons';
import { cn } from '@vben-core/shared';

interface WorkbenchProjectItem {
  color?: string;
  content: string;
  date: string;
  group: string;
  icon: string;
  title: string;
  url?: string;
}

interface WorkbenchQuickNavItem {
  color?: string;
  icon: string;
  title: string;
  url?: string;
}

interface WorkbenchTodoItem {
  completed: boolean;
  content: string;
  date: string;
  title: string;
}

interface WorkbenchTrendItem {
  avatar: string;
  content: ReactNode;
  date: string;
  title: string;
}

/**
 * سربرگ میز کار: آواتار، خوشامد و آمار
 */
function WorkbenchHeader({
  avatar,
  description,
  title,
}: {
  avatar?: string;
  description?: ReactNode;
  title?: ReactNode;
}) {
  const stats = [
    { label: 'کارهای در انتظار', value: '۲/۱۰' },
    { label: 'پروژه‌ها', value: '۸' },
    { label: 'اعضای تیم', value: '۳۰۰' },
  ];
  return (
    <div className="card-box flex flex-col items-start p-4 md:flex-row md:items-center lg:p-6">
      <div className="flex flex-1 items-center">
        <VbenAvatar className="size-20" size={80} src={avatar} />
        <div className="ms-6 flex flex-col justify-center gap-2">
          <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
          <span className="text-foreground/80">{description}</span>
        </div>
      </div>
      <div className="mt-4 flex flex-1 justify-end gap-6 md:mt-0">
        {stats.map((item) => (
          <div className="flex flex-col justify-center text-end" key={item.label}>
            <span className="text-foreground/80">{item.label}</span>
            <span className="text-2xl">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkbenchProject({
  items,
  onClick,
  title,
}: {
  items: WorkbenchProjectItem[];
  onClick?: (item: WorkbenchProjectItem) => void;
  title: ReactNode;
}) {
  return (
    <Card styles={{ body: { padding: 0 } }} title={title}>
      <div className="flex flex-wrap">
        {items.map((item, index) => (
          <div
            className={cn(
              'w-full cursor-pointer border-border p-4 transition-all hover:shadow-xl md:w-1/2 lg:w-1/3',
              index % 3 !== 2 && 'lg:border-e',
              index < items.length - 3 && 'border-b',
            )}
            key={item.title}
            onClick={() => onClick?.(item)}
          >
            <div className="flex items-center">
              <VbenIcon icon={item.icon} size={30} style={{ color: item.color }} />
              <span className="ms-4 text-lg font-medium">{item.title}</span>
            </div>
            <div className="mt-4 flex h-10 text-foreground/80">{item.content}</div>
            <div className="flex justify-between text-foreground/80">
              <span>{item.group}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WorkbenchQuickNav({
  className,
  items,
  onClick,
  title,
}: {
  className?: string;
  items: WorkbenchQuickNavItem[];
  onClick?: (item: WorkbenchQuickNavItem) => void;
  title: ReactNode;
}) {
  return (
    <Card className={className} styles={{ body: { padding: 0 } }} title={title}>
      <div className="flex flex-wrap">
        {items.map((item, index) => (
          <div
            className={cn(
              'flex-col-center group w-1/3 cursor-pointer border-border py-6 hover:shadow-xl',
              index % 3 !== 2 && 'border-e',
              index < items.length - 3 && 'border-b',
            )}
            key={item.title}
            onClick={() => onClick?.(item)}
          >
            <VbenIcon
              className="mb-2 transition-all duration-300 group-hover:scale-110"
              icon={item.icon}
              size={28}
              style={{ color: item.color }}
            />
            <span className="text-md mt-2 truncate">{item.title}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function WorkbenchTodo({
  className,
  items,
  onToggle,
  title,
}: {
  className?: string;
  items: WorkbenchTodoItem[];
  onToggle?: (index: number, completed: boolean) => void;
  title: ReactNode;
}) {
  return (
    <Card className={className} title={title}>
      <ul className="divide-y divide-border">
        {items.map((item, index) => (
          <li className="flex justify-between gap-x-6 py-4" key={item.title}>
            <div className="flex min-w-0 items-center gap-x-4">
              <Checkbox checked={item.completed} onChange={(e) => onToggle?.(index, e.target.checked)} />
              <div className="min-w-0 flex-auto">
                <p className={cn('text-sm leading-6 font-semibold text-foreground', item.completed && 'line-through')}>
                  {item.title}
                </p>
                <p className={cn('mt-1 truncate text-xs leading-5 text-muted-foreground', item.completed && 'line-through')}>
                  {item.content}
                </p>
              </div>
            </div>
            <div className="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
              <span className="mt-6 text-xs leading-6 text-foreground">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function WorkbenchTrends({ items, title }: { items: WorkbenchTrendItem[]; title: ReactNode }) {
  return (
    <Card title={title}>
      <ul className="divide-y divide-border">
        {items.map((item, index) => (
          <li className="flex justify-between gap-x-6 py-3" key={index}>
            <div className="flex min-w-0 items-center gap-x-4">
              <Avatar size={36} src={item.avatar} />
              <div className="min-w-0 flex-auto">
                <p className="text-sm leading-6 font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">{item.content}</p>
              </div>
            </div>
            <div className="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
              <span className="mt-6 text-xs leading-6 text-foreground">{item.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export {
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
};
export type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
};
