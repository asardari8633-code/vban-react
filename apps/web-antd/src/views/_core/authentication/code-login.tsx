import type { VbenFormSchema } from '#/adapter/form';

import { useEffect, useMemo, useState } from 'react';

import { App, Button } from 'antd';

import { AuthenticationCodeLogin } from '@vben/common-ui';

import { $t } from '#/locales';

const CODE_LENGTH = 6;

function SendCodeButton() {
  const [countdown, setCountdown] = useState(0);
  const { message } = App.useApp();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <Button
      disabled={countdown > 0}
      onClick={() => {
        setCountdown(60);
        message.success('کد تأیید ارسال شد (نمونه: ۱۲۳۴۵۶)');
      }}
      size="large"
    >
      {countdown > 0 ? $t('authentication.sendText', [countdown]) : $t('authentication.sendCode')}
    </Button>
  );
}

/**
 * ورود با کد تأیید پیامکی
 */
export default function CodeLogin() {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const formSchema = useMemo<VbenFormSchema[]>(
    () => [
      {
        component: 'Input',
        componentProps: { placeholder: $t('authentication.mobile') },
        fieldName: 'phoneNumber',
        label: $t('authentication.mobile'),
        rules: [
          { message: $t('authentication.mobileTip'), required: true },
          { message: $t('authentication.mobileErrortip'), pattern: /^09\d{9}$/ },
        ],
      },
      {
        component: 'Input',
        componentProps: { maxLength: CODE_LENGTH, placeholder: $t('authentication.code') },
        fieldName: 'code',
        label: $t('authentication.code'),
        rules: [{ len: CODE_LENGTH, message: $t('authentication.codeTip', [CODE_LENGTH]), required: true }],
        suffix: <SendCodeButton />,
      },
    ],
    [],
  );

  return (
    <AuthenticationCodeLogin
      formSchema={formSchema as any}
      loading={loading}
      onSubmit={async (values) => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setLoading(false);
        message.info(`نمونه: ورود با ${values.phoneNumber}`);
      }}
    />
  );
}
