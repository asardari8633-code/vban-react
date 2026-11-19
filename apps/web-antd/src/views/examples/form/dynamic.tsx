import { App, Button, Card, Space } from 'antd';

import { Page } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

/**
 * فرم پویا با وابستگی بین فیلدها و API فرم
 */
export default function FormDynamic() {
  const { message } = App.useApp();
  const [Form, formApi] = useVbenForm({
    handleSubmit: (values) => message.success(JSON.stringify(values)),
    layout: 'vertical',
    schema: [
      {
        component: 'RadioGroup',
        componentProps: {
          options: [
            { label: 'شخص حقیقی', value: 'person' },
            { label: 'شخص حقوقی', value: 'company' },
          ],
        },
        defaultValue: 'person',
        fieldName: 'kind',
        label: 'نوع',
      },
      {
        component: 'Input',
        dependencies: { if: (v) => v.kind === 'person', triggerFields: ['kind'] },
        fieldName: 'nationalCode',
        label: 'کد ملی',
        rules: [{ len: 10, message: 'کد ملی باید ۱۰ رقم باشد', required: true }],
      },
      {
        component: 'Input',
        dependencies: { if: (v) => v.kind === 'company', triggerFields: ['kind'] },
        fieldName: 'companyName',
        label: 'نام شرکت',
        rules: 'required',
      },
      { component: 'Switch', defaultValue: false, fieldName: 'hasDiscount', label: 'تخفیف دارد؟' },
      {
        component: 'InputNumber',
        componentProps: { max: 100, min: 0, suffix: '٪' },
        dependencies: {
          disabled: (v) => !v.hasDiscount,
          required: (v) => !!v.hasDiscount,
          triggerFields: ['hasDiscount'],
        },
        fieldName: 'discount',
        label: 'درصد تخفیف',
      },
    ],
    wrapperClass: 'grid-cols-1 md:grid-cols-2',
  });

  return (
    <Page description="فیلدها بر اساس مقادیر دیگر نمایش داده، غیرفعال یا الزامی می‌شوند." title="فرم پویا">
      <Card className="mb-4" title="API فرم">
        <Space wrap>
          <Button onClick={() => formApi.setValues({ companyName: 'شرکت نمونه', kind: 'company' })}>تنظیم مقادیر</Button>
          <Button onClick={() => message.info(JSON.stringify(formApi.getValues()))}>خواندن مقادیر</Button>
          <Button onClick={() => formApi.resetForm()}>بازنشانی</Button>
          <Button onClick={() => void formApi.validate().catch(() => message.warning('فرم معتبر نیست'))}>اعتبارسنجی</Button>
          <Button
            onClick={() =>
              formApi.updateSchema([{ fieldName: 'companyName', label: 'نام سازمان (به‌روزشده)' }])
            }
          >
            به‌روزرسانی schema
          </Button>
        </Space>
      </Card>
      <Card>
        <Form />
      </Card>
    </Page>
  );
}
