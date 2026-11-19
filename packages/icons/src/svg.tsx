import type { SVGProps } from 'react';

type SvgIconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function svgProps({ size, ...rest }: SvgIconProps) {
  return { height: size ?? '1em', width: size ?? '1em', ...rest };
}

/** آیکون GitHub */
export function SvgGithubIcon(props: SvgIconProps) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...svgProps(props)}>
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

/** کارت */
export function SvgCardIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 48 48" {...svgProps(props)}>
      <rect fill="#4f8ff7" height="28" rx="4" width="40" x="4" y="10" />
      <rect fill="#2b6de0" height="6" width="40" x="4" y="16" />
      <rect fill="#fff" height="3" rx="1.5" width="12" x="10" y="28" />
      <rect fill="#cfe0ff" height="3" rx="1.5" width="6" x="26" y="28" />
    </svg>
  );
}

/** کیک */
export function SvgCakeIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 48 48" {...svgProps(props)}>
      <rect fill="#f9a8d4" height="14" rx="3" width="34" x="7" y="26" />
      <rect fill="#f472b6" height="8" rx="3" width="28" x="10" y="18" />
      <rect fill="#fde68a" height="8" rx="1" width="3" x="22.5" y="9" />
      <circle cx="24" cy="7" fill="#fb923c" r="2.5" />
      <path d="M7 32c4 3 6-2 10 0s6 3 10 0 6-2 10 0 4 0 4 0" fill="none" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/** دانلود */
export function SvgDownloadIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 48 48" {...svgProps(props)}>
      <rect fill="#34d399" height="36" rx="8" width="36" x="6" y="6" />
      <path d="M24 14v14m-6-6 6 6 6-6M16 34h16" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}

/** زنگ */
export function SvgBellIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 48 48" {...svgProps(props)}>
      <path d="M24 6c-7 0-12 5-12 12v9l-4 6h32l-4-6v-9c0-7-5-12-12-12Z" fill="#fbbf24" />
      <circle cx="24" cy="38" fill="#f59e0b" r="4" />
    </svg>
  );
}

/** آواتار پیش‌فرض */
export function SvgAvatarIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 48 48" {...svgProps(props)}>
      <circle cx="24" cy="24" fill="#c7d2fe" r="22" />
      <circle cx="24" cy="19" fill="#6366f1" r="8" />
      <path d="M9 38c3-7 9-10 15-10s12 3 15 10" fill="#6366f1" />
    </svg>
  );
}

export type { SvgIconProps };
