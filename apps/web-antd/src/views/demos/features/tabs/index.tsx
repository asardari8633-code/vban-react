import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Button, Card, Input, Space } from 'antd';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

/**
 * نمونه‌ی API زبانه‌ها
 */
export default function TabsDemo() {
  const navigate = useNavigate();
  const tabs = useTabs();
  const [title, setTitle] = useState('عنوان سفارشی');

  return (
    <Page description="با هوک useTabs زبانه‌ها را کنترل کنید." title="API زبانه‌ها">
      <Card className="mb-5" title="باز کردن/بستن">
        <Space wrap>
          <Button onClick={() => navigate('/dashboard/workspace')} type="primary">
            باز کردن «میز کار»
          </Button>
          <Button onClick={() => void tabs.closeCurrentTab()}>بستن زبانه‌ی فعلی</Button>
          <Button onClick={() => tabs.closeOtherTabs()}>بستن سایر زبانه‌ها</Button>
          <Button onClick={() => tabs.closeLeftTabs()}>بستن زبانه‌های قبلی</Button>
          <Button onClick={() => tabs.closeRightTabs()}>بستن زبانه‌های بعدی</Button>
          <Button onClick={() => void tabs.closeAllTabs()}>بستن همه</Button>
        </Space>
      </Card>
      <Card className="mb-5" title="سنجاق و تازه‌سازی">
        <Space wrap>
          <Button onClick={() => tabs.toggleTabPin()}>سنجاق/برداشتن سنجاق</Button>
          <Button onClick={() => void tabs.refreshTab()}>تازه‌سازی زبانه</Button>
          <Button onClick={() => tabs.openTabInNewWindow()}>باز کردن در پنجره‌ی جدید</Button>
        </Space>
      </Card>
      <Card className="mb-5" title="عنوان زبانه">
        <Space.Compact className="w-full max-w-md">
          <Input onChange={(e) => setTitle(e.target.value)} value={title} />
          <Button onClick={() => tabs.setTabTitle(title)} type="primary">
            تنظیم عنوان
          </Button>
          <Button onClick={() => tabs.resetTabTitle()}>بازنشانی</Button>
        </Space.Compact>
      </Card>
      <Card title="حداکثر تعداد زبانه (maxNumOfOpenTab = 3)">
        <p className="mb-3 text-muted-foreground">
          صفحه‌ی جزئیات حداکثر ۳ زبانه‌ی هم‌زمان دارد؛ با باز کردن چهارمی، قدیمی‌ترین بسته می‌شود.
        </p>
        <Space wrap>
          {[1, 2, 3, 4, 5].map((id) => (
            <Button key={id} onClick={() => navigate(`/demos/features/tabs/detail/${id}`)}>
              جزئیات {new Intl.NumberFormat('fa-IR').format(id)}
            </Button>
          ))}
        </Space>
      </Card>
    </Page>
  );
}
