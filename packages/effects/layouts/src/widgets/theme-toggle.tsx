import type { MouseEvent } from 'react';

import type { ThemeModeType } from '@vben/types';

import { Dropdown } from 'antd';

import { MoonStar, Sun, SunMoon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isDarkTheme, preferences, updatePreferences, usePreferences } from '@vben/preferences';
import { VbenIconButton } from '@vben-core/base-ui';

/**
 * تغییر تم با انیمیشن دایره‌ای (View Transitions API)
 */
function toggleThemeWithTransition(event: MouseEvent | undefined, mode: ThemeModeType) {
  const willDark = isDarkTheme(mode);
  const apply = () => updatePreferences({ theme: { mode } });
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!doc.startViewTransition || !event || reduce || isDarkTheme(preferences.theme.mode) === willDark) {
    apply();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = doc.startViewTransition(apply);
  void transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    document.documentElement.animate(
      { clipPath: willDark ? [...clipPath].reverse() : clipPath },
      {
        duration: 450,
        easing: 'ease-in',
        pseudoElement: willDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    );
  });
}

/**
 * دکمه‌ی تغییر تم (کلیک: روشن/تیره، منوی کشویی: انتخاب حالت)
 */
function ThemeToggle({ shouldOnHover = false }: { shouldOnHover?: boolean }) {
  const { isDark, preferences: prefs } = usePreferences();
  const mode = prefs.theme.mode;

  const items = [
    { icon: <Sun className="size-4" />, key: 'light', label: $t('preferences.theme.light') },
    { icon: <MoonStar className="size-4" />, key: 'dark', label: $t('preferences.theme.dark') },
    { icon: <SunMoon className="size-4" />, key: 'auto', label: $t('preferences.followSystem') },
  ];

  const button = (
    <VbenIconButton
      onClick={(e) => toggleThemeWithTransition(e, isDark ? 'light' : 'dark')}
      tooltip={shouldOnHover ? undefined : $t('ui.widgets.themeToggle')}
    >
      {mode === 'auto' ? (
        <SunMoon className="size-4" />
      ) : isDark ? (
        <MoonStar className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </VbenIconButton>
  );

  if (!shouldOnHover) return button;

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => updatePreferences({ theme: { mode: key as ThemeModeType } }),
        selectable: true,
        selectedKeys: [mode],
      }}
    >
      <span>{button}</span>
    </Dropdown>
  );
}

export { ThemeToggle, toggleThemeWithTransition };
