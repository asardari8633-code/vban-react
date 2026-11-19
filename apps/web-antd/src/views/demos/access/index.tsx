import { Alert, Button, Card, Space, Tag } from 'antd';

import { Page } from '@vben/common-ui';
import { usePreferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { useAccessSwitch } from './use-switch';

const accounts = [
  { label: 'Super', username: 'vben' },
  { label: 'Admin', username: 'admin' },
  { label: 'User', username: 'jack' },
];

/**
 * نمونه‌ی کنترل دسترسی صفحه
 */
export default function AccessPageControl() {
  const userInfo = useUserStore((s) => s.userInfo);
  const { preferences } = usePreferences();
  const accessMode = preferences.app.accessMode;
  const { changeAccessMode, changeAccount } = useAccessSwitch();

  return (
    <Page
      description="منوها و مسیرهای قابل دسترس بر اساس نقش کاربر یا داده‌ی سرور ساخته می‌شوند. با تعویض حساب، منوی «دسترسی» تغییر می‌کند."
      title={accessMode === 'frontend' ? 'کنترل دسترسی صفحه (سمت کلاینت)' : 'کنترل دسترسی صفحه (سمت سرور)'}
    >
      <Card className="mb-5" title="حالت دسترسی">
        <Alert
          className="mb-4"
          description="در حالت frontend مسیرها با meta.authority فیلتر می‌شوند؛ در حالت backend منوها از API ‎/menu/all‎ دریافت می‌شوند."
          title={`حالت فعلی: ${accessMode === 'frontend' ? 'سمت کلاینت' : 'سمت سرور'}`}
          showIcon
          type="info"
        />
        <Space>
          <Button disabled={accessMode === 'frontend'} onClick={() => changeAccessMode('frontend')} type="primary">
            تغییر به دسترسی سمت کلاینت
          </Button>
          <Button disabled={accessMode === 'backend'} onClick={() => changeAccessMode('backend')} type="primary">
            تغییر به دسترسی سمت سرور
          </Button>
        </Space>
      </Card>
      <Card title="تعویض حساب">
        <div className="mb-4">
          حساب فعلی: <Tag color="blue">{userInfo?.username}</Tag> نقش‌ها:{' '}
          {userInfo?.roles?.map((role) => (
            <Tag color="green" key={role}>
              {role}
            </Tag>
          ))}
        </div>
        <Space>
          {accounts.map((account) => (
            <Button
              disabled={userInfo?.username === account.username}
              key={account.username}
              onClick={() => void changeAccount(account.username)}
            >
              ورود با حساب {account.label}
            </Button>
          ))}
        </Space>
      </Card>
    </Page>
  );
}
