import type { ComponentRecordType, GenerateMenuAndRoutesOptions, RouteComponent } from '@vben/types';

import { lazy } from 'react';

import { generateAccessible } from '@vben/access';
import { IFrameView } from '@vben/layouts';
import { preferences } from '@vben/preferences';

import { message } from '#/adapter/antd-static';
import { getAllMenusApi } from '#/api';
import { $t } from '#/locales';

const forbiddenComponent = lazy(() => import('#/views/_core/fallback/forbidden'));

/** همه‌ی صفحات برای نگاشت رشته‌ی component در حالت backend */
const pageLoaders = import.meta.glob<{ default: RouteComponent }>('../views/**/*.tsx');

const pageMap: ComponentRecordType = Object.fromEntries(
  Object.entries(pageLoaders).map(([path, loader]) => [path, lazy(loader as any)]),
);

/** کامپوننت‌های چیدمان قابل ارجاع از سرور */
const layoutMap: ComponentRecordType = {
  IFrameView,
};

/**
 * تولید مسیرها و منوهای قابل دسترس بر اساس حالت دسترسی (frontend / backend / mixed)
 */
async function generateAccess(options: Omit<GenerateMenuAndRoutesOptions, 'fetchMenuListAsync'>) {
  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({ content: `${$t('common.loadingMenu')}...`, duration: 1.5 });
      return await getAllMenusApi();
    },
    forbiddenComponent,
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
