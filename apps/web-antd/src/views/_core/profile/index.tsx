import { useState } from 'react';

import { App, Button, Divider, List, Switch } from 'antd';

import { Profile } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

function BaseSetting() {
  const userInfo = useUserStore((s) => s.userInfo);
  const { message } = App.useApp();
  const [Form] = useVbenForm({
    handleSubmit: () => {
      message.success($t('ui.actionMessage.operationSuccess'));
    },
    layout: 'vertical',
    schema: [
      { component: 'Input', defaultValue: userInfo?.realName, fieldName: 'realName', label: 'نام', rules: 'required' },
      { component: 'Input', componentProps: { disabled: true }, defaultValue: userInfo?.username, fieldName: 'username', label: 'نام کاربری' },
      {
        component: 'Select',
        componentProps: {
          mode: 'multiple',
          options: [
            { label: 'super', value: 'super' },
            { label: 'admin', value: 'admin' },
            { label: 'user', value: 'user' },
          ],
        },
        defaultValue: userInfo?.roles,
        fieldName: 'roles',
        label: 'نقش‌ها',
      },
      { component: 'Textarea', defaultValue: userInfo?.desc, fieldName: 'introduction', label: 'معرفی' },
    ],
    submitButtonOptions: { content: $t('profile.updateBasicProfile') },
    resetButtonOptions: { show: false },
    wrapperClass: 'grid-cols-1 md:w-1/2',
  });
  return <Form />;
}

function PasswordSetting() {
  const { message } = App.useApp();
  const [Form] = useVbenForm({
    handleSubmit: () => {
      message.success('رمز عبور با موفقیت تغییر کرد');
    },
    layout: 'vertical',
    schema: [
      { component: 'InputPassword', fieldName: 'oldPassword', label: 'رمز فعلی', rules: 'required' },
      { component: 'InputPassword', fieldName: 'newPassword', label: 'رمز جدید', rules: [{ message: 'حداقل ۶ کاراکتر', min: 6, required: true }] },
      {
        component: 'InputPassword',
        fieldName: 'confirmPassword',
        formItemProps: { dependencies: ['newPassword'] },
        label: 'تکرار رمز جدید',
        rules: [
          { message: 'لطفاً تکرار رمز را وارد کنید', required: true },
          ({ getFieldValue }: any) => ({
            validator: (_: unknown, value: string) =>
              !value || getFieldValue('newPassword') === value
                ? Promise.resolve()
                : Promise.reject(new Error($t('authentication.confirmPasswordTip'))),
          }),
        ],
      },
    ],
    submitButtonOptions: { content: $t('profile.updatePassword') },
    resetButtonOptions: { show: false },
    wrapperClass: 'grid-cols-1 md:w-1/2',
  });
  return <Form />;
}

function SecuritySetting() {
  const items = [
    { description: 'رمز عبور فعلی: قوی', title: 'رمز عبور حساب', value: true },
    { description: 'شماره‌ی ثبت‌شده: ۰۹۱۲****۸۹', title: 'تلفن همراه', value: true },
    { description: 'سؤال امنیتی تنظیم نشده است', title: 'سؤال امنیتی', value: false },
    { description: 'ایمیل ثبت‌شده: ann.vben@gmail.com', title: 'ایمیل پشتیبان', value: true },
  ];
  return (
    <List
      dataSource={items}
      renderItem={(item) => (
        <List.Item extra={<Switch defaultChecked={item.value} />}>
          <List.Item.Meta description={item.description} title={item.title} />
        </List.Item>
      )}
    />
  );
}

function NotificationSetting() {
  const items = [
    { description: 'پیام‌های سایر کاربران به‌صورت اعلان درون‌برنامه‌ای', title: 'پیام‌های حساب' },
    { description: 'اطلاع‌رسانی‌های سیستمی', title: 'پیام‌های سیستم' },
    { description: 'وظایف و کارهای در انتظار', title: 'کارهای در انتظار' },
  ];
  return (
    <List
      dataSource={items}
      renderItem={(item) => (
        <List.Item extra={<Switch defaultChecked />}>
          <List.Item.Meta description={item.description} title={item.title} />
        </List.Item>
      )}
    />
  );
}

/**
 * پروفایل کاربر
 */
export default function ProfilePage() {
  const userInfo = useUserStore((s) => s.userInfo);
  const [tab, setTab] = useState('basic');

  const tabs = [
    { label: 'تنظیمات پایه', value: 'basic' },
    { label: 'تنظیمات امنیتی', value: 'security' },
    { label: 'تغییر رمز عبور', value: 'password' },
    { label: 'تنظیمات اعلان‌ها', value: 'notice' },
  ];

  return (
    <Profile
      activeTab={tab}
      avatar={userInfo?.avatar || preferences.app.defaultAvatar}
      description={userInfo?.desc}
      onTabChange={setTab}
      tabs={tabs}
      title={$t('page.auth.profile')}
      userName={userInfo?.realName}
    >
      <h3 className="mb-0 text-base font-semibold">{tabs.find((t) => t.value === tab)?.label}</h3>
      <Divider />
      {tab === 'basic' && <BaseSetting />}
      {tab === 'security' && <SecuritySetting />}
      {tab === 'password' && <PasswordSetting />}
      {tab === 'notice' && <NotificationSetting />}
      {tab === 'basic' && (
        <div className="mt-2 text-xs text-muted-foreground">
          <Button size="small" type="link">
            ارسال درخواست تغییر آواتار
          </Button>
        </div>
      )}
    </Profile>
  );
}
