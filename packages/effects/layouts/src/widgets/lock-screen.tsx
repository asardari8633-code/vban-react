import type { ReactNode } from 'react';

import { useEffect, useState } from 'react';

import { Button, Form, Input, Modal } from 'antd';

import { LockKeyhole } from '@vben/icons';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';
import { VbenAvatar } from '@vben-core/base-ui';

/**
 * مودال تنظیم رمز قفل صفحه
 */
function useLockScreenModal(avatar?: string, text?: ReactNode) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const lockScreen = useAccessStore((s) => s.lockScreen);

  const node = (
    <Modal
      centered
      footer={null}
      onCancel={() => setOpen(false)}
      open={open}
      title={$t('ui.widgets.lockScreen.title')}
      width={420}
    >
      <div className="mb-6 flex flex-col items-center gap-2 pt-4">
        <VbenAvatar size={64} src={avatar} />
        <div className="text-foreground">{text}</div>
      </div>
      <Form
        form={form}
        onFinish={({ password }) => {
          lockScreen(password);
          setOpen(false);
          form.resetFields();
        }}
      >
        <Form.Item
          name="password"
          rules={[{ message: $t('ui.widgets.lockScreen.placeholder'), required: true }]}
        >
          <Input.Password autoFocus placeholder={$t('ui.widgets.lockScreen.placeholder')} size="large" />
        </Form.Item>
        <Button block htmlType="submit" size="large" type="primary">
          {$t('ui.widgets.lockScreen.screenButton')}
        </Button>
      </Form>
    </Modal>
  );

  return { node, open: () => setOpen(true) };
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

interface LockScreenProps {
  avatar?: string;
  onToLogin?: () => void;
}

/**
 * صفحه‌ی قفل تمام‌صفحه
 */
function LockScreen({ avatar, onToLogin }: LockScreenProps) {
  const now = useClock();
  const password = useAccessStore((s) => s.lockScreenPassword);
  const unlockScreen = useAccessStore((s) => s.unlockScreen);
  const [showUnlockForm, setShowUnlockForm] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const time = new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit' }).format(now);
  const date = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  }).format(now);

  function handleUnlock() {
    if (value === password) {
      unlockScreen();
      setValue('');
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div className="slide-up-enter fixed inset-0 z-2000 flex size-full flex-col items-center justify-center bg-background">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 35%), transparent 45%), radial-gradient(circle at 80% 80%, hsl(var(--success) / 25%), transparent 45%)',
        }}
      />
      {!showUnlockForm ? (
        <div
          className="relative z-1 flex cursor-pointer flex-col items-center gap-4"
          onClick={() => setShowUnlockForm(true)}
        >
          <div className="text-7xl font-bold text-foreground md:text-9xl">{time}</div>
          <div className="text-xl text-muted-foreground">{date}</div>
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <LockKeyhole className="size-4" />
            {$t('ui.widgets.lockScreen.unlock')}
          </div>
        </div>
      ) : (
        <div className="relative z-1 flex w-80 flex-col items-center gap-4">
          <VbenAvatar size={80} src={avatar} />
          <Input.Password
            autoFocus
            onChange={(e) => {
              setValue(e.target.value);
              setError(false);
            }}
            onPressEnter={handleUnlock}
            placeholder={$t('ui.widgets.lockScreen.placeholder')}
            size="large"
            status={error ? 'error' : undefined}
            value={value}
          />
          {error && <div className="text-sm text-destructive">{$t('ui.widgets.lockScreen.errorPasswordTip')}</div>}
          <Button block onClick={handleUnlock} size="large" type="primary">
            {$t('ui.widgets.lockScreen.entry')}
          </Button>
          <div className="flex w-full justify-between">
            <Button onClick={() => setShowUnlockForm(false)} type="link">
              {$t('common.back')}
            </Button>
            <Button
              onClick={() => {
                unlockScreen();
                onToLogin?.();
              }}
              type="link"
            >
              {$t('ui.widgets.lockScreen.backToLogin')}
            </Button>
          </div>
        </div>
      )}
      <div className="absolute bottom-6 z-1 text-muted-foreground">{time}</div>
    </div>
  );
}

export { LockScreen, useLockScreenModal };
