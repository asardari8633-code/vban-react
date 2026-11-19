import { App, Card } from 'antd';

import { Page } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

/**
 * فرم پایه با انواع کامپوننت‌ها
 */
export default function FormBasic() {
  const { message } = App.useApp();
  const [Form] = useVbenForm({
    commonConfig: { labelWidth: 120 },
    handleSubmit: (values) => {
      message.success(`مقادیر فرم: ${JSON.stringify(values)}`);
    },
    layout: 'horizontal',
    schema: [
      { component: 'Input', fieldName: 'username', help: 'نام کاربری یکتا', label: 'نام کاربری', rules: 'required' },
      { component: 'InputPassword', fieldName: 'password', label: 'رمز عبور', rules: 'required' },
      { component: 'InputNumber', componentProps: { min: 0 }, fieldName: 'age', label: 'سن' },
      {
        component: 'Select',
        componentProps: {
          options: [
            { label: 'تهران', value: 'tehran' },
            { label: 'مشهد', value: 'mashhad' },
            { label: 'تبریز', value: 'tabriz' },
          ],
        },
        fieldName: 'city',
        label: 'شهر',
        rules: 'selectRequired',
      },
      {
        component: 'RadioGroup',
        componentProps: {
          options: [
            { label: 'گزینه‌ی ۱', value: '1' },
            { label: 'گزینه‌ی ۲', value: '2' },
          ],
        },
        defaultValue: '1',
        fieldName: 'radio',
        label: 'رادیو',
      },
      {
        component: 'CheckboxGroup',
        componentProps: {
          options: [
            { label: 'مطالعه', value: 'read' },
            { label: 'ورزش', value: 'sport' },
            { label: 'موسیقی', value: 'music' },
          ],
        },
        fieldName: 'hobbies',
        label: 'علاقه‌مندی‌ها',
      },
      { component: 'Switch', defaultValue: true, fieldName: 'enabled', label: 'فعال' },
      { component: 'DatePicker', fieldName: 'date', label: 'تاریخ' },
      { component: 'RangePicker', fieldName: 'range', label: 'بازه‌ی زمانی' },
      { component: 'TimePicker', fieldName: 'time', label: 'زمان' },
      { component: 'Rate', defaultValue: 3, fieldName: 'rate', label: 'امتیاز' },
      { component: 'Slider', defaultValue: 30, fieldName: 'slider', label: 'میزان' },
      {
        component: 'TreeSelect',
        componentProps: {
          treeData: [
            { children: [{ title: 'تهران', value: 'tehran' }, { title: 'کرج', value: 'karaj' }], title: 'شمال', value: 'north' },
            { children: [{ title: 'شیراز', value: 'shiraz' }], title: 'جنوب', value: 'south' },
          ],
        },
        fieldName: 'region',
        label: 'منطقه',
      },
      { component: 'ColorPicker', fieldName: 'color', label: 'رنگ' },
      { component: 'Textarea', fieldName: 'remark', formItemClass: 'md:col-span-2', label: 'توضیحات' },
    ],
    wrapperClass: 'grid-cols-1 md:grid-cols-2',
  });

  return (
    <Page description="فرم schema-محور با useVbenForm و کامپوننت‌های ثبت‌شده‌ی antd" title="فرم پایه">
      <Card>
        <Form />
      </Card>
    </Page>
  );
}
