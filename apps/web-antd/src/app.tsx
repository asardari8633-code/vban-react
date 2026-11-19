import type { Locale } from 'antd/es/locale';

import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router';

import { StyleProvider } from '@ant-design/cssinjs';
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';

import { getLocaleDirection, loadAntdLocale } from '@vben/locales';
import { getEffectivePrimaryColor, usePreferences } from '@vben/preferences';
import { convertToHex } from '@vben/utils';

import { AntdStaticBinder } from './adapter/antd-static';
import { AppRouter } from './router';

/**
 * توکن‌های antd از روی تنظیمات (رنگ اصلی، گردی گوشه‌ها، اندازه‌ی قلم، تیره/فشرده)
 */
function useAntdTheme() {
  const { isDark, preferences } = usePreferences();
  return useMemo(() => {
    const { colorDestructive, colorSuccess, colorWarning, fontSize, radius } = preferences.theme;
    const algorithm = [isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm];
    if (preferences.app.compact) algorithm.push(antdTheme.compactAlgorithm);
    const borderRadius = Math.round(Number.parseFloat(radius) * 16) || 0;
    return {
      algorithm,
      cssVar: { key: 'vben' },
      hashed: false,
      token: {
        borderRadius,
        colorError: convertToHex(colorDestructive),
        colorPrimary: convertToHex(getEffectivePrimaryColor(preferences)),
        colorSuccess: convertToHex(colorSuccess),
        colorWarning: convertToHex(colorWarning),
        fontFamily: 'var(--font-family)',
        fontSize: Math.round(fontSize * 0.875),
        // هم‌رنگ با توکن‌های تیره‌ی طراحی (--card / --popover / --background-deep)
        ...(isDark
          ? {
              colorBgContainer: convertToHex('hsl(222.34 10.43% 12.27%)'),
              colorBgElevated: convertToHex('hsl(0 0% 14.2%)'),
              colorBgLayout: convertToHex('hsl(220 13.06% 9%)'),
            }
          : {}),
      },
    };
  }, [isDark, preferences]);
}

/**
 * ریشه‌ی برنامه: تم antd (از تنظیمات)، جهت RTL، زبان فارسی و روتر
 */
function App() {
  const { preferences } = usePreferences();
  const theme = useAntdTheme();
  const [locale, setLocale] = useState<Locale>();
  const direction = getLocaleDirection(preferences.app.locale);

  useEffect(() => {
    void loadAntdLocale(preferences.app.locale).then(setLocale);
  }, [preferences.app.locale]);

  return (
    <StyleProvider layer>
      <ConfigProvider
        direction={direction}
        locale={locale}
        theme={theme}
      >
        <AntdApp className="h-full">
          <AntdStaticBinder />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AppRouter />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </StyleProvider>
  );
}

export { App };
