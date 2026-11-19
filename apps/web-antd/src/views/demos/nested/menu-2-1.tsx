import { Input } from 'antd';

import { Page } from '@vben/common-ui';

/**
 * صفحه‌ی منوی تودرتو (با keepAlive: متن واردشده حفظ می‌شود)
 */
export default function NestedMenuPage() {
  return (
    <Page description="نمونه‌ی منوی چندسطحی" title="منوی ۲-۱">
      <Input className="max-w-md" placeholder="متنی بنویسید و بین زبانه‌ها جابه‌جا شوید" />
    </Page>
  );
}
