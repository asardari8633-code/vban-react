import { useRef } from 'react';

import { Button, Card, Space } from 'antd';

import { Page } from '@vben/common-ui';
import { useFullscreen } from '@vben/hooks';

/**
 * نمونه‌ی تمام‌صفحه برای کل سند یا یک عنصر
 */
export default function FullScreenDemo() {
  const domRef = useRef<HTMLDivElement>(null);
  const page = useFullscreen();
  const dom = useFullscreen(domRef);

  return (
    <Page title="تمام‌صفحه">
      <Card className="mb-5" title="کل صفحه">
        <Space>
          <Button onClick={() => void page.enter()} type="primary">
            ورود به تمام‌صفحه
          </Button>
          <Button onClick={() => void page.exit()}>خروج</Button>
          <Button onClick={() => void page.toggle()}>تغییر وضعیت</Button>
          <span>وضعیت: {page.isFullscreen ? 'تمام‌صفحه' : 'عادی'}</span>
        </Space>
      </Card>
      <Card title="یک عنصر">
        <div className="flex-col-center gap-4 rounded-lg bg-primary/10 p-10" ref={domRef}>
          <span className="text-lg">این بخش می‌تواند تمام‌صفحه شود</span>
          <Button onClick={() => void dom.toggle()} type="primary">
            {dom.isFullscreen ? 'خروج' : 'تمام‌صفحه کردن این بخش'}
          </Button>
        </div>
      </Card>
    </Page>
  );
}
