import type { ReactNode } from 'react';

import { Card, Menu } from 'antd';

import { VbenAvatar } from '@vben-core/base-ui';
import { cn } from '@vben-core/shared';

import { Page } from '../../components/page/page';

interface ProfileTab {
  label: string;
  value: string;
}

interface ProfileProps {
  activeTab: string;
  avatar?: string;
  children?: ReactNode;
  description?: ReactNode;
  onTabChange: (value: string) => void;
  tabs: ProfileTab[];
  title?: ReactNode;
  userName?: ReactNode;
}

/**
 * قالب صفحه‌ی پروفایل کاربر: کارت کاربر + منوی بخش‌ها + محتوا
 */
function Profile({ activeTab, avatar, children, description, onTabChange, tabs, title, userName }: ProfileProps) {
  return (
    <Page title={title}>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <Card className="w-full md:w-1/5 md:min-w-56">
          <div className="flex flex-col items-center gap-3 border-b border-border pb-5">
            <VbenAvatar size={80} src={avatar} />
            <span className="text-lg font-semibold">{userName}</span>
            {description && <span className="text-sm text-muted-foreground">{description}</span>}
          </div>
          <Menu
            className={cn('mt-3 border-none!')}
            items={tabs.map((tab) => ({ key: tab.value, label: tab.label }))}
            mode="inline"
            onClick={({ key }) => onTabChange(String(key))}
            selectedKeys={[activeTab]}
          />
        </Card>
        <Card className="min-w-0 flex-1">{children}</Card>
      </div>
    </Page>
  );
}

export { Profile };
export type { ProfileProps, ProfileTab };
