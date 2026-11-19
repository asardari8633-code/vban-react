import { App, Button, Card, DatePicker, Input, Progress, Rate, Select, Slider, Space, Steps, Switch, Tag, Timeline } from 'antd';

import { Page } from '@vben/common-ui';

/**
 * نمایش کامپوننت‌های Ant Design با تم و جهت RTL برنامه
 */
export default function AntdDemos() {
  const { message, modal, notification } = App.useApp();

  return (
    <Page description="کامپوننت‌های Ant Design با تم برنامه هماهنگ‌اند و در حالت RTL به‌درستی نمایش داده می‌شوند." title="کامپوننت‌های Ant Design">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="دکمه‌ها">
          <Space wrap>
            <Button type="primary">اصلی</Button>
            <Button>پیش‌فرض</Button>
            <Button type="dashed">خط‌چین</Button>
            <Button danger type="primary">
              خطر
            </Button>
            <Button type="link">لینک</Button>
            <Button loading type="primary">
              در حال بارگذاری
            </Button>
          </Space>
        </Card>
        <Card title="پیام‌ها">
          <Space wrap>
            <Button onClick={() => message.success('عملیات با موفقیت انجام شد')}>پیام موفقیت</Button>
            <Button onClick={() => message.error('خطایی رخ داد')}>پیام خطا</Button>
            <Button
              onClick={() =>
                notification.info({ description: 'این یک اعلان نمونه است.', title: 'اعلان' })
              }
            >
              اعلان
            </Button>
            <Button
              onClick={() =>
                modal.confirm({ content: 'آیا از انجام این کار مطمئن هستید؟', title: 'تأیید' })
              }
            >
              پنجره‌ی تأیید
            </Button>
          </Space>
        </Card>
        <Card title="ورودی‌ها">
          <Space className="w-full" orientation="vertical">
            <Input placeholder="متن خود را وارد کنید" />
            <Select
              className="w-full"
              options={[
                { label: 'تهران', value: 'tehran' },
                { label: 'اصفهان', value: 'isfahan' },
                { label: 'شیراز', value: 'shiraz' },
              ]}
              placeholder="انتخاب شهر"
            />
            <DatePicker className="w-full" />
            <Slider defaultValue={40} />
            <Space>
              <Switch defaultChecked />
              <Rate defaultValue={4} />
            </Space>
          </Space>
        </Card>
        <Card title="نمایش داده">
          <Space className="mb-4" wrap>
            <Tag color="blue">آبی</Tag>
            <Tag color="green">سبز</Tag>
            <Tag color="orange">نارنجی</Tag>
            <Tag color="red">قرمز</Tag>
          </Space>
          <Progress percent={68} />
          <Progress percent={100} status="success" />
          <Steps
            className="mt-4"
            current={1}
            items={[{ title: 'ثبت سفارش' }, { title: 'پرداخت' }, { title: 'ارسال' }]}
            size="small"
          />
        </Card>
        <Card className="lg:col-span-2" title="خط زمانی">
          <Timeline
            items={[
              { children: 'راه‌اندازی پروژه — ۱۴۰۳/۰۱/۰۱' },
              { children: 'پیاده‌سازی چیدمان و دسترسی‌ها — ۱۴۰۳/۰۲/۱۵', color: 'green' },
              { children: 'آزمایش و رفع اشکال — ۱۴۰۳/۰۳/۱۰', color: 'red' },
              { children: 'انتشار نسخه‌ی پایدار — ۱۴۰۳/۰۴/۰۱' },
            ]}
          />
        </Card>
      </div>
    </Page>
  );
}
