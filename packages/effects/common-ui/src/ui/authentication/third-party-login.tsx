import { Button, Divider, Tooltip } from 'antd';

import { $t } from '@vben/locales';
import { IconifyIcon } from '@vben-core/icons';

const providers = [
  { icon: 'logos:google-icon', key: 'google', label: 'authentication.google' },
  { icon: 'mdi:github', key: 'github', label: 'authentication.gitHub' },
  { icon: 'logos:microsoft-icon', key: 'microsoft', label: 'Microsoft' },
  { icon: 'logos:telegram', key: 'telegram', label: 'Telegram' },
];

/**
 * ورود با سرویس‌های دیگر
 */
function ThirdPartyLogin({ onSelect }: { onSelect?: (provider: string) => void }) {
  return (
    <div className="w-full sm:mx-auto md:max-w-md">
      <Divider plain>
        <span className="text-xs text-muted-foreground">{$t('authentication.thirdPartyLogin')}</span>
      </Divider>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {providers.map((item) => (
          <Tooltip key={item.key} title={$t(item.label)}>
            <Button
              icon={<IconifyIcon icon={item.icon} size={18} />}
              onClick={() => onSelect?.(item.key)}
              shape="circle"
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

export { ThirdPartyLogin };
