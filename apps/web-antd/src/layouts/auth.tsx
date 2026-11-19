import { AuthPageLayout } from '@vben/layouts';
import { usePreferences } from '@vben/preferences';

import { $t } from '#/locales';

/**
 * چیدمان صفحات احراز هویت
 */
function AuthLayout() {
  const { preferences } = usePreferences();
  return (
    <AuthPageLayout
      appName={preferences.app.name}
      logo={preferences.logo.source}
      pageDescription={$t('authentication.pageDesc')}
      pageTitle={$t('authentication.pageTitle')}
    />
  );
}

export { AuthLayout };
