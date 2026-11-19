import type { VbenFormSchema } from '#/adapter/form';

import { useMemo } from 'react';

import { AuthenticationLogin, SliderCaptcha } from '@vben/common-ui';

import { $t } from '#/locales';
import { authLogin, useAuthStore } from '#/store/auth';

const MOCK_USER_OPTIONS = [
  { label: 'Super (وبن)', value: 'vben' },
  { label: 'Admin (مدیر)', value: 'admin' },
  { label: 'User (کاربر)', value: 'jack' },
];

/**
 * صفحه‌ی ورود
 */
export default function Login() {
  const loading = useAuthStore((s) => s.loginLoading);

  const formSchema = useMemo<VbenFormSchema[]>(
    () => [
      {
        component: 'Select',
        componentProps: (_values, api) => ({
          onChange: (value: string) => {
            const user = MOCK_USER_OPTIONS.find((item) => item.value === value);
            if (user) api.setValues({ password: '123456', username: user.value });
          },
          options: MOCK_USER_OPTIONS,
          placeholder: $t('authentication.selectAccount'),
        }),
        defaultValue: 'vben',
        fieldName: 'selectAccount',
        label: $t('authentication.selectAccount'),
        rules: 'selectRequired',
      },
      {
        component: 'Input',
        componentProps: { placeholder: $t('authentication.usernameTip') },
        defaultValue: 'vben',
        fieldName: 'username',
        label: $t('authentication.username'),
        rules: [{ message: $t('authentication.usernameTip'), required: true }],
      },
      {
        component: 'InputPassword',
        componentProps: { placeholder: $t('authentication.passwordTip') },
        defaultValue: '123456',
        fieldName: 'password',
        label: $t('authentication.password'),
        rules: [{ message: $t('authentication.passwordTip'), required: true }],
      },
      {
        component: SliderCaptcha,
        fieldName: 'captcha',
        rules: [
          {
            validator: (_: unknown, value: boolean) =>
              value ? Promise.resolve() : Promise.reject(new Error($t('authentication.verifyRequiredTip'))),
          },
        ],
      },
    ],
    [],
  );

  return (
    <AuthenticationLogin
      formSchema={formSchema as any}
      loading={loading}
      onSubmit={async (values) => {
        const { captcha: _captcha, selectAccount: _account, ...params } = values;
        await authLogin(params);
      }}
    />
  );
}
