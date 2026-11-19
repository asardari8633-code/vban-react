import { generate } from '@ant-design/colors';
import { TinyColor } from '@ctrl/tinycolor';

/**
 * تبدیل رنگ به قالب HSL بدون پوشش hsl() — مثلاً «212 100% 45%»
 * (قالبی که متغیرهای CSS طراحی از آن استفاده می‌کنند)
 */
function convertToHsl(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `hsl(${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
  return a < 1 ? `${hsl} ${a}` : hsl;
}

function convertToHslCssVar(color: string): string {
  const { a, h, l, s } = new TinyColor(color).toHsl();
  const hsl = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  return a < 1 ? `${hsl} / ${a}` : hsl;
}

function convertToRgb(color: string): string {
  return new TinyColor(color).toRgbString();
}

function convertToHex(color: string): string {
  return new TinyColor(color).toHexString();
}

function isValidColor(color?: string) {
  if (!color) return false;
  return new TinyColor(color).isValid;
}

/**
 * آیا رنگ تیره است (برای انتخاب رنگ متن روی آن)
 */
function isDarkColor(color: string) {
  return new TinyColor(color).isDark();
}

interface ColorItem {
  alias?: string;
  color: string;
  name: string;
}

const PALETTE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

/**
 * ساخت طیف رنگی (۵۰ تا ۹۰۰) از یک رنگ پایه و برگرداندن متغیرهای CSS
 * مانند `--primary-500: 212 100% 45%`. کلید ۵۰۰ همان رنگ پایه است.
 * اگر alias داده شود `--{alias}-{key}` و `--{alias}` هم ساخته می‌شود.
 */
function generatorColorVariables(colorItems: ColorItem[]) {
  const colorVariables: Record<string, string> = {};

  colorItems.forEach(({ alias, color, name }) => {
    if (!color || !isValidColor(color)) return;
    const base = new TinyColor(color);
    const colorsHex = generate(base.toHexString());
    let mainColor = convertToHslCssVar(color);
    colorsHex.forEach((hex, index) => {
      const key = PALETTE_KEYS[index];
      // رنگ ۵۰۰ را دقیقاً همان رنگ ورودی قرار می‌دهیم
      const hsl = key === 500 ? mainColor : convertToHslCssVar(hex);
      colorVariables[`--${name}-${key}`] = hsl;
      if (alias) colorVariables[`--${alias}-${key}`] = hsl;
      if (key === 500) mainColor = hsl;
    });
    if (alias) colorVariables[`--${alias}`] = mainColor;
  });
  return colorVariables;
}

export {
  convertToHex,
  convertToHsl,
  convertToHslCssVar,
  convertToRgb,
  generatorColorVariables,
  isDarkColor,
  isValidColor,
  TinyColor,
};
export type { ColorItem };
