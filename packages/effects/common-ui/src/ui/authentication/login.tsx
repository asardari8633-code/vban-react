import type { FormSchema, FormValues } from '@vben-core/form-ui';
import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button, Checkbox } from 'antd';

import { $t } from '@vben/locales';
import { useVbenForm } from '@vben-core/form-ui';

import { AuthTitle } from './auth-title';
import { ThirdPartyLogin } from './third-party-login';

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

interface AuthenticationLoginProps {
  codeLoginPath?: string;
  forgetPasswordPath?: string;
  formSchema: FormSchema[];
  loading?: boolean;
  onSubmit?: (values: FormValues) => Promise<void> | void;
  qrCodeLoginPath?: string;
  registerPath?: string;
  showCodeLogin?: boolean;
  showForgetPassword?: boolean;
  showQrcodeLogin?: boolean;
  showRegister?: boolean;
  showRememberMe?: boolean;
  showThirdPartyLogin?: boolean;
  subTitle?: ReactNode;
  submitButtonText?: ReactNode;
  title?: ReactNode;
}

/**
 * فرم ورود با نام کاربری و رمز عبور
 */
function AuthenticationLogin({
  codeLoginPath = '/auth/code-login',
  forgetPasswordPath = '/auth/forget-password',
  formSchema,
  loading = false,
  onSubmit,
  qrCodeLoginPath = '/auth/qrcode-login',
  registerPath = '/auth/register',
  showCodeLogin = true,
  showForgetPassword = true,
  showQrcodeLogin = true,
  showRegister = true,
  showRememberMe = true,
  showThirdPartyLogin = true,
  subTitle,
  submitButtonText,
  title,
}: AuthenticationLoginProps) {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem(REMEMBER_ME_KEY));
  const [Form, formApi] = useVbenForm({
    commonConfig: { componentProps: { size: 'large' } },
    layout: 'vertical',
    schema: formSchema,
    showDefaultActions: false,
  });

  useEffect(() => {
    const username = localStorage.getItem(REMEMBER_ME_KEY);
    if (username) formApi.setFieldValue('username', username);
  }, [formApi]);

  async function handleSubmit() {
    const values = await formApi.validate().catch(() => null);
    if (!values) return;
    localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? values.username : '');
    await onSubmit?.(values);
  }

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          void handleSubmit();
        }
      }}
    >
      <AuthTitle
        description={subTitle ?? $t('authentication.loginSubtitle')}
        title={title ?? `${$t('authentication.welcomeBack')} 👋🏻`}
      />
      <Form />

      {(showRememberMe || showForgetPassword) && (
        <div className="mb-6 flex justify-between">
          <div className="flex-center">
            {showRememberMe && (
              <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
                {$t('authentication.rememberMe')}
              </Checkbox>
            )}
          </div>
          {showForgetPassword && (
            <span className="vben-link text-sm font-normal" onClick={() => navigate(forgetPasswordPath)}>
              {$t('authentication.forgetPassword')}
            </span>
          )}
        </div>
      )}

      <Button block loading={loading} onClick={handleSubmit} size="large" type="primary">
        {submitButtonText ?? $t('common.login')}
      </Button>

      {(showCodeLogin || showQrcodeLogin) && (
        <div className="mt-4 mb-2 flex items-center justify-between gap-3">
          {showCodeLogin && (
            <Button block onClick={() => navigate(codeLoginPath)}>
              {$t('authentication.mobileLogin')}
            </Button>
          )}
          {showQrcodeLogin && (
            <Button block onClick={() => navigate(qrCodeLoginPath)}>
              {$t('authentication.qrcodeLogin')}
            </Button>
          )}
        </div>
      )}

      {showThirdPartyLogin && <ThirdPartyLogin />}

      {showRegister && (
        <div className="mt-3 text-center text-sm">
          {$t('authentication.accountTip')}{' '}
          <span className="vben-link text-sm font-normal" onClick={() => navigate(registerPath)}>
            {$t('authentication.createAccount')}
          </span>
        </div>
      )}
    </div>
  );
}

export { AuthenticationLogin };
export type { AuthenticationLoginProps };
