import type { BuiltinThemeType, LayoutType, ThemeModeType } from '@vben/types';

import { ColorPicker, Segmented, Slider, Tooltip } from 'antd';

import { Check, MoonStar, Sun, SunMoon } from '@vben/icons';
import { $t } from '@vben/locales';
import {
  BUILT_IN_THEME_PRESETS,
  updatePreferences,
  usePreferences,
} from '@vben/preferences';
import { cn, convertToHsl, isMacOs } from '@vben-core/shared';

import { Block, InputItem, NumberFieldItem, SelectItem, SwitchItem, ToggleItem } from './blocks';
import { LayoutIcon } from './layout-icons';

const positionItems = () => [
  { label: $t('preferences.widget.header'), value: 'header' as const },
  { label: $t('preferences.widget.userDropdown'), value: 'user-dropdown' as const },
  { label: $t('preferences.widget.hidden'), value: 'none' as const },
];

const builtinLabelKey: Record<string, string> = {
  'deep-blue': 'deepBlue',
  'deep-green': 'deepGreen',
  'sky-blue': 'skyBlue',
};

/* ---------------------------------- ظاهر ---------------------------------- */

function AppearanceSection() {
  const { isDark, preferences: p } = usePreferences();
  const theme = p.theme;

  const modes: { icon: React.ReactNode; label: string; value: ThemeModeType }[] = [
    { icon: <Sun className="size-5" />, label: $t('preferences.theme.light'), value: 'light' },
    { icon: <MoonStar className="size-5" />, label: $t('preferences.theme.dark'), value: 'dark' },
    { icon: <SunMoon className="size-5" />, label: $t('preferences.followSystem'), value: 'auto' },
  ];

  const isLightMode = !isDark;
  const layout = p.app.layout;
  const semiDarkSidebarDisabled = !isLightMode || layout === 'header-nav' || layout === 'full-content';

  return (
    <>
      <Block title={$t('preferences.theme.title')}>
        <div className="flex w-full flex-wrap justify-between">
          {modes.map((item) => (
            <div className="flex cursor-pointer flex-col" key={item.value} onClick={() => updatePreferences({ theme: { mode: item.value } })}>
              <div className={cn('outline-box flex-center px-10 py-3.5', theme.mode === item.value && 'outline-box-active')}>
                {item.icon}
              </div>
              <div className="mt-2 text-center text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
        <SwitchItem
          disabled={semiDarkSidebarDisabled}
          onChange={(v) => updatePreferences({ theme: { semiDarkSidebar: v } })}
          tip={$t('preferences.theme.darkSidebarTip')}
          title={$t('preferences.theme.darkSidebar')}
          value={theme.semiDarkSidebar}
        />
        <SwitchItem
          disabled={semiDarkSidebarDisabled || !theme.semiDarkSidebar}
          onChange={(v) => updatePreferences({ theme: { semiDarkSidebarSub: v } })}
          tip={$t('preferences.theme.darkSidebarSubTip')}
          title={$t('preferences.theme.darkSidebarSub')}
          value={theme.semiDarkSidebarSub}
        />
        <SwitchItem
          disabled={!isLightMode}
          onChange={(v) => updatePreferences({ theme: { semiDarkHeader: v } })}
          title={$t('preferences.theme.darkHeader')}
          value={theme.semiDarkHeader}
        />
      </Block>

      <Block title={$t('preferences.theme.builtin.title')}>
        <div className="grid grid-cols-3 gap-3">
          {BUILT_IN_THEME_PRESETS.map((preset) => {
            const active = theme.builtinType === preset.type;
            const isCustom = preset.type === 'custom';
            const label = $t(`preferences.theme.builtin.${builtinLabelKey[preset.type] ?? preset.type}`);
            const swatch = (
              <div
                className={cn('outline-box flex-center group cursor-pointer py-3', active && 'outline-box-active')}
                onClick={() =>
                  !isCustom &&
                  updatePreferences({
                    theme: { builtinType: preset.type as BuiltinThemeType, colorPrimary: preset.color },
                  })
                }
              >
                <div
                  className="relative size-5 rounded-md"
                  style={{
                    background: isCustom
                      ? 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)'
                      : preset.color,
                  }}
                >
                  {active && <Check className="absolute inset-0 m-auto size-3.5 text-white" />}
                </div>
              </div>
            );
            return (
              <div className="flex flex-col" key={preset.type}>
                {isCustom ? (
                  <ColorPicker
                    onChangeComplete={(color) =>
                      updatePreferences({
                        theme: { builtinType: 'custom', colorPrimary: convertToHsl(color.toHexString()) },
                      })
                    }
                    value={theme.colorPrimary}
                  >
                    {swatch}
                  </ColorPicker>
                ) : (
                  swatch
                )}
                <div className="mt-1.5 text-center text-xs text-muted-foreground">{label}</div>
              </div>
            );
          })}
        </div>
      </Block>

      <Block title={$t('preferences.theme.radius')}>
        <Segmented
          block
          onChange={(v) => updatePreferences({ theme: { radius: String(v) } })}
          options={['0', '0.25', '0.5', '0.75', '1'].map((v) => ({ label: v, value: v }))}
          value={theme.radius}
        />
      </Block>

      <Block title={$t('preferences.theme.fontSize')}>
        <Tooltip title={$t('preferences.theme.fontSizeTip')}>
          <Slider
            max={20}
            min={12}
            onChange={(v) => updatePreferences({ theme: { fontSize: v } })}
            value={theme.fontSize}
          />
        </Tooltip>
      </Block>

      <Block title={$t('preferences.other')}>
        <SwitchItem
          onChange={(v) => updatePreferences({ app: { colorWeakMode: v } })}
          title={$t('preferences.theme.weakMode')}
          value={p.app.colorWeakMode}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ app: { colorGrayMode: v } })}
          title={$t('preferences.theme.grayMode')}
          value={p.app.colorGrayMode}
        />
      </Block>
    </>
  );
}

