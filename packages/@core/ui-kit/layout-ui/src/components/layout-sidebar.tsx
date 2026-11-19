import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react';

import { useEffect, useRef } from 'react';

import { VbenScrollbar } from '@vben-core/base-ui';
import { useScrollLock } from '@vben-core/composables';
import { cn, isRtl } from '@vben-core/shared';

import { SidebarCollapseButton, SidebarFixedButton } from './sidebar-buttons';

interface LayoutSidebarProps {
  children?: ReactNode;
  collapse: boolean;
  collapseHeight?: number;
  collapseLabel?: string;
  collapseWidth: number;
  domVisible: boolean;
  draggable: boolean;
  expandedWidth: number;
  expandOnHover: boolean;
  expandOnHovering: boolean;
  extra?: ReactNode;
  extraCollapse: boolean;
  extraTitle?: ReactNode;
  extraTitleHeight?: number;
  extraVisible: boolean;
  extraWidth: number;
  fixedExtra: boolean;
  headerHeight: number;
  isMobile: boolean;
  isSidebarMixed: boolean;
  logo?: ReactNode;
  marginTop: number;
  mixedWidth: number;
  onCollapseChange: (value: boolean) => void;
  onExpandOnHoverChange: (value: boolean) => void;
  onExpandOnHoveringChange: (value: boolean) => void;
  onExtraCollapseChange: (value: boolean) => void;
  onExtraVisibleChange: (value: boolean) => void;
  onLeave?: () => void;
  onWidthChange?: (value: number) => void;
  show: boolean;
  showCollapseButton: boolean;
  showFixedButton: boolean;
  theme: string;
  themeSub: string;
  width: number;
  zIndex: number;
}

/**
 * نوار کناری چیدمان: یک placeholder در جریان صفحه + aside ثابت
 */
