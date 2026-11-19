import { App, Button, Card, Space } from 'antd';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

/**
 * نمونه‌های useVbenDrawer
 */
export default function DrawerExample() {
  const { message } = App.useApp();
  const [Form, formApi] = useVbenForm({
    layout: 'vertical',
    schema: [
      { component: 'Input', fieldName: 'title', label: 'عنوان', rules: 'required' },
      { component: 'Textarea', fieldName: 'content', label: 'محتوا' },
    ],
    showDefaultActions: false,
  });

  const [BasicDrawer, basicApi] = useVbenDrawer({ title: 'کشوی پایه' });
  const [FormDrawer, formDrawerApi] = useVbenDrawer({
    onConfirm: async () => {
      const values = await formApi.validate().catch(() => null);
      if (!values) return;
      formDrawerApi.lock();
      await new Promise((r) => setTimeout(r, 800));
      formDrawerApi.unlock();
      formDrawerApi.close();
      message.success(`ذخیره شد: ${values.title}`);
    },
    title: 'کشوی فرم',
  });

  return (
    <Page title="کشو">
      <Card>
        <Space wrap>
          <Button onClick={() => basicApi.open()} type="primary">
            کشوی پایه
          </Button>
          <Button onClick={() => formDrawerApi.open()}>کشو با فرم</Button>
          <Button onClick={() => basicApi.setState({ placement: 'bottom' }).open()}>کشو از پایین</Button>
        </Space>
      </Card>
      <BasicDrawer>
        <p>محتوای کشوی پایه</p>
      </BasicDrawer>
      <FormDrawer>
        <Form />
      </FormDrawer>
    </Page>
  );
}