/* --------------------------------- چیدمان --------------------------------- */

function LayoutSection() {
  const { isMobile, preferences: p } = usePreferences();
  const { app, breadcrumb, copyright, footer, header, navigation, sidebar, tabbar, widget } = p;
  const layout = app.layout;

  const layouts: { name: string; tip: string; type: LayoutType }[] = [
    { name: $t('preferences.vertical'), tip: $t('preferences.verticalTip'), type: 'sidebar-nav' },
    { name: $t('preferences.twoColumn'), tip: $t('preferences.twoColumnTip'), type: 'sidebar-mixed-nav' },
    { name: $t('preferences.horizontal'), tip: $t('preferences.horizontalTip'), type: 'header-nav' },
    { name: $t('preferences.headerSidebarNav'), tip: $t('preferences.headerSidebarNavTip'), type: 'header-sidebar-nav' },
    { name: $t('preferences.mixedMenu'), tip: $t('preferences.mixedMenuTip'), type: 'mixed-nav' },
    { name: $t('preferences.headerTwoColumn'), tip: $t('preferences.headerTwoColumnTip'), type: 'header-mixed-nav' },
    { name: $t('preferences.fullContent'), tip: $t('preferences.fullContentTip'), type: 'full-content' },
  ];

  const isSideNav = ['header-mixed-nav', 'header-sidebar-nav', 'mixed-nav', 'sidebar-mixed-nav', 'sidebar-nav'].includes(layout);
  const isMixed = layout === 'sidebar-mixed-nav' || layout === 'header-mixed-nav';
  const isFullContent = layout === 'full-content';
  const headerNavMode = layout === 'header-nav' || layout === 'mixed-nav' || layout === 'header-mixed-nav';

  return (
    <>
      <Block title={$t('preferences.layout')}>
        <div className="grid grid-cols-3 gap-3">
          {layouts.map((item) => (
            <Tooltip key={item.type} title={item.tip}>
              <div className="flex cursor-pointer flex-col" onClick={() => updatePreferences({ app: { layout: item.type } })}>
                <div className={cn('outline-box flex-center p-1', layout === item.type && 'outline-box-active')}>
                  <LayoutIcon layout={item.type} />
                </div>
                <div className="mt-2 text-center text-xs text-muted-foreground">{item.name}</div>
              </div>
            </Tooltip>
          ))}
        </div>
      </Block>

      <Block title={$t('preferences.content')}>
        <ToggleItem
          items={[
            { label: $t('preferences.wide'), value: 'wide' },
            { label: $t('preferences.compact'), value: 'compact' },
          ]}
          onChange={(v) => updatePreferences({ app: { contentCompact: v } })}
          title={$t('preferences.content')}
          value={app.contentCompact}
        />
      </Block>

      <Block title={$t('preferences.sidebar.title')}>
        <SwitchItem
          disabled={!isSideNav || isMobile}
          onChange={(v) => updatePreferences({ sidebar: { enable: v } })}
          title={$t('preferences.sidebar.visible')}
          value={sidebar.enable}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav || isMixed}
          onChange={(v) => updatePreferences({ sidebar: { collapsed: v } })}
          title={$t('preferences.sidebar.collapsed')}
          value={sidebar.collapsed}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav || isMixed}
          onChange={(v) => updatePreferences({ sidebar: { collapsedShowTitle: v } })}
          title={$t('preferences.sidebar.collapsedShowTitle')}
          value={sidebar.collapsedShowTitle}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav}
          onChange={(v) => updatePreferences({ sidebar: { expandOnHover: v } })}
          tip={$t('preferences.sidebar.expandOnHoverTip')}
          title={$t('preferences.sidebar.expandOnHover')}
          value={sidebar.expandOnHover}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav}
          onChange={(v) => updatePreferences({ sidebar: { autoActivateChild: v } })}
          tip={$t('preferences.sidebar.autoActivateChildTip')}
          title={$t('preferences.sidebar.autoActivateChild')}
          value={sidebar.autoActivateChild}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav}
          onChange={(v) => updatePreferences({ sidebar: { collapsedButton: v } })}
          title={`${$t('preferences.sidebar.buttons')}: ${$t('preferences.sidebar.buttonCollapsed')}`}
          value={sidebar.collapsedButton}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav}
          onChange={(v) => updatePreferences({ sidebar: { fixedButton: v } })}
          title={`${$t('preferences.sidebar.buttons')}: ${$t('preferences.sidebar.buttonFixed')}`}
          value={sidebar.fixedButton}
        />
        <SwitchItem
          disabled={!sidebar.enable || !isSideNav}
          onChange={(v) => updatePreferences({ sidebar: { draggable: v } })}
          title={$t('preferences.sidebar.draggable')}
          value={sidebar.draggable}
        />
        <NumberFieldItem
          disabled={!sidebar.enable || !isSideNav}
          max={320}
          min={160}
          onChange={(v) => updatePreferences({ sidebar: { width: v } })}
          step={10}
          title={$t('preferences.sidebar.width')}
          value={sidebar.width}
        />
      </Block>

      <Block title={$t('preferences.header.title')}>
        <SwitchItem
          disabled={isFullContent}
          onChange={(v) => updatePreferences({ header: { enable: v } })}
          title={$t('preferences.header.visible')}
          value={header.enable}
        />
        <SelectItem
          disabled={!header.enable || isFullContent}
          items={[
            { label: $t('preferences.header.modeFixed'), value: 'fixed' },
            { label: $t('preferences.header.modeStatic'), value: 'static' },
            { label: $t('preferences.header.modeAuto'), value: 'auto' },
            { label: $t('preferences.header.modeAutoScroll'), value: 'auto-scroll' },
          ]}
          onChange={(v) => updatePreferences({ header: { mode: v } })}
          title={$t('preferences.mode')}
          value={header.mode}
        />
        <ToggleItem
          disabled={!header.enable || !headerNavMode}
          items={[
            { label: $t('preferences.header.menuAlignStart'), value: 'start' },
            { label: $t('preferences.header.menuAlignCenter'), value: 'center' },
            { label: $t('preferences.header.menuAlignEnd'), value: 'end' },
          ]}
          onChange={(v) => updatePreferences({ header: { menuAlign: v } })}
          title={$t('preferences.header.menuAlign')}
          value={header.menuAlign}
        />
      </Block>

      <Block title={$t('preferences.navigationMenu.title')}>
        <ToggleItem
          disabled={isFullContent}
          items={[
            { label: $t('preferences.rounded'), value: 'rounded' },
            { label: $t('preferences.plain'), value: 'plain' },
          ]}
          onChange={(v) => updatePreferences({ navigation: { styleType: v } })}
          title={$t('preferences.navigationMenu.style')}
          value={navigation.styleType}
        />
        <SwitchItem
          disabled={layout !== 'mixed-nav'}
          onChange={(v) => updatePreferences({ navigation: { split: v } })}
          tip={$t('preferences.navigationMenu.splitTip')}
          title={$t('preferences.navigationMenu.split')}
          value={navigation.split}
        />
        <SwitchItem
          disabled={isFullContent}
          onChange={(v) => updatePreferences({ navigation: { accordion: v } })}
          title={$t('preferences.navigationMenu.accordion')}
          value={navigation.accordion}
        />
      </Block>

      <Block title={$t('preferences.breadcrumb.title')}>
        <SwitchItem
          disabled={headerNavMode || isFullContent}
          onChange={(v) => updatePreferences({ breadcrumb: { enable: v } })}
          title={$t('preferences.breadcrumb.enable')}
          value={breadcrumb.enable}
        />
        <SwitchItem
          disabled={!breadcrumb.enable}
          onChange={(v) => updatePreferences({ breadcrumb: { hideOnlyOne: v } })}
          title={$t('preferences.breadcrumb.hideOnlyOne')}
          value={breadcrumb.hideOnlyOne}
        />
        <SwitchItem
          disabled={!breadcrumb.enable}
          onChange={(v) => updatePreferences({ breadcrumb: { showIcon: v } })}
          title={$t('preferences.breadcrumb.icon')}
          value={breadcrumb.showIcon}
        />
        <SwitchItem
          disabled={!breadcrumb.enable}
          onChange={(v) => updatePreferences({ breadcrumb: { showHome: v } })}
          title={$t('preferences.breadcrumb.home')}
          value={breadcrumb.showHome}
        />
        <ToggleItem
          disabled={!breadcrumb.enable}
          items={[
            { label: $t('preferences.normal'), value: 'normal' },
            { label: $t('preferences.breadcrumb.background'), value: 'background' },
          ]}
          onChange={(v) => updatePreferences({ breadcrumb: { styleType: v } })}
          title={$t('preferences.breadcrumb.style')}
          value={breadcrumb.styleType}
        />
      </Block>

      <Block title={$t('preferences.tabbar.title')}>
        <SwitchItem
          disabled={isFullContent}
          onChange={(v) => updatePreferences({ tabbar: { enable: v } })}
          title={$t('preferences.tabbar.enable')}
          value={tabbar.enable}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { persist: v } })}
          title={$t('preferences.tabbar.persist')}
          value={tabbar.persist}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { visitHistory: v } })}
          tip={$t('preferences.tabbar.visitHistoryTip')}
          title={$t('preferences.tabbar.visitHistory')}
          value={tabbar.visitHistory}
        />
        <NumberFieldItem
          disabled={!tabbar.enable}
          max={30}
          min={0}
          onChange={(v) => updatePreferences({ tabbar: { maxCount: v } })}
          tip={$t('preferences.tabbar.maxCountTip')}
          title={$t('preferences.tabbar.maxCount')}
          value={tabbar.maxCount}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { draggable: v } })}
          title={$t('preferences.tabbar.draggable')}
          value={tabbar.draggable}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { wheelable: v } })}
          tip={$t('preferences.tabbar.wheelableTip')}
          title={$t('preferences.tabbar.wheelable')}
          value={tabbar.wheelable}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { middleClickToClose: v } })}
          title={$t('preferences.tabbar.middleClickClose')}
          value={tabbar.middleClickToClose}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { showIcon: v } })}
          title={$t('preferences.tabbar.icon')}
          value={tabbar.showIcon}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { showMore: v } })}
          title={$t('preferences.tabbar.showMore')}
          value={tabbar.showMore}
        />
        <SwitchItem
          disabled={!tabbar.enable}
          onChange={(v) => updatePreferences({ tabbar: { showMaximize: v } })}
          title={$t('preferences.tabbar.showMaximize')}
          value={tabbar.showMaximize}
        />
        <SelectItem
          disabled={!tabbar.enable}
          items={[
            { label: $t('preferences.tabbar.styleType.chrome'), value: 'chrome' },
            { label: $t('preferences.tabbar.styleType.plain'), value: 'plain' },
            { label: $t('preferences.tabbar.styleType.card'), value: 'card' },
            { label: $t('preferences.tabbar.styleType.brisk'), value: 'brisk' },
          ]}
          onChange={(v) => updatePreferences({ tabbar: { styleType: v } })}
          title={$t('preferences.tabbar.styleType.title')}
          value={tabbar.styleType}
        />
      </Block>

      <Block title={$t('preferences.widget.title')}>
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { globalSearch: v } })}
          title={$t('preferences.widget.globalSearch')}
          value={widget.globalSearch}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { themeToggle: v } })}
          title={$t('preferences.widget.themeToggle')}
          value={widget.themeToggle}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { fullscreen: v } })}
          title={$t('preferences.widget.fullscreen')}
          value={widget.fullscreen}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { notification: v } })}
          title={$t('preferences.widget.notification')}
          value={widget.notification}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { lockScreen: v } })}
          title={$t('preferences.widget.lockScreen')}
          value={widget.lockScreen}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { sidebarToggle: v } })}
          title={$t('preferences.widget.sidebarToggle')}
          value={widget.sidebarToggle}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { refresh: v } })}
          title={$t('preferences.widget.refresh')}
          value={widget.refresh}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ widget: { timezone: v } })}
          title={$t('preferences.widget.timezone')}
          value={widget.timezone}
        />
        <SelectItem
          items={positionItems()}
          onChange={(v) => updatePreferences({ widget: { refreshButtonPosition: v } })}
          title={$t('preferences.widget.refreshPosition')}
          value={widget.refreshButtonPosition}
        />
        <SelectItem
          items={positionItems().filter((i) => i.value !== 'user-dropdown')}
          onChange={(v) => updatePreferences({ widget: { timezoneButtonPosition: v } })}
          title={$t('preferences.widget.timezonePosition')}
          value={widget.timezoneButtonPosition}
        />
      </Block>

      <Block title={$t('preferences.footer.title')}>
        <SwitchItem
          onChange={(v) => updatePreferences({ footer: { enable: v } })}
          title={$t('preferences.footer.visible')}
          value={footer.enable}
        />
        <SwitchItem
          disabled={!footer.enable}
          onChange={(v) => updatePreferences({ footer: { fixed: v } })}
          title={$t('preferences.footer.fixed')}
          value={footer.fixed}
        />
      </Block>

      {copyright.settingShow && (
        <Block title={$t('preferences.copyright.title')}>
          <SwitchItem
            onChange={(v) => updatePreferences({ copyright: { enable: v } })}
            title={$t('preferences.copyright.enable')}
            value={copyright.enable}
          />
          <InputItem
            disabled={!copyright.enable}
            onChange={(v) => updatePreferences({ copyright: { companyName: v } })}
            title={$t('preferences.copyright.companyName')}
            value={copyright.companyName}
          />
          <InputItem
            disabled={!copyright.enable}
            onChange={(v) => updatePreferences({ copyright: { companySiteLink: v } })}
            title={$t('preferences.copyright.companySiteLink')}
            value={copyright.companySiteLink}
          />
          <InputItem
            disabled={!copyright.enable}
            onChange={(v) => updatePreferences({ copyright: { date: v } })}
            title={$t('preferences.copyright.date')}
            value={copyright.date}
          />
          <InputItem
            disabled={!copyright.enable}
            onChange={(v) => updatePreferences({ copyright: { icp: v } })}
            title={$t('preferences.copyright.icp')}
            value={copyright.icp}
          />
          <InputItem
            disabled={!copyright.enable}
            onChange={(v) => updatePreferences({ copyright: { icpLink: v } })}
            title={$t('preferences.copyright.icpLink')}
            value={copyright.icpLink}
          />
        </Block>
      )}
    </>
  );
}

