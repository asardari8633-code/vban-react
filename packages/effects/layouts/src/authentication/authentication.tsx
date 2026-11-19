import type { AuthPageLayoutType } from '@vben/types';
import type { ReactNode } from 'react';

import { Outlet } from 'react-router';

import { Dropdown } from 'antd';

import { InspectionPanel, Palette, PanelLeft, PanelRight } from '@vben/icons';
import { $t } from '@vben/locales';
import { COLOR_PRESETS, updatePreferences, usePreferences } from '@vben/preferences';
import { VbenIconButton, VbenLogo } from '@vben-core/base-ui';
import { cn, isRtl } from '@vben-core/shared';

import { Copyright } from '../widgets/copyright';
import { LanguageToggle } from '../widgets/simple-widgets';
import { ThemeToggle } from '../widgets/theme-toggle';
import { SloganIllustration } from './slogan';

interface AuthPageLayoutProps {
  appName?: ReactNode;
  logo?: string;
  logoDark?: string;
  pageDescription?: ReactNode;
  pageTitle?: ReactNode;
  sloganImage?: string;
  /** نمایش نوار ابزار */
  toolbar?: boolean;
}

function AuthToolbar() {
  const { preferences } = usePreferences();
  const layoutItems: { icon: ReactNode; key: AuthPageLayoutType; label: string }[] = [
    { icon: <PanelLeft className="size-4" />, key: 'panel-left', label: $t('authentication.layout.alignLeft') },
    { icon: <InspectionPanel className="size-4" />, key: 'panel-center', label: $t('authentication.layout.center') },
    { icon: <PanelRight className="size-4" />, key: 'panel-right', label: $t('authentication.layout.alignRight') },
  ];
  return (
    <div className="flex items-center rounded-3xl bg-accent px-3 py-1">
      <Dropdown
        menu={{
          items: COLOR_PRESETS.map((preset) => ({
            key: preset.type,
            label: (
              <span className="flex items-center gap-2">
                <span className="inline-block size-4 rounded-full" style={{ background: preset.color }} />
                {$t(`preferences.theme.builtin.${preset.type === 'sky-blue' ? 'skyBlue' : preset.type}`)}
              </span>
            ),
            onClick: () => updatePreferences({ theme: { builtinType: preset.type, colorPrimary: preset.color } }),
          })),
          selectable: true,
          selectedKeys: [preferences.theme.builtinType],
        }}
      >
        <span>
          <VbenIconButton>
            <Palette className="size-4" />
          </VbenIconButton>
        </span>
      </Dropdown>
      <Dropdown
        menu={{
          items: layoutItems.map((item) => ({
            icon: item.icon,
            key: item.key,
            label: item.label,
            onClick: () => updatePreferences({ app: { authPageLayout: item.key } }),
          })),
          selectable: true,
          selectedKeys: [preferences.app.authPageLayout],
        }}
      >
        <span>
          <VbenIconButton>
            <InspectionPanel className="size-4" />
          </VbenIconButton>
        </span>
      </Dropdown>
      <LanguageToggle />
      <ThemeToggle />
    </div>
  );
}

/**
 * چیدمان صفحات احراز هویت (ورود، ثبت‌نام، ...)
 * مقدار panel-left / panel-right به محل «دیداری» فرم اشاره دارد و در RTL هم درست است.
 */
function AuthPageLayout({
  appName,
  logo,
  logoDark,
  pageDescription,
  pageTitle,
  sloganImage,
  toolbar = true,
}: AuthPageLayoutProps) {
  const { authPanelCenter, authPanelLeft, authPanelRight, isDark, preferences } = usePreferences();
  const rtl = isRtl();
  // در جریان flex، فرزند اول در «ابتدا» قرار می‌گیرد (RTL: راست)
  const formFirst = (authPanelLeft && !rtl) || (authPanelRight && rtl);
  const name = appName ?? preferences.app.name;

  const sloganPanel = (
    <div className="relative hidden w-0 flex-1 lg:block">
      <div className="absolute inset-0 size-full bg-background-deep dark:bg-[#070709]">
        <div className="login-background absolute start-0 top-0 size-full" />
        <div className="flex-col-center -enter-x me-20 h-full">
          {sloganImage ? (
            <img alt={String(name)} className="animate-[float_5s_linear_0ms_infinite] h-64" src={sloganImage} />
          ) : (
            <SloganIllustration className="h-72 w-auto animate-[float_5s_linear_0ms_infinite]" />
          )}
          <div className="text-1xl mt-6 font-sans text-foreground lg:text-2xl">
            {pageTitle ?? $t('authentication.pageTitle')}
          </div>
          <div className="mt-2 text-muted-foreground">{pageDescription ?? $t('authentication.pageDesc')}</div>
        </div>
      </div>
    </div>
  );

  const formPanel = (
    <div
      className={cn(
        'flex-col-center relative min-h-full bg-background px-6 py-10 lg:flex-initial lg:px-8',
        authPanelCenter
          ? 'w-full rounded-3xl pb-20 shadow-2xl shadow-primary/5 md:w-[460px] md:bg-background/80 md:backdrop-blur-sm dark:bg-background/90'
          : 'w-full sm:mx-auto md:max-w-md lg:w-[34%] lg:max-w-none',
      )}
    >
      <div className="enter-x mt-6 w-full sm:mx-auto md:max-w-md">
        <Outlet />
      </div>
      {preferences.copyright.enable && (
        <div className="absolute bottom-3 flex text-center text-xs">
          <Copyright {...preferences.copyright} />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-full flex-1 overflow-x-hidden select-none">
      {toolbar && (
        <div className="absolute end-2 top-4 z-10 flex">
          <AuthToolbar />
        </div>
      )}
      {preferences.logo.enable && (
        <div className="absolute start-0 top-0 z-10 flex flex-1">
          <div className="ms-4 mt-4 flex flex-1 items-center sm:start-6 sm:top-6 lg:text-foreground">
            <VbenLogo
              fit={preferences.logo.fit}
              src={isDark && logoDark ? logoDark : (logo ?? preferences.logo.source)}
              text={name}
              theme={isDark ? 'dark' : 'light'}
            />
          </div>
        </div>
      )}
      {authPanelCenter ? (
        <div className="flex-center relative w-full bg-background-deep">
          <div className="login-background absolute start-0 top-0 size-full" />
          {formPanel}
        </div>
      ) : formFirst ? (
        <>
          {formPanel}
          {sloganPanel}
        </>
      ) : (
        <>
          {sloganPanel}
          {formPanel}
        </>
      )}
    </div>
  );
}

export { AuthPageLayout };
export type { AuthPageLayoutProps };
