import type { BuiltinThemeType, TimezoneOption } from '@vben-core/typings';

interface BuiltinThemePreset {
  color: string;
  darkPrimaryColor?: string;
  primaryColor?: string;
  type: BuiltinThemeType;
}

const BUILT_IN_THEME_PRESETS: BuiltinThemePreset[] = [
  { color: 'hsl(212 100% 45%)', type: 'default' },
  { color: 'hsl(245 82% 67%)', type: 'violet' },
  { color: 'hsl(347 77% 60%)', type: 'pink' },
  { color: 'hsl(42 84% 61%)', type: 'yellow' },
  { color: 'hsl(231 98% 65%)', type: 'sky-blue' },
  { color: 'hsl(161 90% 43%)', type: 'green' },
  {
    color: 'hsl(240 5% 26%)',
    darkPrimaryColor: 'hsl(0 0% 98%)',
    primaryColor: 'hsl(240 5.9% 10%)',
    type: 'zinc',
  },
  { color: 'hsl(181 84% 32%)', type: 'deep-green' },
  { color: 'hsl(211 91% 39%)', type: 'deep-blue' },
  { color: 'hsl(18 89% 40%)', type: 'orange' },
  { color: 'hsl(0 75% 42%)', type: 'rose' },
  {
    color: 'hsl(0 0% 25%)',
    darkPrimaryColor: 'hsl(0 0% 98%)',
    primaryColor: 'hsl(240 5.9% 10%)',
    type: 'neutral',
  },
  {
    color: 'hsl(215 25% 27%)',
    darkPrimaryColor: 'hsl(0 0% 98%)',
    primaryColor: 'hsl(240 5.9% 10%)',
    type: 'slate',
  },
  {
    color: 'hsl(217 19% 27%)',
    darkPrimaryColor: 'hsl(0 0% 98%)',
    primaryColor: 'hsl(240 5.9% 10%)',
    type: 'gray',
  },
  { color: '', type: 'custom' },
];

/**
 * گزینه‌های منطقه‌ی زمانی
 */
const DEFAULT_TIME_ZONE_OPTIONS: TimezoneOption[] = [
  { label: 'Asia/Tehran (GMT+3:30)', offset: 3.5, timezone: 'Asia/Tehran' },
  { label: 'Asia/Dubai (GMT+4)', offset: 4, timezone: 'Asia/Dubai' },
  { label: 'Europe/Istanbul (GMT+3)', offset: 3, timezone: 'Europe/Istanbul' },
  { label: 'Europe/London (GMT0)', offset: 0, timezone: 'Europe/London' },
  { label: 'America/New_York (GMT-5)', offset: -5, timezone: 'America/New_York' },
  { label: 'Asia/Shanghai (GMT+8)', offset: 8, timezone: 'Asia/Shanghai' },
  { label: 'Asia/Tokyo (GMT+9)', offset: 9, timezone: 'Asia/Tokyo' },
];

const COLOR_PRESETS = [...BUILT_IN_THEME_PRESETS].slice(0, 7);

export { BUILT_IN_THEME_PRESETS, COLOR_PRESETS, DEFAULT_TIME_ZONE_OPTIONS };
export type { BuiltinThemePreset };
