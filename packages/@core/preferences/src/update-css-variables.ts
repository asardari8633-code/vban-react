import type { Preferences } from './types';

import {
  generatorColorVariables,
  updateCSSVariables as executeUpdateCSSVariables,
} from '@vben-core/shared';

import { BUILT_IN_THEME_PRESETS } from './constants';

function isDarkTheme(theme: string) {
  let dark = theme === 'dark';
  if (theme === 'auto') {
    dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return dark;
}

/**
 * رنگ اصلی مؤثر: برای تم‌های داخلی خاکستری (zinc و …) رنگ متفاوتی در حالت تیره/روشن دارد
 */
function getEffectivePrimaryColor(preferences: Preferences) {
  const { builtinType, colorPrimary, mode } = preferences.theme;
  const preset = BUILT_IN_THEME_PRESETS.find((item) => item.type === builtinType);
  if (preset && (preset.primaryColor || preset.darkPrimaryColor)) {
    const dark = isDarkTheme(mode);
    const color = dark
      ? preset.darkPrimaryColor || preset.primaryColor
      : preset.primaryColor;
    if (color) return color;
  }
  return colorPrimary;
}

/**
 * به‌روزرسانی متغیرهای CSS تم
 */
function updateCSSVariables(preferences: Preferences) {
  const root = document.documentElement;
  if (!root) return;

  const { builtinType, fontSize, mode, radius } = preferences.theme;

  // کلاس dark روی html
  root.classList.toggle('dark', isDarkTheme(mode));
  root.classList.toggle('light', !isDarkTheme(mode));

  // data-theme=[builtinType]
  if (root.dataset.theme !== builtinType) {
    root.dataset.theme = builtinType;
  }

  updateMainColorVariables(preferences);

  root.style.setProperty('--radius', `${radius}rem`);
  root.style.setProperty('--font-size-base', `${fontSize}px`);
  root.style.setProperty('--menu-font-size', `calc(${fontSize}px * 0.875)`);
}

/**
 * ساخت و اعمال طیف رنگ‌های اصلی
 */
function updateMainColorVariables(preference: Preferences) {
  const { colorDestructive, colorSuccess, colorWarning } = preference.theme;
  const colorPrimary = getEffectivePrimaryColor(preference);

  const colorVariables = generatorColorVariables([
    { alias: 'primary', color: colorPrimary, name: 'primary' },
    { alias: 'warning', color: colorWarning, name: 'yellow' },
    { alias: 'success', color: colorSuccess, name: 'green' },
    { alias: 'destructive', color: colorDestructive, name: 'red' },
  ]);

  executeUpdateCSSVariables(colorVariables);
}

/**
 * حالت رنگ‌کوری و خاکستری
 */
function updateColorMode(preference: Preferences) {
  const { colorGrayMode, colorWeakMode } = preference.app;
  const dom = document.documentElement;
  dom.classList.toggle('invert-mode', colorWeakMode);
  dom.classList.toggle('grayscale-mode', colorGrayMode);
}

export { getEffectivePrimaryColor, isDarkTheme, updateColorMode, updateCSSVariables };
