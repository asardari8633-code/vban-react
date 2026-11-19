import type { ErrorInfo, ReactNode } from 'react';

import { Activity, Component, Suspense, useRef } from 'react';
import { useOutlet } from 'react-router';

import { Fallback } from '@vben/common-ui';
import { useRoute } from '@vben/hooks';
import { usePreferences } from '@vben/preferences';
import { getTabKey, useTabbarStore } from '@vben/stores';
import { VbenSpinner } from '@vben-core/base-ui';
import { cn } from '@vben-core/shared';

/**
 * مرز خطای هر صفحه: خطای رندر صفحه کل چیدمان را از کار نمی‌اندازد
 */
class PageErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[page error]', error, info.componentStack);
  }

  override render() {
    if (this.state.error) {
      return <Fallback description={this.state.error.message} status="500" />;
    }
    return this.props.children;
  }
}

function PageContainer({ children, transitionName }: { children: ReactNode; transitionName?: string }) {
  return (
    <div className={cn('h-full', transitionName && `page-transition-${transitionName}`)}>
      <PageErrorBoundary>
        <Suspense fallback={<VbenSpinner className="bg-transparent" spinning />}>{children}</Suspense>
      </PageErrorBoundary>
    </div>
  );
}

/**
 * ناحیه‌ی محتوا با پشتیبانی keep-alive:
 * صفحه‌هایی که meta.keepAlive دارند در <Activity mode="hidden"> زنده می‌مانند
 * تا وضعیتشان هنگام جابه‌جایی بین زبانه‌ها حفظ شود.
 */
function LayoutContent() {
  const outlet = useOutlet();
  const route = useRoute();
  const { keepAlive, preferences } = usePreferences();
  const cachedTabs = useTabbarStore((s) => s.cachedTabs);
  const refreshKeys = useTabbarStore((s) => s.refreshKeys);
  const cacheRef = useRef(new Map<string, ReactNode>());

  const key = getTabKey(route);
  const transitionName = preferences.transition.enable ? preferences.transition.name : undefined;
  const shouldCache = keepAlive && !!route.meta?.keepAlive;

  const cache = cacheRef.current;
  if (shouldCache && outlet && !cache.has(key)) {
    cache.set(key, outlet);
  }
  // حذف صفحه‌هایی که زبانه‌شان بسته شده یا کش غیرفعال شده
  for (const cachedKey of [...cache.keys()]) {
    if (cachedKey === key && shouldCache) continue;
    if (!keepAlive || !cachedTabs.has(cachedKey)) cache.delete(cachedKey);
  }

  return (
    <>
      {[...cache.entries()].map(([cachedKey, element]) => (
        <Activity key={`${cachedKey}#${refreshKeys[cachedKey] ?? 0}`} mode={cachedKey === key ? 'visible' : 'hidden'}>
          <PageContainer transitionName={transitionName}>{element}</PageContainer>
        </Activity>
      ))}
      {!shouldCache && (
        <PageContainer key={`${key}#${refreshKeys[key] ?? 0}`} transitionName={transitionName}>
          {outlet}
        </PageContainer>
      )}
    </>
  );
}

export { LayoutContent, PageErrorBoundary };
