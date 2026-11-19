import type { ComponentType, ReactNode } from 'react';

import type { TabOption } from '@vben/types';

import { Card, Tabs, Tag } from 'antd';

import { VbenCountToAnimator } from '@vben-core/base-ui';
import { cn } from '@vben-core/shared';

interface AnalysisOverviewItem {
  icon: ComponentType<any>;
  title: string;
  totalTitle: string;
  totalValue: number;
  value: number;
}

/**
 * کارت‌های آمار کلی داشبورد
 */
function AnalysisOverview({ items }: { items: AnalysisOverviewItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            className="w-full"
            extra={<Tag color="processing">روزانه</Tag>}
            key={item.title}
            title={item.title}
          >
            <div className="flex items-center justify-between">
              <VbenCountToAnimator className="text-xl" endVal={item.value} />
              <Icon className="size-8 shrink-0" />
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm text-muted-foreground">
              <span>{item.totalTitle}</span>
              <VbenCountToAnimator endVal={item.totalValue} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * کارت نمودار با عنوان
 */
function AnalysisChartCard({ children, className, title }: { children?: ReactNode; className?: string; title: ReactNode }) {
  return (
    <Card className={className} title={title}>
      {children}
    </Card>
  );
}

/**
 * کارت نمودار با زبانه
 */
function AnalysisChartsTabs({
  className,
  renderTab,
  tabs,
}: {
  className?: string;
  renderTab: (value: string) => ReactNode;
  tabs: TabOption[];
}) {
  return (
    <Card className={cn('w-full', className)} styles={{ body: { paddingTop: 0 } }}>
      <Tabs
        items={tabs.map((tab) => ({
          children: renderTab(tab.value),
          key: tab.value,
          label: tab.label,
        }))}
      />
    </Card>
  );
}

export { AnalysisChartCard, AnalysisChartsTabs, AnalysisOverview };
export type { AnalysisOverviewItem };