/* -------------------------------- میان‌برها -------------------------------- */

function ShortcutKeysSection() {
  const { preferences: p } = usePreferences();
  const s = p.shortcutKeys;
  const alt = isMacOs() ? '⌥' : 'Alt';
  const ctrl = isMacOs() ? '⌘' : 'Ctrl';
  const kbd = (text: string) => (
    <kbd className="ms-2 rounded-sm bg-accent px-1.5 text-xs" dir="ltr">
      {text}
    </kbd>
  );
  return (
    <Block title={$t('preferences.shortcutKeys.global')}>
      <SwitchItem
        onChange={(v) => updatePreferences({ shortcutKeys: { enable: v } })}
        title={$t('preferences.shortcutKeys.title')}
        value={s.enable}
      />
      <SwitchItem
        disabled={!s.enable}
        onChange={(v) => updatePreferences({ shortcutKeys: { globalSearch: v } })}
        title={<>{$t('preferences.shortcutKeys.search')}{kbd(`${ctrl} K`)}</>}
        value={s.globalSearch}
      />
      <SwitchItem
        disabled={!s.enable}
        onChange={(v) => updatePreferences({ shortcutKeys: { globalLogout: v } })}
        title={<>{$t('preferences.shortcutKeys.logout')}{kbd(`${alt} Q`)}</>}
        value={s.globalLogout}
      />
      <SwitchItem
        disabled={!s.enable}
        onChange={(v) => updatePreferences({ shortcutKeys: { globalLockScreen: v } })}
        title={<>{$t('preferences.shortcutKeys.lockScreen')}{kbd(`${alt} L`)}</>}
        value={s.globalLockScreen}
      />
      <SwitchItem
        disabled={!s.enable}
        onChange={(v) => updatePreferences({ shortcutKeys: { globalPreferences: v } })}
        title={<>{$t('preferences.shortcutKeys.preferences')}{kbd(`${alt} ,`)}</>}
        value={s.globalPreferences}
      />
    </Block>
  );
}

