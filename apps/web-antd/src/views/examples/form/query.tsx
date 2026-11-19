import { App, Card } from 'antd';

import { Page } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

/**
 * فرم جست‌وجو با قابلیت جمع/باز شدن
 */
export default function FormQuery() {
  const { message } = App.useApp();
  const [Form] = useVbenForm({
    collapsed: true,
    collapsedRows: 1,
    handleSubmit: (values) => message.info(`جست‌وجو: ${JSON.stringify(values)}`),
    layout: 'vertical',
    schema: Array.from({ length: 9 }, (_, i) => ({
      component: i % 3 === 1 ? 'Select' : i % 3 === 2 ? 'DatePicker' : 'Input',
      componentProps:
        i % 3 === 1
          ? { allowClear: true, options: [{ label: 'فعال', value: 1 }, { label: 'غیرفعال', value: 0 }] }
          : {},
      fieldName: `field${i + 1}`,
      label: `فیلد ${new Intl.NumberFormat('fa-IR').format(i + 1)}`,
    })) as any,
    showCollapseButton: true,
    submitButtonOptions: { content: 'جست‌وجو' },
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  });

  return (
    <Page description="مناسب بالای جدول‌ها؛ تعداد ستون‌ها با عرض صفحه تغییر می‌کند." title="فرم جست‌وجو">
      <Card>
        <Form />
      </Card>
    </Page>
  );
}
