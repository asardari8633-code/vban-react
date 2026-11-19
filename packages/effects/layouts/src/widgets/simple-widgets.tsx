import { useEffect, useState } from 'react';

import { App, Dropdown, Modal, Radio } from 'antd';

import { useFullscreen, useRefresh } from '@vben/hooks';
import { Globe, Languages, Maximize, Minimize, RotateCw } from '@vben/icons';
import { $t, SUPPORT_LANGUAGES, loadLocalesMap } from '@vben/locales';
import { updatePreferences, usePreferences } from '@vben/preferences';
import { useTimezoneStore } from '@vben/stores';
import { VbenIconButton } from '@vben-core/base-ui';

/**
 * دکمه‌ی تمام‌صفحه
 */
function FullscreenButton() {
  const { isFullscreen, toggle } = useFullscreen();
  return (
    <VbenIconButton
      onClick={() => void toggle()}
      tooltip={isFullscreen ? $t('ui.widgets.exitFullscreen') : $t('ui.widgets.fullscreen')}
    >
      {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
    </VbenIconButton>
  );
}

/**
 * دکمه‌ی تازه‌سازی صفحه‌ی فعلی
 */
function RefreshButton() {
  const { refresh } = useRefresh();
  const [spinning, setSpinning] = useState(false);
  return (
    <VbenIconButton
      onClick={async () => {
        setSpinning(true);
        await refresh();
        setTimeout(() => setSpinning(false), 400);
      }}
      tooltip={$t('common.refresh')}
    >
      <RotateCw className={spinning ? 'size-4 animate-spin' : 'size-4'} />
    </VbenIconButton>
  );
}

/**
 * انتخاب زبان (فقط در صورت وجود بیش از یک زبان نمایش داده می‌شود)
 */
function LanguageToggle() {
  const { preferences } = usePreferences();
  if (SUPPORT_LANGUAGES.length <= 1) return null;
  return (
    <Dropdown
      menu={{
        items: SUPPORT_LANGUAGES.map((item) => ({ key: item.value, label: item.label })),
        onClick: async ({ key }) => {
          updatePreferences({ app: { locale: key } });
          await loadLocalesMap(key);
        },
        selectable: true,
        selectedKeys: [preferences.app.locale],
      }}
    >
      <span>
        <VbenIconButton tooltip={$t('preferences.language')}>
          <Languages className="size-4" />
        </VbenIconButton>
      </span>
    </Dropdown>
  );
}

/**
 * انتخاب منطقه‌ی زمانی
 */
function TimezoneButton() {
  const timezone = useTimezoneStore((s) => s.timezone);
  const setTimezone = useTimezoneStore((s) => s.setTimezone);
  const loadOptions = useTimezoneStore((s) => s.loadTimezoneOptions);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(timezone);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ label: string; timezone: string }[]>([]);
  const { message } = App.useApp();

  useEffect(() => {
    if (!open) return;
    setValue(timezone);
    void loadOptions().then(setOptions);
  }, [open, timezone, loadOptions]);

  return (
    <>
      <VbenIconButton onClick={() => setOpen(true)} tooltip={$t('ui.widgets.timezone.setTimezone')}>
        <Globe className="size-4" />
      </VbenIconButton>
      <Modal
        centered
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        onOk={async () => {
          setLoading(true);
          try {
            await setTimezone(value);
            message.success($t('ui.widgets.timezone.setSuccess'));
            setOpen(false);
          } finally {
            setLoading(false);
          }
        }}
        open={open}
        title={$t('ui.widgets.timezone.setTimezone')}
      >
        <Radio.Group
          className="flex! flex-col gap-2 py-2"
          onChange={(e) => setValue(e.target.value)}
          options={options.map((item) => ({ label: item.label, value: item.timezone }))}
          value={value}
        />
      </Modal>
    </>
  );
}

export { FullscreenButton, LanguageToggle, RefreshButton, TimezoneButton };