/* --------------------------------- عمومی --------------------------------- */

function GeneralSection() {
  const { preferences: p } = usePreferences();
  const { app, transition } = p;
  return (
    <>
      <Block title={$t('preferences.general')}>
        <SwitchItem
          onChange={(v) => updatePreferences({ app: { dynamicTitle: v } })}
          title={$t('preferences.dynamicTitle')}
          value={app.dynamicTitle}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ app: { watermark: v } })}
          title={$t('preferences.watermark')}
          value={app.watermark}
        />
        {app.watermark && (
          <InputItem
            onChange={(v) => updatePreferences({ app: { watermarkContent: v } })}
            placeholder={$t('preferences.watermarkContent')}
            title={$t('preferences.watermarkContent')}
            value={app.watermarkContent}
          />
        )}
        <SwitchItem
          onChange={(v) => updatePreferences({ app: { enableCheckUpdates: v } })}
          title={$t('preferences.checkUpdates')}
          value={app.enableCheckUpdates}
        />
        <SelectItem
          items={[
            { label: $t('preferences.position.auto'), value: 'auto' },
            { label: $t('preferences.position.header'), value: 'header' },
            { label: $t('preferences.position.fixed'), value: 'fixed' },
          ]}
          onChange={(v) => updatePreferences({ app: { preferencesButtonPosition: v } })}
          title={$t('preferences.position.title')}
          value={app.preferencesButtonPosition}
        />
      </Block>
      <Block title={$t('preferences.animation.title')}>
        <SwitchItem
          onChange={(v) => updatePreferences({ transition: { progress: v } })}
          title={$t('preferences.animation.progress')}
          value={transition.progress}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ transition: { loading: v } })}
          title={$t('preferences.animation.loading')}
          value={transition.loading}
        />
        <SwitchItem
          onChange={(v) => updatePreferences({ transition: { enable: v } })}
          title={$t('preferences.animation.transition')}
          value={transition.enable}
        />
        {transition.enable && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {['fade-slide', 'fade', 'fade-up', 'fade-down'].map((name) => (
              <div
                className={cn('outline-box flex-center h-14 cursor-pointer bg-accent', transition.name === name && 'outline-box-active')}
                key={name}
                onClick={() => updatePreferences({ transition: { name } })}
              >
                <div className={cn('size-6 rounded-md bg-primary/40', `page-transition-${name}`)} key={transition.name} />
              </div>
            ))}
          </div>
        )}
      </Block>
    </>
  );
}

export { AppearanceSection, GeneralSection, LayoutSection, ShortcutKeysSection };
