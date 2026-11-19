import { useEffect, useState } from 'react';

import { App, Badge, Button, Drawer, Segmented, Tooltip } from 'antd';

import { Copy, RotateCw, Settings, X } from '@vben/icons';
import { $t } from '@vben/locales';
import {
  clearPreferencesCache,
  preferencesManager,
  resetPreferences,
  usePreferences,
} from '@vben/preferences';
import { VbenIconButton } from '@vben-core/base-ui';
import { cn, copyToClipboard, diff, isRtl } from '@vben-core/shared';
import { create } from 'zustand';

import { AppearanceSection, GeneralSection, LayoutSection, ShortcutKeysSection } from './sections';

/** وضعیت باز بودن کشوی تنظیمات (برای باز کردن از هر جا) */
const usePreferencesDrawerStore = create<{ open: boolean }>()(() => ({ open: false }));

function useOpenPreferences() {
  return {
    closePreferences: () => usePreferencesDrawerStore.setState({ open: false }),
    openPreferences: () => usePreferencesDrawerStore.setState({ open: true }),
  };
}

type TabKey = 'appearance' | 'general' | 'layout' | 'shortcutKey';

interface PreferencesDrawerProps {
  onClearPreferencesAndLogout?: () => void;
}

/**
 * کشوی تنظیمات
 */
function PreferencesDrawer({ onClearPreferencesAndLogout }: PreferencesDrawerProps) {
  const open = usePreferencesDrawerStore((s) => s.open);
  const { diffPreference, preferences: p } = usePreferences();
  const [tab, setTab] = useState<TabKey>('appearance');
  const { message } = App.useApp();

  const tabs: { label: string; value: TabKey }[] = [
    { label: $t('preferences.appearance'), value: 'appearance' },
    { label: $t('preferences.layout'), value: 'layout' },
    { label: $t('preferences.shortcutKeys.title'), value: 'shortcutKey' },
    { label: $t('preferences.general'), value: 'general' },
  ];

  async function handleCopy() {
    const changed = diff(preferencesManager.getInitialPreferences(), p) ?? {};
    const text = `const overridesPreferences = defineOverridesPreferences(${JSON.stringify(changed, null, 2)});`;
    await copyToClipboard(text);
    message.success({ content: $t('preferences.copyPreferencesSuccess'), duration: 4 });
  }

  function handleReset() {
    if (!diffPreference) return;
    resetPreferences();
    message.success($t('preferences.resetSuccess'));
  }

  function handleClearAndLogout() {
    clearPreferencesCache();
    resetPreferences();
    usePreferencesDrawerStore.setState({ open: false });
    onClearPreferencesAndLogout?.();
  }

  return (
    <Drawer
      closable={false}
      footer={
        <div className="flex gap-2">
          {p.app.enableCopyPreferences && (
            <Button block disabled={!diffPreference} icon={<Copy className="size-3.5" />} onClick={handleCopy} type="primary">
              {$t('preferences.copyPreferences')}
            </Button>
          )}
          <Button block onClick={handleClearAndLogout}>
            {$t('preferences.clearAndLogout')}
          </Button>
        </div>
      }
      onClose={() => usePreferencesDrawerStore.setState({ open: false })}
      open={open}
      placement={isRtl() ? 'left' : 'right'}
      size={380}
      styles={{ body: { paddingTop: 0 } }}
      title={
        <div className="flex items-center justify-between">
          <div>
            <div>{$t('preferences.title')}</div>
            <div className="text-xs font-normal text-muted-foreground">{$t('preferences.subtitle')}</div>
          </div>
          <div className="flex items-center">
            <Tooltip title={$t('preferences.resetTip')}>
              <span>
                <VbenIconButton disabled={!diffPreference} onClick={handleReset}>
                  <Badge dot={!!diffPreference}>
                    <RotateCw className="size-4" />
                  </Badge>
                </VbenIconButton>
              </span>
            </Tooltip>
            <VbenIconButton onClick={() => usePreferencesDrawerStore.setState({ open: false })}>
              <X className="size-4" />
            </VbenIconButton>
          </div>
        </div>
      }
    >
      <div
        className={cn(
          'z-10 bg-background pt-4 pb-3',
          p.app.enableStickyPreferencesNavigationBar && 'sticky top-0',
        )}
      >
        <Segmented block onChange={(v) => setTab(v as TabKey)} options={tabs} value={tab} />
      </div>
      <div className="pt-2">
        {tab === 'appearance' && <AppearanceSection />}
        {tab === 'layout' && <LayoutSection />}
        {tab === 'shortcutKey' && <ShortcutKeysSection />}
        {tab === 'general' && <GeneralSection />}
      </div>
    </Drawer>
  );
}

/**
 * دکمه‌ی تنظیمات (نسخه‌ی سربرگ یا ثابت کنار صفحه) و میان‌بر Alt+,
 * خود کشو یک بار در چیدمان پایه رندر می‌شود.
 */
function Preferences({ fixed = false }: { fixed?: boolean }) {
  const { globalPreferencesShortcutKey } = usePreferences();

  useEffect(() => {
    if (!globalPreferencesShortcutKey) return;
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'Comma') {
        e.preventDefault();
        usePreferencesDrawerStore.setState((s) => ({ open: !s.open }));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [globalPreferencesShortcutKey]);

  const open = () => usePreferencesDrawerStore.setState({ open: true });

  return (
    <>
      {fixed ? (
        <div
          className="fixed end-0 top-1/2 z-100 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-s-xl bg-primary p-2.5 text-primary-foreground shadow-lg"
          onClick={open}
        >
          <Settings className="size-5" />
        </div>
      ) : (
        <VbenIconButton onClick={open} tooltip={$t('preferences.title')}>
          <Settings className="size-4" />
        </VbenIconButton>
      )}
    </>
  );
}

export { Preferences, PreferencesDrawer, useOpenPreferences, usePreferencesDrawerStore };