function LayoutSidebar(props: LayoutSidebarProps) {
  const {
    children,
    collapse,
    collapseHeight = 42,
    collapseLabel,
    collapseWidth,
    domVisible,
    draggable,
    expandOnHover,
    expandOnHovering,
    extra,
    extraCollapse,
    extraTitle,
    extraTitleHeight,
    extraVisible,
    extraWidth,
    fixedExtra,
    headerHeight,
    isMobile,
    isSidebarMixed,
    logo,
    marginTop,
    mixedWidth,
    onCollapseChange,
    onExpandOnHoverChange,
    onExpandOnHoveringChange,
    onExtraCollapseChange,
    onExtraVisibleChange,
    onLeave,
    onWidthChange,
    show,
    showCollapseButton,
    showFixedButton,
    theme,
    themeSub,
    width,
    zIndex,
  } = props;

  const asideRef = useRef<HTMLElement>(null);
  const dragCleanup = useRef<(() => void) | null>(null);

  // قفل اسکرول هنگام hover در حالت دوستونه
  useScrollLock(isSidebarMixed && expandOnHovering && !expandOnHover);

  useEffect(() => () => dragCleanup.current?.(), []);

  const extraPanelExpanded =
    isSidebarMixed && show && !collapse && extraVisible && (fixedExtra || expandOnHover || expandOnHovering);

  function getMenuWidthValue(isHiddenDom: boolean) {
    let value = width === 0 ? 0 : width + (extraPanelExpanded ? extraWidth : 0);
    if (isHiddenDom && expandOnHovering && !expandOnHover) {
      value = isSidebarMixed ? mixedWidth : collapseWidth;
    }
    return value;
  }

  const placeholderWidth = show ? getMenuWidthValue(true) : 0;
  const asideWidth = getMenuWidthValue(false);

  const asideStyle: CSSProperties = {
    '--scroll-shadow': 'var(--sidebar)',
    height: `calc(100% - ${marginTop}px)`,
    marginTop,
    overflow: asideWidth === 0 ? 'hidden' : undefined,
    transform: isMobile ? undefined : show ? 'none' : `translateX(calc(-100% * var(--vben-dir-factor, 1)))`,
    transition: extraPanelExpanded ? 'none' : undefined,
    width: asideWidth,
    zIndex,
  } as CSSProperties;

  const contentWidthStyle: CSSProperties =
    isSidebarMixed && fixedExtra ? { width: mixedWidth } : {};

  const headerStyle: CSSProperties = {
    ...(isSidebarMixed ? { display: 'flex', justifyContent: 'center' } : {}),
    height: headerHeight - 1,
    ...contentWidthStyle,
  };

  const contentStyle: CSSProperties = {
    height: `calc(100% - ${headerHeight + collapseHeight}px)`,
    paddingTop: 8,
    ...contentWidthStyle,
  };

  const extraTitleStyle: CSSProperties = {
    height: extraTitleHeight ?? headerHeight - 1,
  };

  const extraContentStyle: CSSProperties = {
    height: `calc(100% - ${(extraTitleHeight ?? headerHeight) + collapseHeight}px)`,
  };

  function handleMouseEnter(e: ReactMouseEvent) {
    if (isMobile) return;
    if (e.nativeEvent.offsetX < 10 && !isRtl()) return;
    if (expandOnHover) {
      if (isSidebarMixed) onExtraVisibleChange(true);
      return;
    }
    if (!expandOnHovering) onCollapseChange(false);
    if (isSidebarMixed) onExtraVisibleChange(true);
    onExpandOnHoveringChange(true);
  }

  function handleMouseLeave() {
    onLeave?.();
    if (expandOnHover || isMobile) return;
    onExpandOnHoveringChange(false);
    onCollapseChange(true);
    onExtraVisibleChange(false);
  }

  function toggleFixed() {
    const next = !expandOnHover;
    onExpandOnHoverChange(next);
    onCollapseChange(false);
    onExtraVisibleChange(true);
    if (!next) onExpandOnHoveringChange(true);
  }

  function handleDragStart(e: ReactMouseEvent) {
    e.preventDefault();
    const aside = asideRef.current;
    if (!aside) return;
    const rtl = isRtl();
    const min = isSidebarMixed ? width + collapseWidth : collapseWidth;
    const max = isSidebarMixed ? width + 320 : 320;
    const startX = e.clientX;
    const startWidth = aside.getBoundingClientRect().width;
    const prevTransition = aside.style.transition;
    aside.style.transition = 'none';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    let current = startWidth;

    const onMove = (ev: MouseEvent) => {
      const delta = (ev.clientX - startX) * (rtl ? -1 : 1);
      current = Math.min(max, Math.max(min, startWidth + delta));
      aside.style.width = `${current}px`;
    };
    const onUp = () => {
      cleanup();
      aside.style.transition = prevTransition;
      if (isSidebarMixed) {
        const next = current - width;
        onWidthChange?.(next);
        const collapsed = next <= collapseWidth;
        onExtraCollapseChange(collapsed);
      } else {
        onWidthChange?.(current);
        onCollapseChange(current <= collapseWidth);
        onExtraCollapseChange(current <= collapseWidth);
      }
    };
    const cleanup = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      dragCleanup.current = null;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    dragCleanup.current = cleanup;
  }

  const asideVisible = !isMobile || !collapse;

  return (
    <>
      {domVisible && (
        <div
          className={cn('h-full shrink-0 overflow-hidden transition-[flex-basis] duration-300', theme)}
          style={{ flexBasis: placeholderWidth, flexGrow: 0, flexShrink: 0 }}
        />
      )}
      {asideVisible && (
        <aside
          className={cn(
            'fixed start-0 top-0 h-full',
            theme,
            !isMobile && !isSidebarMixed && 'border-e border-border bg-sidebar transition-[width,transform] duration-300 ease-out',
            !isMobile && isSidebarMixed && 'transition-transform duration-300 ease-out',
            isMobile && 'vben-mobile-sidebar border-e border-border bg-sidebar',
          )}
          data-layout-region="sidebar"
          inert={!show || width === 0 ? true : undefined}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={asideRef}
          style={asideStyle}
        >
          <div
            className={cn('relative h-full', isSidebarMixed ? 'bg-sidebar-deep' : 'border-e border-border bg-sidebar')}
            style={{ width: isSidebarMixed ? width : '100%' }}
          >
            {!collapse && !isSidebarMixed && showFixedButton && (
              <SidebarFixedButton expandOnHover={expandOnHover} onToggle={toggleFixed} />
            )}
            {logo && <div style={headerStyle}>{logo}</div>}
            <VbenScrollbar shadow shadowBorder style={contentStyle}>
              {children}
            </VbenScrollbar>
            <div style={{ height: collapseHeight }} />
            {showCollapseButton && !isSidebarMixed && (
              <SidebarCollapseButton collapsed={collapse} label={collapseLabel} onToggle={onCollapseChange} />
            )}
          </div>

          {isSidebarMixed && (
            <div
              className={cn(
                'fixed top-0 h-full overflow-hidden border-e border-border bg-sidebar transition-[inset-inline-start,width] duration-300 ease-out',
                themeSub,
                extraPanelExpanded && 'border-s',
              )}
              style={{
                insetInlineStart: width,
                marginTop,
                height: `calc(100% - ${marginTop}px)`,
                width: extraPanelExpanded ? extraWidth : 0,
                zIndex,
              }}
            >
              {expandOnHover && (
                <SidebarCollapseButton collapsed={extraCollapse} label={collapseLabel} onToggle={onExtraCollapseChange} />
              )}
              {!extraCollapse && <SidebarFixedButton expandOnHover={expandOnHover} onToggle={toggleFixed} />}
              {!extraCollapse && (
                <div className="ps-2" style={extraTitleStyle}>
                  {extraTitle}
                </div>
              )}
              <VbenScrollbar className="border-border py-2" shadow shadowBorder style={extraContentStyle}>
                {extra}
              </VbenScrollbar>
            </div>
          )}

          {draggable && !isMobile && (
            <div
              className="absolute inset-y-0 -end-px z-1000 w-0.5 cursor-col-resize hover:bg-primary"
              onMouseDown={handleDragStart}
            />
          )}
        </aside>
      )}
    </>
  );
}

export { LayoutSidebar };
export type { LayoutSidebarProps };
