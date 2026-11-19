import type { LayoutType } from '@vben/types';

/*
 * پیش‌نمایش شماتیک چیدمان‌ها. مختصات در جهت LTR رسم شده‌اند و در RTL
 * با scale-x(-1) قرینه می‌شوند تا با جهت واقعی چیدمان هم‌خوان باشند.
 */

const W = 104;
const H = 66;
const primary = 'hsl(var(--primary))';
const muted = 'hsl(var(--primary) / 25%)';
const box = 'hsl(var(--accent))';

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg className="size-full rtl:-scale-x-100" fill="none" viewBox={`0 0 ${W} ${H}`}>
      <rect fill="hsl(var(--background))" height={H} rx="4" width={W} />
      {children}
    </svg>
  );
}

function Lines({ x, y, n = 3, w = 14 }: { n?: number; w?: number; x: number; y: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <rect fill="#fff" fillOpacity={0.7} height="2.5" key={i} rx="1" width={w} x={x} y={y + i * 6} />
      ))}
    </>
  );
}

const icons: Record<LayoutType, () => React.ReactElement> = {
  'full-content': () => (
    <Frame>
      <rect fill={box} height={H - 12} rx="3" width={W - 12} x="6" y="6" />
    </Frame>
  ),
  'header-mixed-nav': () => (
    <Frame>
      <rect fill={primary} height="10" rx="2" width={W} />
      <rect fill={primary} fillOpacity={0.85} height={H - 10} width="12" y="10" />
      <rect fill={muted} height={H - 10} width="20" x="12" y="10" />
      <rect fill={box} height={H - 18} rx="3" width={W - 40} x="36" y="14" />
    </Frame>
  ),
  'header-nav': () => (
    <Frame>
      <rect fill={primary} height="10" rx="2" width={W} />
      <Lines n={1} w={10} x={8} y={4} />
      <rect fill={box} height={H - 18} rx="3" width={W - 12} x="6" y="14" />
    </Frame>
  ),
  'header-sidebar-nav': () => (
    <Frame>
      <rect fill={primary} height="10" rx="2" width={W} />
      <rect fill={muted} height={H - 10} width="22" y="10" />
      <Lines x={4} y={16} />
      <rect fill={box} height={H - 18} rx="3" width={W - 30} x="26" y="14" />
    </Frame>
  ),
  'mixed-nav': () => (
    <Frame>
      <rect fill={primary} height="10" rx="2" width={W} />
      <Lines n={1} w={24} x={30} y={4} />
      <rect fill={muted} height={H - 10} width="22" y="10" />
      <Lines x={4} y={16} />
      <rect fill={box} height={H - 18} rx="3" width={W - 30} x="26" y="14" />
    </Frame>
  ),
  'sidebar-mixed-nav': () => (
    <Frame>
      <rect fill={primary} height={H} rx="2" width="12" />
      <rect fill={muted} height={H} width="20" x="12" />
      <Lines n={4} w={12} x={16} y={8} />
      <rect fill={box} height="8" rx="2" width={W - 38} x="34" y="3" />
      <rect fill={box} height={H - 16} rx="3" width={W - 38} x="34" y="13" />
    </Frame>
  ),
  'sidebar-nav': () => (
    <Frame>
      <rect fill={primary} height={H} rx="2" width="24" />
      <Lines n={4} x={5} y={10} />
      <rect fill={box} height="8" rx="2" width={W - 30} x="27" y="3" />
      <rect fill={box} height={H - 16} rx="3" width={W - 30} x="27" y="13" />
    </Frame>
  ),
};

function LayoutIcon({ layout }: { layout: LayoutType }) {
  const Icon = icons[layout];
  return <Icon />;
}

export { LayoutIcon };
