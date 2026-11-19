import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

/**
 * صفحه‌ی جزئیات با پارامتر مسیر
 */
export default function TabDetail() {
  const { id } = useParams();
  const { setTabTitle } = useTabs();

  useEffect(() => {
    setTabTitle(`جزئیات ${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Page description="عنوان زبانه با پارامتر مسیر تنظیم شده است." title={`صفحه‌ی جزئیات شماره‌ی ${id}`}>
      <div className="card-box p-6">شناسه‌ی دریافتی از مسیر: {id}</div>
    </Page>
  );
}
