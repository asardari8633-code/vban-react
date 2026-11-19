import type { ReactNode } from 'react';

import { Modal } from 'antd';

import { $t } from '@vben/locales';
import { VbenAvatar } from '@vben-core/base-ui';

interface LoginExpiredModalProps {
  avatar?: string;
  children?: ReactNode;
  open: boolean;
  zIndex?: number;
}

/**
 * مودال ورود مجدد هنگام انقضای نشست (حالت loginExpiredMode = modal)
 */
function AuthenticationLoginExpiredModal({ avatar, children, open, zIndex = 2000 }: LoginExpiredModalProps) {
  return (
    <Modal
      centered
      closable={false}
      footer={null}
      keyboard={false}
      mask={{ closable: false }}
      open={open}
      width={460}
      zIndex={zIndex}
    >
      <div className="flex flex-col items-center">
        <VbenAvatar className="-mt-14 mb-4 rounded-full border-4 border-background" size={80} src={avatar} />
        <h3 className="text-xl font-semibold">{$t('authentication.loginAgainTitle')}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{$t('authentication.loginAgainSubTitle')}</p>
      </div>
      <div className="[&_h2]:hidden [&_.mb-7]:mb-0 [&_.mb-7_p]:hidden">{children}</div>
    </Modal>
  );
}

export { AuthenticationLoginExpiredModal };
