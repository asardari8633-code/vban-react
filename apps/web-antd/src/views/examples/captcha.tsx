import { useState } from 'react';

import { Button, Card } from 'antd';

import { Page, SliderCaptcha } from '@vben/common-ui';

/**
 * کپچای اسلایدری
 */
export default function CaptchaExample() {
  const [passed, setPassed] = useState(false);
  const [time, setTime] = useState<number>();
  return (
    <Page title="کپچا">
      <Card className="max-w-md" title="کپچای اسلایدری">
        <SliderCaptcha onChange={setPassed} onSuccess={({ time: t }) => setTime(t)} value={passed} />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-muted-foreground">
            {passed ? `تأیید شد (${time?.toFixed(1)} ثانیه)` : 'تأیید نشده'}
          </span>
          <Button onClick={() => setPassed(false)}>بازنشانی</Button>
        </div>
      </Card>
    </Page>
  );
}
