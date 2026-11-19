import type { FormSchema, FormValues } from '@vben-core/form-ui';
import type { ReactNode } from 'react';

import { useNavigate } from 'react-router';

import { Button } from 'antd';
import { QRCodeSVG } from 'qrcode.react';

import { $t } from '@vben/locales';
import { useVbenForm } from '@vben-core/form-ui';

import { AuthTitle } from './auth-title';

interface BaseFormPageProps {
  formSchema: FormSchema[];
  loading?: boolean;
  loginPath?: string;
  onSubmit?: (values: FormValues) => Promise<void> | void;
  subTitle?: ReactNode;
  submitButtonText?: ReactNode;
  title?: ReactNode;
}

/**
 * قالب مشترک فرم‌های احراز هویت (ورود با کد، فراموشی رمز، ثبت‌نام)
 */
function AuthFormPage({
  children,
  defaultSubTitle,
  defaultSubmitText,
  defaultTitle,
  formSchema,
  loading,
  loginPath = '/auth/login',
  onSubmit,
  subTitle,
  submitButtonText,
  title,
}: BaseFormPageProps & {
  children?: ReactNode;
  defaultSubTitle: ReactNode;
  defaultSubmitText: ReactNode;
  defaultTitle: ReactNode;
}) {
  const navigate = useNavigate();
  const [Form, formApi] = useVbenForm({
    commonConfig: { componentProps: { size: 'large' } },
    layout: 'vertical',
    schema: formSchema,
    showDefaultActions: false,
  });

  async function handleSubmit() {
    const values = await formApi.validate().catch(() => null);
    if (values) await onSubmit?.(values);
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
      <AuthTitle description={subTitle ?? defaultSubTitle} title={title ?? defaultTitle} />
      <Form />
      {children}
      <Button block className="mt-2" loading={loading} onClick={handleSubmit} size="large" type="primary">
        {submitButtonText ?? defaultSubmitText}
      </Button>
      <Button block className="mt-4" onClick={() => navigate(loginPath)} size="large">
        {$t('common.back')}
      </Button>
    </div>
  );
}

function AuthenticationCodeLogin(props: BaseFormPageProps) {
  return (
    <AuthFormPage
      {...props}
      defaultSubmitText={$t('common.login')}
      defaultSubTitle={$t('authentication.codeSubtitle')}
      defaultTitle={`${$t('authentication.welcomeBack')} 📲`}
    />
  );
}

function AuthenticationForgetPassword(props: BaseFormPageProps) {
  return (
    <AuthFormPage
      {...props}
      defaultSubmitText={$t('authentication.sendResetLink')}
      defaultSubTitle={$t('authentication.forgetPasswordSubtitle')}
      defaultTitle={`${$t('authentication.forgetPassword')} 🤦🏻‍♂️`}
    />
  );
}

function AuthenticationRegister(props: BaseFormPageProps) {
  const navigate = useNavigate();
  return (
    <AuthFormPage
      {...props}
      defaultSubmitText={$t('authentication.signUp')}
      defaultSubTitle={$t('authentication.signUpSubtitle')}
      defaultTitle={`${$t('authentication.createAnAccount')} 🚀`}
    >
      <div className="mt-2 mb-2 text-center text-sm">
        {$t('authentication.alreadyHaveAccount')}{' '}
        <span className="vben-link text-sm font-normal" onClick={() => navigate(props.loginPath ?? '/auth/login')}>
          {$t('authentication.goToLogin')}
        </span>
      </div>
    </AuthFormPage>
  );
}

/**
 * ورود با کد QR
 */
function AuthenticationQrCodeLogin({ loginPath = '/auth/login' }: { loginPath?: string }) {
  const navigate = useNavigate();
  return (
    <div>
      <AuthTitle
        description={$t('authentication.qrcodeSubtitle')}
        title={`${$t('authentication.welcomeBack')} 📱`}
      />
      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-lg border border-border bg-white p-3">
          <QRCodeSVG size={200} value="https://vben.pro" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{$t('authentication.qrcodePrompt')}</p>
      </div>
      <Button block className="mt-4" onClick={() => navigate(loginPath)} size="large">
        {$t('common.back')}
      </Button>
    </div>
  );
}

export {
  AuthenticationCodeLogin,
  AuthenticationForgetPassword,
  AuthenticationQrCodeLogin,
  AuthenticationRegister,
};
export type { BaseFormPageProps };
