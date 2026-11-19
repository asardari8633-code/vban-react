import type { MenuRecordRaw } from '@vben/types';
import type { ReactNode } from 'react';

import { useEffect, useMemo } from 'react';

import { Watermark } from 'antd';

import { useWatermarkStore } from '@vben/hooks';
import { $t } from '@vben/locales';
import { preferences, updatePreferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { mapTree } from '@vben/utils';
import { VbenBackTop, VbenLogo } from '@vben-core/base-ui';
import { VbenAdminLayout } from '@vben-core/layout-ui';
import { Menu, NormalMenu } from '@vben-core/menu-ui';
import { ELEMENT_ID_LAYOUT_SCROLL } from '@vben-core/shared';

import { Breadcrumb } from '../widgets/breadcrumb';
import { CheckUpdates } from '../widgets/check-updates';
import { Copyright } from '../widgets/copyright';
import { Preferences, PreferencesDrawer } from '../widgets/preferences/preferences';
import { LayoutContent } from './content';
import { LayoutHeaderContent } from './header';
import { useExtraMenu } from './menu/use-extra-menu';
import { useMixedMenu } from './menu/use-mixed-menu';
import { LayoutTabbar } from './tabbar';

interface BasicLayoutProps {
  /** محتوای اضافه (مثل مودال انقضای ورود) */
  extra?: ReactNode;
  /** صفحه‌ی قفل */
  lockScreen?: ReactNode;
  logoSrc?: string;
  logoSrcDark?: string;
  logoText?: ReactNode;
  notification?: ReactNode;
  onClearPreferencesAndLogout?: () => void;
  onClickLogo?: () => void;
  userDropdown?: ReactNode;
}

/**
 * ترجمه‌ی نام منوها
 * @param deep برای منوی دوستونه فقط سطح اول ترجمه می‌شود
 */
function wrapperMenus(menus: MenuRecordRaw[], deep = true): MenuRecordRaw[] {
  return deep
    ? mapTree(menus, (item) => ({ ...item, children: [], name: $t(item.name) }))
    : menus.map((item) => ({ ...item, name: $t(item.name) }));
}

/**
 * چیدمان پایه‌ی برنامه (معادل BasicLayout در Vben)
 */
function BasicLayout({
  extra,
  lockScreen,
  logoSrc,
  logoSrcDark,
  logoText,
  notification,
  onClearPreferencesAndLogout,
  onClickLogo,
  userDropdown,
}: BasicLayoutProps) {
  const {
    isDark,
    isHeaderMixedNav,
    isHeaderNav,
    isHeaderSidebarNav,
    isMixedNav,
    isMobile,
    isSideMixedNav,
    isSideMode,
    layout,
    preferences: p,
    preferencesButtonPosition,
    sidebarCollapsed,
  } = usePreferences();
  const isLockScreen = useAccessStore((s) => s.isLockScreen);
  const watermark = useWatermarkStore();

  const sidebarTheme = isDark || p.theme.semiDarkSidebar ? 'dark' : 'light';
  const sidebarThemeSub = isDark || p.theme.semiDarkSidebarSub ? 'dark' : 'light';
  const headerTheme = isDark || p.theme.semiDarkHeader ? 'dark' : 'light';
  // تم antd منو: در حالت تیره‌ی کل برنامه، الگوریتم تیره کافی است
  const menuTheme = (t: 'dark' | 'light') => (t === 'dark' && !isDark ? 'dark' : 'light');

  const isMenuRounded = p.navigation.styleType === 'rounded';

  const logoCollapsed = (() => {
    if (isMobile && sidebarCollapsed) return true;
    if (isHeaderNav || isMixedNav || isHeaderSidebarNav) return false;
    return sidebarCollapsed || isSideMixedNav || isHeaderMixedNav;
  })();

  const showHeaderNav = !isMobile && (isHeaderNav || isMixedNav || isHeaderMixedNav);

  const logoTheme =
    !isSideMode || isHeaderSidebarNav || isMixedNav || isMobile ? headerTheme : sidebarTheme;

  const sidebarExtraTitleHeight = p.logo.enable && p.logo.showText ? undefined : 0;

  const {
    handleMenuOpen,
    handleMenuSelect,
    headerActive,
    headerMenus,
    mixHeaderMenus,
    sidebarActive,
    sidebarMenus,
    sidebarVisible,
  } = useMixedMenu();

  const {
    extraActiveMenu,
    extraMenus,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    setSidebarExtraVisible,
    sidebarExtraVisible,
  } = useExtraMenu(mixHeaderMenus);

  // در حالت دوستونه نوار کناری نباید پنهان بماند
  useEffect(() => {
    if (p.app.layout === 'sidebar-mixed-nav' && preferences.sidebar.hidden) {
      updatePreferences({ sidebar: { hidden: false } });
    }
  }, [p.app.layout]);

  const translatedHeaderMenus = useMemo(() => wrapperMenus(headerMenus), [headerMenus]);
  const translatedSidebarMenus = useMemo(() => wrapperMenus(sidebarMenus), [sidebarMenus]);
  const translatedMixMenus = useMemo(() => wrapperMenus(mixHeaderMenus, false), [mixHeaderMenus]);
  const translatedExtraMenus = useMemo(() => wrapperMenus(extraMenus), [extraMenus]);

  const finalLogoSrc = logoSrc || p.logo.source;
  const finalLogoSrcDark = logoSrcDark || p.logo.sourceDark;
  const finalLogoText = logoText || p.app.name;

  const logo = p.logo.enable ? (
    <VbenLogo
      className={sidebarCollapsed && p.sidebar.collapsedShowTitle && !isMixedNav ? 'mx-auto' : isSideMixedNav ? 'flex-center' : ''}
      collapsed={logoCollapsed}
      fit={p.logo.fit}
      fullLogoHeight={p.logo.fullLogoHeight}
      logoMode={p.logo.logoMode}
      onClick={onClickLogo}
      showText={p.logo.showText}
      src={finalLogoSrc}
      srcDark={finalLogoSrcDark}
      text={finalLogoText}
      theme={logoTheme}
    />
  ) : null;

  const content = <LayoutContent />;

  return (
    <VbenAdminLayout
      content={
        watermark.enable ? (
          <Watermark
            content={watermark.content}
            font={{ color: isDark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.12)' }}
            rootClassName="h-full"
          >
            {content}
          </Watermark>
        ) : (
          content
        )
      }
      contentCompact={p.app.contentCompact}
      contentCompactWidth={p.app.contentCompactWidth}
      contentPadding={p.app.contentPadding}
      contentPaddingBottom={p.app.contentPaddingBottom}
      contentPaddingLeft={p.app.contentPaddingLeft}
      contentPaddingRight={p.app.contentPaddingRight}
      contentPaddingTop={p.app.contentPaddingTop}
      extra={
        <>
          {extra}
          {p.app.enableCheckUpdates && <CheckUpdates checkUpdatesInterval={p.app.checkUpdatesInterval} />}
          {p.widget.lockScreen && isLockScreen && lockScreen}
          {preferencesButtonPosition.fixed && <Preferences fixed />}
          <PreferencesDrawer onClearPreferencesAndLogout={onClearPreferencesAndLogout} />
          <VbenBackTop target={`#${ELEMENT_ID_LAYOUT_SCROLL}`} />
        </>
      }
      footer={
        p.footer.enable ? (
          <div className="flex-center size-full">
            {p.copyright.enable && <Copyright {...p.copyright} />}
          </div>
        ) : undefined
      }
      footerEnable={p.footer.enable}
      footerFixed={p.footer.fixed}
      footerHeight={p.footer.height}
      header={
        <LayoutHeaderContent
          breadcrumb={
            !showHeaderNav && p.breadcrumb.enable ? (
              <Breadcrumb
                hideWhenOnlyOne={p.breadcrumb.hideOnlyOne}
                showHome={p.breadcrumb.showHome}
                showIcon={p.breadcrumb.showIcon}
                type={p.breadcrumb.styleType}
              />
            ) : undefined
          }
          menu={
            showHeaderNav ? (
              <Menu
                defaultActive={headerActive}
                menuAlign={p.header.menuAlign}
                menus={translatedHeaderMenus}
                mode="horizontal"
                onSelect={handleMenuSelect}
                rounded={isMenuRounded}
                theme={menuTheme(headerTheme)}
              />
            ) : undefined
          }
          notification={notification}
          userDropdown={userDropdown}
        />
      }
      headerHeight={p.header.height}
      headerHidden={p.header.hidden}
      headerMode={p.header.mode}
      headerTheme={headerTheme}
      headerToggleSidebarButton={p.widget.sidebarToggle}
      headerVisible={p.header.enable}
      isMobile={p.app.isMobile}
      layout={layout}
      logo={logo}
      menu={
        <Menu
          accordion={p.navigation.accordion}
          collapse={p.sidebar.collapsed}
          collapseShowTitle={p.sidebar.collapsedShowTitle}
          defaultActive={sidebarActive}
          menus={translatedSidebarMenus}
          mode="vertical"
          onOpen={handleMenuOpen}
          onSelect={handleMenuSelect}
          rounded={isMenuRounded}
          theme={menuTheme(sidebarTheme)}
        />
      }
      mixedMenu={
        <NormalMenu
          activePath={extraActiveMenu}
          menus={translatedMixMenus}
          onEnter={handleMenuMouseEnter}
          onSelect={(menu) => {
            const original = mixHeaderMenus.find((m) => m.path === menu.path);
            if (original) void handleMixedMenuSelect(original);
          }}
          rounded={isMenuRounded}
          theme={sidebarTheme}
        />
      }
      onSideMouseLeave={handleSideMouseLeave}
      onSidebarCollapseChange={(value) => updatePreferences({ sidebar: { collapsed: value } })}
      onSidebarExpandOnHoverChange={(value) => updatePreferences({ sidebar: { expandOnHover: value } })}
      onSidebarExtraCollapseChange={(value) => updatePreferences({ sidebar: { extraCollapse: value } })}
      onSidebarExtraVisibleChange={setSidebarExtraVisible}
      onSidebarWidthChange={(value) => updatePreferences({ sidebar: { width: value } })}
      onToggleSidebar={() => updatePreferences({ sidebar: { hidden: !preferences.sidebar.hidden } })}
      sideExtra={
        <Menu
          accordion={p.navigation.accordion}
          collapse={p.sidebar.extraCollapse}
          defaultActive={sidebarActive}
          menus={translatedExtraMenus}
          mode="vertical"
          onSelect={handleMenuSelect}
          rounded={isMenuRounded}
          theme={menuTheme(sidebarThemeSub)}
        />
      }
      sideExtraTitle={
        p.logo.enable ? (
          <VbenLogo fit={p.logo.fit} showText={p.logo.showText} text={finalLogoText} theme={sidebarThemeSub} />
        ) : undefined
      }
      sidebarCollapse={p.sidebar.collapsed}
      sidebarCollapsedButton={p.sidebar.collapsedButton}
      sidebarCollapseShowTitle={p.sidebar.collapsedShowTitle}
      sidebarDraggable={p.sidebar.draggable}
      sidebarEnable={sidebarVisible}
      sidebarExpandOnHover={p.sidebar.expandOnHover}
      sidebarExtraCollapse={p.sidebar.extraCollapse}
      sidebarExtraCollapsedWidth={p.sidebar.extraCollapsedWidth}
      sidebarExtraTitleHeight={sidebarExtraTitleHeight}
      sidebarExtraVisible={sidebarExtraVisible}
      sidebarFixedButton={p.sidebar.fixedButton}
      sidebarHidden={p.sidebar.hidden}
      sidebarLogoVisible={p.logo.enable}
      sidebarMixedWidth={p.sidebar.mixedWidth}
      sidebarTheme={sidebarTheme}
      sidebarThemeSub={sidebarThemeSub}
      sidebarWidth={p.sidebar.width}
      sideCollapseWidth={p.sidebar.collapseWidth}
      tabbar={p.tabbar.enable ? <LayoutTabbar showIcon={p.tabbar.showIcon} /> : undefined}
      tabbarEnable={p.tabbar.enable}
      tabbarHeight={p.tabbar.height}
      zIndex={p.app.zIndex}
    />
  );
}

export { BasicLayout };
export type { BasicLayoutProps };
