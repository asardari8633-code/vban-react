import { useState } from 'react';

import { Button, Card, Input, Space } from 'antd';

import { Page } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { updatePreferences } from '@vben/preferences';

/**
 * نمونه‌ی واترمارک سراسری
 */
export default function WatermarkDemo() {
  const { destroyWatermark, updateWatermark, watermark } = useWatermark();
  const [text, setText] = useState('Vben Admin React');

  return (
    <Page description="واترمارک روی کل ناحیه‌ی محتوا اعمال می‌شود." title="واترمارک">
      <Card>
        <Space className="w-full" orientation="vertical">
          <Input onChange={(e) => setText(e.target.value)} value={text} />
          <Space wrap>
            <Button onClick={() => updateWatermark({ content: text })} type="primary">
              ایجاد/به‌روزرسانی واترمارک
            </Button>
            <Button onClick={() => updateWatermark({ content: [text, new Date().toLocaleDateString('fa-IR')] })}>
              واترمارک دوخطی
            </Button>
            <Button
              danger
              onClick={() => {
                destroyWatermark();
                updatePreferences({ app: { watermark: false } });
              }}
            >
              حذف واترمارک
            </Button>
          </Space>
          <div className="text-muted-foreground">وضعیت: {watermark.enable ? 'فعال' : 'غیرفعال'}</div>
        </Space>
      </Card>
    </Page>
  );
}
