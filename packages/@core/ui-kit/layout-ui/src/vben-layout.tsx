import type { CSSProperties } from 'react';

import type { VbenLayoutProps } from './types';

import { useEffect, useRef, useState } from 'react';

import { useLayoutFooterHeight, useLayoutHeaderHeight, useScroll } from '@vben-core/composables';
import { IconifyIcon } from '@vben-core/icons';
import { VbenIconButton } from '@vben-core/base-ui';
import {
  cn,
  ELEMENT_ID_LAYOUT_SCROLL,
  ELEMENT_ID_MAIN_CONTENT,
} from '@vben-core/shared';

import { LayoutSidebar } from './components/layout-sidebar';
import {
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  LayoutTabbar,
} from './components/layout-parts';
import './style.css';

const HEADER_TRIGGER_DISTANCE = 12;

/**
 * چیدمان اصلی مدیریتی (معادل VbenAdminLayout).
 * از هفت حالت چیدمان پشتیبانی می‌کند و با ویژگی‌های منطقی CSS در RTL هم درست کار می‌کند.
 */
function VbenAdminLayout(props: VbenLayoutProps) {
  const {
    contentCompact = 'wide',
    contentCompactWidth = 1200,
    contentPadding = 0,
    contentPaddingBottom = 0,
    contentPaddingLeft = 0,
    contentPaddingRight = 0,
    contentPaddingTop = 0,
    footerEnable = false,
    footerFixed = true,
    footerHeight = 32,
    headerHeight = 50,
    headerHidden = false,
    headerMode = 'fixed',
    headerTheme,
    headerToggleSidebarButton = true,
    headerVisible = true,
    isMobile = false,
    layout = 'sidebar-nav',
    sidebarCollapse = false,
    sidebarCollapsedButton = true,
    sidebarCollapseShowTitle = false,
    sidebarDraggable = true,
    sidebarEnable = true,
    sidebarExpandOnHover = false,
    sidebarExtraCollapse = false,
    sidebarExtraCollapsedWidth = 60,
    sidebarExtraTitleHeight,
    sidebarExtraVisible = false,
    sidebarFixedButton = true,
    sidebarHidden = false,
    sidebarLogoVisible = true,
    sidebarMixedWidth = 80,
    sidebarTheme = 'dark',
    sidebarThemeSub = 'dark',
    sidebarWidth = 180,
    sideCollapseWidth = 60,
    tabbarEnable = true,
    tabbarHeight = 40,
    zIndex = 200,
    onSideMouseLeave,
    onSidebarCollapseChange,
    onSidebarExpandOnHoverChange,
    onSidebarExtraCollapseChange,
    onSidebarExtraVisibleChange,
    onSidebarWidthChange,
    onToggleSidebar,
  } = props;

  const [expandOnHovering, setExpandOnHovering] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerIsHidden, setHeaderIsHidden] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastMouseY = useRef<null | number>(null);

  /* ---------- حالت‌های چیدمان ---------- */
  const currentLayout = isMobile ? 'sidebar-nav' : layout;
  const isFullContent = currentLayout === 'full-content';
  const isSidebarMixedNav = currentLayout === 'sidebar-mixed-nav';
  const isHeaderNav = currentLayout === 'header-nav';
  const isMixedNav = currentLayout === 'mixed-nav' || currentLayout === 'header-sidebar-nav';
  const isHeaderMixedNav = currentLayout === 'header-mixed-nav';
  const isSideMode =
    currentLayout === 'mixed-nav' ||
    currentLayout === 'sidebar-mixed-nav' ||
    currentLayout === 'sidebar-nav' ||
    currentLayout === 'header-mixed-nav' ||
    currentLayout === 'header-sidebar-nav';

  const isHeaderAutoActive = headerMode === 'auto' && !isMixedNav && !isFullContent;
  const isHeaderOverlayModeActive =
    (headerMode === 'auto' || headerMode === 'auto-scroll') && !isMixedNav && !isFullContent;

  let headerWrapperHeight = 0;
  if (headerVisible && !headerHidden) headerWrapperHeight += headerHeight;
  if (tabbarEnable) headerWrapperHeight += tabbarHeight;

  const getSideCollapseWidth =
    sidebarCollapseShowTitle || isSidebarMixedNav || isHeaderMixedNav
      ? sidebarExtraCollapsedWidth
      : sideCollapseWidth;

  const activeSidebarCollapse = isMobile ? !mobileSidebarOpen : sidebarCollapse;
  const setActiveSidebarCollapse = (value: boolean) => {
    if (isMobile) setMobileSidebarOpen(!value);
    else onSidebarCollapseChange?.(value);
  };

  const sidebarEnableState = !isHeaderNav && sidebarEnable;
  const sidebarMarginTop = isMixedNav && !isMobile ? headerHeight : 0;

  const getSidebarWidth = (() => {
    if (sidebarHidden || !sidebarEnableState) return 0;
    if ((isHeaderMixedNav || isSidebarMixedNav) && !isMobile) return sidebarMixedWidth;
    if (activeSidebarCollapse) return isMobile ? 0 : getSideCollapseWidth;
    return sidebarWidth;
  })();

  const sidebarExtraWidth = sidebarExtraCollapse ? sidebarExtraCollapsedWidth : sidebarWidth;
  const headerFixed =
    isMixedNav || headerMode === 'fixed' || headerMode === 'auto-scroll' || headerMode === 'auto';
  const showSidebar = isSideMode && sidebarEnable && !sidebarHidden;
  const maskVisible = !activeSidebarCollapse && isMobile;

  /* ---------- اندازه‌ی ناحیه‌ی اصلی ---------- */
  const mainStyle = (() => {
    let width = '100%';
    let sidebarAndExtraWidth = 'unset';
    if (
      headerFixed &&
      currentLayout !== 'header-nav' &&
      currentLayout !== 'mixed-nav' &&
      currentLayout !== 'header-sidebar-nav' &&
      showSidebar &&
      !isMobile
    ) {
      const isSideNavEffective =
        (isSidebarMixedNav || isHeaderMixedNav) &&
        sidebarExpandOnHover &&
        sidebarExtraVisible &&
        !activeSidebarCollapse;
      if (isSideNavEffective) {
        const sideWidth = sidebarExtraCollapse ? sidebarExtraCollapsedWidth : sidebarWidth;
        sidebarAndExtraWidth = `${sidebarMixedWidth + sideWidth}px`;
      } else {
        let w = getSidebarWidth;
        if (expandOnHovering && !sidebarExpandOnHover) {
          w = isSidebarMixedNav || isHeaderMixedNav ? sidebarMixedWidth : getSideCollapseWidth;
        }
        sidebarAndExtraWidth = `${w}px`;
      }
      width = `calc(100% - ${sidebarAndExtraWidth})`;
    }
    return { sidebarAndExtraWidth, width };
  })();

  const tabbarStyle = ((): CSSProperties => {
    let width = '100%';
    let marginStart = 0;
    if (isMixedNav && !sidebarHidden && sidebarEnable) {
      const onHoveringWidth = sidebarExpandOnHover ? sidebarWidth : getSideCollapseWidth;
      marginStart = activeSidebarCollapse ? getSideCollapseWidth : onHoveringWidth;
      width = `calc(100% - ${activeSidebarCollapse ? getSidebarWidth : onHoveringWidth}px)`;
    }
    return { marginInlineStart: marginStart, width };
  })();

  /* ---------- اسکرول ---------- */
  const scroll = useScroll(contentRef, (state) => {
    if (isHeaderAutoActive) {
      updateHeaderVisibilityFromMouse(lastMouseY.current, state.y, state.arrivedTop);
      return;
    }
    if (headerMode !== 'auto-scroll' || isMixedNav || isFullContent) return;
    // پنهان شدن با اسکرول به پایین، نمایش با اسکرول به بالا
    setHeaderIsHidden((hidden) => {
      if (state.arrivedTop || state.y < headerWrapperHeight) return false;
      if (state.directionDown) return true;
      if (state.directionUp) return false;
      return hidden;
    });
  });

  function updateHeaderVisibilityFromMouse(mouseY: null | number, y = scroll.y, arrivedTop = scroll.arrivedTop) {
    if (arrivedTop || y < headerWrapperHeight) {
      setHeaderIsHidden(false);
      return;
    }
    if (mouseY === null) return;
    setHeaderIsHidden((hidden) => {
      const inTrigger = mouseY <= HEADER_TRIGGER_DISTANCE;
      const inHeader = !hidden && mouseY <= headerWrapperHeight;
      return !(inTrigger || inHeader);
    });
  }

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      lastMouseY.current = e.clientY;
      if (isHeaderAutoActive) updateHeaderVisibilityFromMouse(e.clientY);
    };
    const onWheel = (e: WheelEvent) => {
      lastMouseY.current = e.clientY;
    };
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('wheel', onWheel);
    };
  });

  useEffect(() => {
    setHeaderIsHidden(false);
  }, [headerMode, isMixedNav, isFullContent]);

  useEffect(() => {
    if (isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  useLayoutHeaderHeight(isFullContent ? 0 : headerWrapperHeight);
  useLayoutFooterHeight(footerHeight);

  const headerHasShadow = scroll.y > 20;

  const layoutScrollStyle = ((): CSSProperties => {
    if (!headerFixed) return { marginTop: 0, paddingTop: 0 };
    if (isHeaderOverlayModeActive) {
      return { marginTop: 0, paddingTop: isFullContent ? 0 : headerWrapperHeight };
    }
    return {
      marginTop:
        !isFullContent && !headerIsHidden && (!isHeaderAutoActive || scroll.y < headerWrapperHeight)
          ? headerWrapperHeight
          : 0,
      paddingTop: 0,
    };
  })();

  const contentStyle: CSSProperties = {
    minHeight: footerEnable && !footerFixed ? undefined : 0,
    paddingBottom: footerEnable && footerFixed ? footerHeight : 0,
  };

  const headerZIndex = zIndex + (isMixedNav ? 1 : 0);

  const headerWrapperStyle: CSSProperties = {
    height: isFullContent ? 0 : headerWrapperHeight,
    insetInlineStart: isMixedNav ? 0 : mainStyle.sidebarAndExtraWidth,
    position: headerFixed ? 'fixed' : 'static',
    top: 0,
    transform: headerFixed
      ? `translate3d(0, ${headerIsHidden || isFullContent ? '-100%' : '0'}, 0)`
      : undefined,
    transitionDuration: headerFixed ? undefined : '0ms',
    width: mainStyle.width,
    willChange: headerFixed ? 'transform' : undefined,
    zIndex: headerZIndex,
  };

  const sidebarZIndex = zIndex + (isMobile || isSideMode ? 1 : -1) + (isMixedNav ? 1 : 0);
  const footerWidth = footerFixed ? mainStyle.width : '100%';
  const sidebarHeaderHeight = isMixedNav || !sidebarLogoVisible ? 0 : headerHeight;

  const showHeaderToggleButton =
    isMobile ||
    (headerToggleSidebarButton && isSideMode && !isSidebarMixedNav && !isMixedNav && !isMobile);
  const showHeaderLogo = !isSideMode || isMixedNav || isMobile;

  function handleHeaderToggle() {
    if (isMobile) setActiveSidebarCollapse(false);
    else onToggleSidebar?.();
  }

  const headerNode = (
      <div
        className={cn(
          'shrink-0 overflow-hidden transition-transform duration-150',
          headerHasShadow && 'shadow-[0_16px_24px_hsl(var(--background))]',
        )}
        data-layout-region="header"
        style={headerWrapperStyle}
      >
        {headerVisible && (
          <LayoutHeader
            fullWidth={!isSideMode}
            height={headerHeight}
            isMobile={isMobile}
            logo={showHeaderLogo ? props.logo : undefined}
            logoVisible={sidebarLogoVisible}
            show={!isFullContent && !headerHidden}
            sidebarWidth={sidebarWidth}
            theme={headerTheme}
            toggleButton={
              showHeaderToggleButton ? (
                <VbenIconButton className="my-0 me-1 rounded-md" onClick={handleHeaderToggle}>
                  <IconifyIcon
                    className="rtl:-scale-x-100"
                    icon={(isMobile ? !activeSidebarCollapse : showSidebar) ? 'ep:fold' : 'ep:expand'}
                  />
                </VbenIconButton>
              ) : null
            }
          >
            {props.header}
          </LayoutHeader>
        )}
        {tabbarEnable && (
          <LayoutTabbar height={tabbarHeight} style={tabbarStyle}>
            {props.tabbar}
          </LayoutTabbar>
        )}
      </div>
  );

  return (
    <div
      className="relative flex h-full min-h-0 w-full overflow-hidden"
      data-layout={currentLayout}
      data-layout-region="layout"
      data-mobile={isMobile}
      data-sidebar-collapsed={activeSidebarCollapse}
    >
      {sidebarEnableState && (
        <LayoutSidebar
          collapse={activeSidebarCollapse}
          collapseWidth={getSideCollapseWidth}
          domVisible={!isMobile}
          draggable={sidebarDraggable}
          expandedWidth={sidebarWidth}
          expandOnHover={sidebarExpandOnHover}
          expandOnHovering={expandOnHovering}
          extra={props.sideExtra}
          extraCollapse={sidebarExtraCollapse}
          extraTitle={props.sideExtraTitle}
          extraTitleHeight={isSidebarMixedNav || isHeaderMixedNav ? sidebarExtraTitleHeight : 0}
          extraVisible={sidebarExtraVisible}
          extraWidth={sidebarExtraWidth}
          fixedExtra={sidebarExpandOnHover}
          headerHeight={sidebarHeaderHeight}
          isMobile={isMobile}
          isSidebarMixed={isSidebarMixedNav || isHeaderMixedNav}
          logo={isSideMode && !isMixedNav && sidebarLogoVisible ? props.logo : undefined}
          marginTop={sidebarMarginTop}
          mixedWidth={sidebarMixedWidth}
          onCollapseChange={setActiveSidebarCollapse}
          onExpandOnHoverChange={(v) => onSidebarExpandOnHoverChange?.(v)}
          onExpandOnHoveringChange={setExpandOnHovering}
          onExtraCollapseChange={(v) => onSidebarExtraCollapseChange?.(v)}
          onExtraVisibleChange={(v) => onSidebarExtraVisibleChange?.(v)}
          onLeave={onSideMouseLeave}
          onWidthChange={onSidebarWidthChange}
          show={showSidebar}
          showCollapseButton={sidebarCollapsedButton}
          showFixedButton={sidebarFixedButton}
          theme={sidebarTheme}
          themeSub={sidebarThemeSub}
          width={getSidebarWidth}
          zIndex={sidebarZIndex}
        >
          {isSidebarMixedNav || isHeaderMixedNav ? props.mixedMenu : props.menu}
        </LayoutSidebar>
      )}

      <div
        className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
        data-layout-region="main"
        ref={mainRef}
      >
        {headerFixed && headerNode}

        <div
          className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-background-deep"
          data-layout-region="scroll"
          id={ELEMENT_ID_LAYOUT_SCROLL}
          ref={contentRef}
          style={layoutScrollStyle}
        >
          {!headerFixed && headerNode}

          <LayoutContent
            contentCompact={contentCompact}
            contentCompactWidth={contentCompactWidth}
            id={ELEMENT_ID_MAIN_CONTENT}
            overlay={props.contentOverlay}
            padding={contentPadding}
            paddingBottom={contentPaddingBottom}
            paddingLeft={contentPaddingLeft}
            paddingRight={contentPaddingRight}
            paddingTop={contentPaddingTop}
            style={contentStyle}
          >
            {props.content}
          </LayoutContent>

          {footerEnable && (
            <LayoutFooter
              fixed={footerFixed}
              height={footerHeight}
              show={!isFullContent}
              width={footerWidth}
              zIndex={zIndex}
            >
              {props.footer}
            </LayoutFooter>
          )}
        </div>
      </div>

      {props.extra}

      {maskVisible && (
        <div
          className="vben-mobile-mask fixed start-0 top-0 size-full bg-overlay"
          data-layout-region="sidebar-mask"
          onClick={() => setActiveSidebarCollapse(true)}
          style={{ zIndex }}
        />
      )}
    </div>
  );
}

export { VbenAdminLayout };
