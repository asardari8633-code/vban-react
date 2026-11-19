import { useState } from 'react';

import { Button, Card, Space } from 'antd';

import { Page, VbenCountToAnimator } from '@vben/common-ui';

/**
 * شمارنده‌ی متحرک
 */
export default function CountToExample() {
  const [value, setValue] = useState(12_345);
  return (
    <Page title="شمارنده‌ی عددی">
      <Card>
        <div className="mb-6 flex flex-wrap gap-10 text-3xl font-bold">
          <VbenCountToAnimator endVal={value} />
          <VbenCountToAnimator decimals={2} endVal={value / 7} prefix="$" />
          <VbenCountToAnimator duration={3000} endVal={value * 3} suffix=" ریال" />
        </div>
        <Space>
          <Button onClick={() => setValue(Math.round(Math.random() * 1_000_000))} type="primary">
            مقدار تصادفی
          </Button>
          <Button onClick={() => setValue(0)}>صفر</Button>
        </Space>
      </Card>
    </Page>
  );
}
