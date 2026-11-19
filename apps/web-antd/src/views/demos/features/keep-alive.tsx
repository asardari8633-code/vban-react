import { useState } from 'react';

import { Button, Card, Input, Space } from 'antd';

import { Page } from '@vben/common-ui';

/**
 * نمونه‌ی نگه‌داری وضعیت صفحه (keepAlive)
 */
export default function KeepAliveDemo() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <Page
      description="این صفحه meta.keepAlive دارد؛ به زبانه‌ی دیگری بروید و برگردید — شمارنده و متن حفظ می‌شوند. (با «بارگذاری مجدد» زبانه، وضعیت از نو ساخته می‌شود.)"
      title="نگه‌داری صفحه (Keep-Alive)"
    >
      <Card>
        <Space className="w-full" orientation="vertical" size="large">
          <Space>
            <Button onClick={() => setCount((c) => c + 1)} type="primary">
              افزایش
            </Button>
            <span className="text-2xl font-bold">{new Intl.NumberFormat('fa-IR').format(count)}</span>
          </Space>
          <Input onChange={(e) => setText(e.target.value)} placeholder="متنی بنویسید..." value={text} />
        </Space>
      </Card>
    </Page>
  );
}
