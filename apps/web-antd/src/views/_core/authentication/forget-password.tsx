import type { VbenFormSchema } from '#/adapter/form';

import { useMemo, useState } from 'react';

import { App } from 'antd';

import { AuthenticationForgetPassword } from '@vben/common-ui';

import { $t } from '#/locales';

/**
 * فراموشی رمز عبور
 */
export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const formSchema = useMemo<VbenFormSchema[]>(
    () => [
      {
        component: 'Input',
        componentProps: { placeholder: 'example@example.com' },
        fieldName: 'email',
        label: $t('authentication.email'),
        rules: [
          { message: $t('authentication.emailTip'), required: true },
          { message: $t('authentication.emailValidErrorTip'), type: 'email' },
        ],
      },
    ],
    [],
  );

  return (
    <AuthenticationForgetPassword
      formSchema={formSchema as any}
      loading={loading}
      onSubmit={async (values) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        message.success(`لینک بازیابی به ${values.email} ارسال شد (نمونه)`);
      }}
    />
  );
}
