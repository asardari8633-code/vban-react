import type { CSSProperties, ReactNode } from 'react';

import type { ContentCompactType } from '@vben-core/typings';

import { cn } from '@vben-core/shared';

interface LayoutHeaderProps {
  children?: ReactNode;
  fullWidth: boolean;
  height: number;
  isMobile: boolean;
  logo?: ReactNode;
  logoVisible?: boolean;
  show: boolean;
  sidebarWidth: number;
  theme?: string;
  toggleButton?: ReactNode;
}

/**
 * سربرگ چیدمان
 */
function LayoutHeader({
  children,
  height,
  isMobile,
  logo,
  logoVisible = true,
  show,
  sidebarWidth,
  theme,
  toggleButton,
}: LayoutHeaderProps) {
  const logoStyle: CSSProperties = logoVisible
    ? { minWidth: isMobile ? 40 : sidebarWidth }
    : { minWidth: 12 };
  return (
    <header
      className={cn(
        'top-0 flex w-full flex-[0_0_auto] items-center border-b border-border bg-header ps-2 transition-[margin-top] duration-200',
        theme,
      )}
      style={{ height, marginTop: show ? 0 : -height }}
    >
      {(logo || (!logoVisible && !isMobile)) && <div style={logoStyle}>{logo}</div>}
      {toggleButton}
      {children}
    </header>
  );
}

interface LayoutTabbarProps {
  children?: ReactNode;
  height: number;
  style?: CSSProperties;
}

function LayoutTabbar({ children, height, style }: LayoutTabbarProps) {
  return (
    <section
      className="flex w-full border-b border-border bg-background transition-colors duration-200"
      style={{ height, ...style }}
    >
      {children}
    </section>
  );
}

interface LayoutContentProps {
  children?: ReactNode;
  contentCompact: ContentCompactType;
  contentCompactWidth: number;
  id?: string;
  overlay?: ReactNode;
  padding: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  style?: CSSProperties;
}

/**
 * ناحیه‌ی محتوای اصلی
 */
function LayoutContent({
  children,
  contentCompact,
  contentCompactWidth,
  id,
  overlay,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  style,
}: LayoutContentProps) {
  const compactStyle: CSSProperties =
    contentCompact === 'compact' ? { margin: '0 auto', width: contentCompactWidth } : {};
  return (
    <main
      className="relative min-w-0"
      id={id}
      style={{
        ...compactStyle,
        flex: 1,
        minWidth: 0,
        padding,
        paddingBottom,
        paddingInlineEnd: paddingRight,
        paddingInlineStart: paddingLeft,
        paddingTop,
        ...style,
      }}
    >
      {overlay && (
        <div className="pointer-events-none sticky top-0 z-150 h-0 w-full" data-layout-region="content-overlay">
          <div
            className="pointer-events-none relative min-h-0 w-full"
            style={{
              height:
                'calc(var(--vben-viewport-height, 100vh) - var(--vben-header-height, 0px) - var(--vben-footer-height, 0px))',
            }}
          >
            {overlay}
          </div>
        </div>
      )}
      {children}
    </main>
  );
}

interface LayoutFooterProps {
  children?: ReactNode;
  fixed?: boolean;
  height: number;
  show?: boolean;
  width: string;
  zIndex: number;
}

function LayoutFooter({ children, fixed, height, show = true, width, zIndex }: LayoutFooterProps) {
  return (
    <footer
      className="bottom-0 w-full shrink-0 bg-background-deep transition-all duration-200"
      data-layout-region="footer"
      style={{
        height,
        marginBottom: show ? 0 : -height,
        position: fixed ? 'fixed' : 'static',
        transform: show ? 'translateY(0)' : 'translateY(100%)',
        width,
        zIndex,
      }}
    >
      {children}
    </footer>
  );
}

export { LayoutContent, LayoutFooter, LayoutHeader, LayoutTabbar };
