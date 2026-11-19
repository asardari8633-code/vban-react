import type { ReactNode } from 'react';

import { Fragment } from 'react';

import { usePreferences } from '@vben/preferences';
import { cn } from '@vben-core/shared';

import { GlobalSearch } from '../widgets/global-search';
import { Preferences } from '../widgets/preferences/preferences';
import {
  FullscreenButton,
  LanguageToggle,
  RefreshButton,
  TimezoneButton,
} from '../widgets/simple-widgets';
import { ThemeToggle } from '../widgets/theme-toggle';

interface LayoutHeaderContentProps {
  breadcrumb?: ReactNode;
  menu?: ReactNode;
  notification?: ReactNode;
  userDropdown?: ReactNode;
}

/**
 * محتوای سربرگ: مسیرنما/منو در ابتدا و ابزارک‌ها (به ترتیب تنظیمات) در انتها
 */
function LayoutHeaderContent({ breadcrumb, menu, notification, userDropdown }: LayoutHeaderContentProps) {
  const { isMobile, preferences, preferencesButtonPosition } = usePreferences();
  const { header, widget } = preferences;

  const widgetMap: Record<string, ReactNode> = {
    fullscreen: widget.fullscreen && widget.fullscreenButtonPosition === 'header' ? <FullscreenButton /> : null,
    globalSearch:
      widget.globalSearch && widget.globalSearchButtonPosition === 'header' ? <GlobalSearch /> : null,
    languageToggle:
      widget.languageToggle && widget.languageToggleButtonPosition === 'header' ? <LanguageToggle /> : null,
    notification:
      widget.notification && widget.notificationButtonPosition === 'header' ? notification : null,
    preferences: preferencesButtonPosition.header ? <Preferences /> : null,
    refresh: null,
    themeToggle:
      widget.themeToggle && widget.themeToggleButtonPosition === 'header' ? <ThemeToggle shouldOnHover /> : null,
    timezone: widget.timezone && widget.timezoneButtonPosition === 'header' ? <TimezoneButton /> : null,
  };

  const showRefresh = widget.refresh && widget.refreshButtonPosition === 'header';

  return (
    <>
      {showRefresh && <RefreshButton />}
      {breadcrumb && !isMobile && <div className="hidden items-center lg:flex">{breadcrumb}</div>}
      <div
        className={cn(
          'flex h-full min-w-0 flex-1 items-center',
          header.menuAlign === 'center' && 'justify-center',
          header.menuAlign === 'end' && 'justify-end',
        )}
      >
        {menu}
      </div>
      <div className="flex h-full min-w-0 shrink-0 items-center gap-0.5">
        {widget.order.map((key) => (widgetMap[key] ? <Fragment key={key}>{widgetMap[key]}</Fragment> : null))}
        {userDropdown}
      </div>
    </>
  );
}

export { LayoutHeaderContent };
