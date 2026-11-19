import { useNavigate } from 'react-router';

import { Button } from 'antd';

import { Page } from '@vben/common-ui';

/**
 * والدی که زیرمنوهایش در منو پنهان‌اند (hideChildrenInMenu)
 */
export default function HideChildrenParent() {
  const navigate = useNavigate();
  return (
    <Page description="زیرمنوهای این صفحه در منو نمایش داده نمی‌شوند." title="پنهان کردن زیرمنو">
      <Button onClick={() => navigate('/demos/features/hide-menu-children/child')} type="primary">
        رفتن به صفحه‌ی فرزند
      </Button>
    </Page>
  );
}
