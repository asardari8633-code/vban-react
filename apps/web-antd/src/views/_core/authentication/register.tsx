import type { VbenFormSchema } from '#/adapter/form';

import { useMemo, useState } from 'react';

import { App, Checkbox } from 'antd';

import { AuthenticationRegister } from '@vben/common-ui';

import { $t } from '#/locales';

/**
 * ثبت‌نام
 */
export default function Register() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const formSchema = useMemo<VbenFormSchema[]>(
    () => [
      {
        component: 'Input',
        componentProps: { placeholder: $t('authentication.usernameTip') },
        fieldName: 'username',
        label: $t('authentication.username'),
        rules: [{ message: $t('authentication.usernameTip'), required: true }],
      },
      {
        component: 'InputPassword',
        componentProps: { placeholder: $t('authentication.password') },
        description: $t('authentication.passwordStrength'),
        fieldName: 'password',
        label: $t('authentication.password'),
        rules: [
          { message: $t('authentication.passwordTip'), required: true },
          { message: $t('authentication.passwordStrength'), min: 8 },
        ],
      },
      {
        component: 'InputPassword',
        componentProps: { placeholder: $t('authentication.confirmPassword') },
        fieldName: 'confirmPassword',
        formItemProps: { dependencies: ['password'] },
        label: $t('authentication.confirmPassword'),
        rules: [
          { message: $t('authentication.passwordTip'), required: true },
          ({ getFieldValue }: any) => ({
            validator: (_: unknown, value: string) =>
              !value || getFieldValue('password') === value
                ? Promise.resolve()
                : Promise.reject(new Error($t('authentication.confirmPasswordTip'))),
          }),
        ],
      },
      {
        component: Checkbox,
        fieldName: 'agreePolicy',
        renderComponentContent: () => (
          <span>
            {$t('authentication.agree')}{' '}
            <a className="vben-link">{$t('authentication.privacyPolicy')}</a> و{' '}
            <a className="vben-link">{$t('authentication.terms')}</a>
          </span>
        ),
        rules: [
          {
            validator: (_: unknown, value: boolean) =>
              value ? Promise.resolve() : Promise.reject(new Error($t('authentication.agreeTip'))),
          },
        ],
        valuePropName: 'checked',
      },
    ],
    [],
  );

  return (
    <AuthenticationRegister
      formSchema={formSchema as any}
      loading={loading}
      onSubmit={async (values) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        message.success(`حساب ${values.username} ایجاد شد (نمونه)`);
      }}
    />
  );
}
