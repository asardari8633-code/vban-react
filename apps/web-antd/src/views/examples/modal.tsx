import { App, Button, Card, Input, Space } from 'antd';

import { Page, useModalContext, useVbenModal } from '@vben/common-ui';

function ModalContent() {
  const api = useModalContext();
  const data = api.getData<{ name: string }>();
  return (
    <div className="py-4">
      <p>داده‌ی ارسال‌شده به مودال: {data?.name ?? '—'}</p>
      <Input placeholder="محتوای مودال" />
    </div>
  );
}

/**
 * نمونه‌های useVbenModal
 */
export default function ModalExample() {
  const { message } = App.useApp();

  const [BasicModal, basicApi] = useVbenModal({ title: 'مودال پایه' });

  const [ConfirmModal, confirmApi] = useVbenModal({
    onConfirm: async () => {
      confirmApi.setState({ confirmLoading: true });
      await new Promise((r) => setTimeout(r, 1500));
      confirmApi.setState({ confirmLoading: false });
      confirmApi.close();
      message.success('ذخیره شد');
    },
    title: 'مودال با تأیید ناهمگام',
  });

  const [LoadingModal, loadingApi] = useVbenModal({
    onOpenChange: (open) => {
      if (!open) return;
      loadingApi.setState({ loading: true });
      setTimeout(() => loadingApi.setState({ loading: false }), 1500);
    },
    title: 'بارگذاری داده',
  });

  return (
    <Page description="مودال‌ها با API کنترل می‌شوند و می‌توانند داده دریافت کنند." title="مودال">
      <Card>
        <Space wrap>
          <Button onClick={() => basicApi.setData({ name: 'علی' }).open()} type="primary">
            مودال پایه با داده
          </Button>
          <Button onClick={() => confirmApi.open()}>تأیید ناهمگام</Button>
          <Button onClick={() => loadingApi.open()}>با حالت بارگذاری</Button>
        </Space>
      </Card>
      <BasicModal>
        <ModalContent />
      </BasicModal>
      <ConfirmModal>
        <p>با کلیک روی «تأیید»، یک عملیات ۱.۵ ثانیه‌ای اجرا می‌شود.</p>
      </ConfirmModal>
      <LoadingModal description="محتوا پس از بارگذاری نمایش داده می‌شود">
        <p>داده‌ها بارگذاری شدند ✅</p>
      </LoadingModal>
    </Page>
  );
}
