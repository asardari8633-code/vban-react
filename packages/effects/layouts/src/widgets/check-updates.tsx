import { useEffect, useRef } from 'react';

import { App, Button } from 'antd';

import { $t } from '@vben/locales';

/**
 * بررسی دوره‌ای نسخه‌ی جدید با مقایسه‌ی اسکریپت‌های index.html
 * (فقط در production فعال است)
 */
function CheckUpdates({ checkUpdatesInterval = 1 }: { checkUpdatesInterval?: number }) {
  const { notification } = App.useApp();
  const lastVersion = useRef<null | string>(null);
  const notified = useRef(false);

  useEffect(() => {
    if (import.meta.env.DEV) return;

    async function getVersionTag() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}?t=${Date.now()}`, {
          cache: 'no-cache',
          method: 'GET',
        });
        const html = await response.text();
        const scripts = html.match(/<script[^>]+src="[^"]+"/g) ?? [];
        return response.headers.get('etag') || scripts.join('|');
      } catch {
        return null;
      }
    }

    async function check() {
      if (document.hidden || notified.current) return;
      const version = await getVersionTag();
      if (!version) return;
      if (lastVersion.current && lastVersion.current !== version) {
        notified.current = true;
        notification.info({
          actions: (
            <Button onClick={() => location.reload()} size="small" type="primary">
              {$t('common.refresh')}
            </Button>
          ),
          description: $t('ui.widgets.checkUpdatesDescription'),
          duration: 0,
          title: $t('ui.widgets.checkUpdatesTitle'),
          onClose: () => {
            notified.current = false;
            lastVersion.current = version;
          },
        });
      } else {
        lastVersion.current = version;
      }
    }

    void check();
    const id = setInterval(check, Math.max(1, checkUpdatesInterval) * 60 * 1000);
    return () => clearInterval(id);
  }, [checkUpdatesInterval, notification]);

  return null;
}

export { CheckUpdates };
