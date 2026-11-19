import { Button, Card, Space, Tag } from 'antd';

import { AccessControl, useAccess } from '@vben/access';
import { Page } from '@vben/common-ui';
import { useAccessStore, useUserStore } from '@vben/stores';

import { useAccessSwitch } from './use-switch';

const accounts = [
  { label: 'Super', username: 'vben' },
  { label: 'Admin', username: 'admin' },
  { label: 'User', username: 'jack' },
];

/**
 * نمونه‌ی کنترل دسترسی دکمه‌ها (کامپوننت، تابع)
 */
export default function AccessButtonControl() {
  const userInfo = useUserStore((s) => s.userInfo);
  const accessCodes = useAccessStore((s) => s.accessCodes);
  const { accessMode, hasAccessByCodes, hasAccessByRoles } = useAccess();
  const { changeAccount } = useAccessSwitch();

  return (
    <Page description="نمایش دکمه‌ها بر اساس نقش یا کد دسترسی کاربر" title="کنترل دسترسی دکمه‌ها">
      <Card className="mb-5" title="حساب فعلی">
        <div className="mb-3">
          نقش‌ها: {userInfo?.roles?.map((r) => <Tag color="green" key={r}>{r}</Tag>)} | کدها:{' '}
          {accessCodes.map((c) => <Tag key={c}>{c}</Tag>)}
        </div>
        <Space>
          {accounts.map((account) => (
            <Button
              disabled={userInfo?.username === account.username}
              key={account.username}
              onClick={() => void changeAccount(account.username)}
            >
              {account.label}
            </Button>
          ))}
        </Space>
      </Card>

      {accessMode === 'frontend' && (
        <Card className="mb-5" title="کنترل با کامپوننت — بر اساس نقش">
          <Space wrap>
            <AccessControl codes={['super']} type="role">
              <Button>قابل مشاهده برای Super</Button>
            </AccessControl>
            <AccessControl codes={['admin']} type="role">
              <Button>قابل مشاهده برای Admin</Button>
            </AccessControl>
            <AccessControl codes={['user']} type="role">
              <Button>قابل مشاهده برای User</Button>
            </AccessControl>
            <AccessControl codes={['super', 'admin']} type="role">
              <Button>قابل مشاهده برای Super و Admin</Button>
            </AccessControl>
          </Space>
        </Card>
      )}

      <Card className="mb-5" title="کنترل با کامپوننت — بر اساس کد دسترسی">
        <Space wrap>
          <AccessControl codes={['AC_100100']} type="code">
            <Button>Super قابل مشاهده ["AC_100100"]</Button>
          </AccessControl>
          <AccessControl codes={['AC_100030']} type="code">
            <Button>Admin قابل مشاهده ["AC_100030"]</Button>
          </AccessControl>
          <AccessControl codes={['AC_1000001']} type="code">
            <Button>User قابل مشاهده ["AC_1000001"]</Button>
          </AccessControl>
          <AccessControl codes={['AC_100100', 'AC_100010']} type="code">
            <Button>Super و Admin</Button>
          </AccessControl>
        </Space>
      </Card>

      <Card title="کنترل با تابع">
        <Space wrap>
          {accessMode === 'frontend' && hasAccessByRoles(['super']) && <Button type="primary">نقش Super</Button>}
          {accessMode === 'frontend' && hasAccessByRoles(['admin']) && <Button type="primary">نقش Admin</Button>}
          {hasAccessByCodes(['AC_100100']) && <Button>کد AC_100100</Button>}
          {hasAccessByCodes(['AC_100030']) && <Button>کد AC_100030</Button>}
          {hasAccessByCodes(['AC_1000001']) && <Button>کد AC_1000001</Button>}
        </Space>
      </Card>
    </Page>
  );
}
