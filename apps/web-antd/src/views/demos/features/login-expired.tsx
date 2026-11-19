import { Alert, Button, Card, Radio, Space } from 'antd';

import { Page } from '@vben/common-ui';
import { updatePreferences, usePreferences } from '@vben/preferences';

import { requestClient } from '#/api/request';

/**
 * نمونه‌ی انقضای ورود (حالت صفحه یا مودال)
 */
export default function LoginExpiredDemo() {
  const { preferences } = usePreferences();
  return (
    <Page description="هنگام دریافت پاسخ 401، بسته به تنظیمات به صفحه‌ی ورود هدایت می‌شوید یا مودال ورود باز می‌شود." title="انقضای ورود">
      <Card className="mb-5" title="حالت انقضا">
        <Radio.Group
          onChange={(e) => updatePreferences({ app: { loginExpiredMode: e.target.value } })}
          options={[
            { label: 'هدایت به صفحه‌ی ورود', value: 'page' },
            { label: 'مودال ورود', value: 'modal' },
          ]}
          value={preferences.app.loginExpiredMode}
        />
      </Card>
      <Card title="آزمایش">
        <Alert className="mb-4" title="دکمه‌ی زیر یک درخواست با پاسخ 401 ارسال می‌کند." showIcon type="warning" />
        <Space>
          <Button
            danger
            onClick={() => void requestClient.get('/status', { params: { status: 401 } }).catch(() => undefined)}
            type="primary"
          >
            شبیه‌سازی انقضای نشست
          </Button>
        </Space>
      </Card>
    </Page>
  );
}
