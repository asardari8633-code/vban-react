import { useState } from 'react';

import { useRoute } from '@vben/hooks';
import { VbenSpinner } from '@vben-core/base-ui';

/**
 * نمایش صفحه‌ی خارجی درون iframe (meta.iframeSrc)
 */
function IFrameView() {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const src = route.meta?.iframeSrc;

  if (!src) return null;

  return (
    <div className="relative size-full" style={{ height: 'calc(var(--vben-viewport-height, 100vh) - var(--vben-header-height, 0px))' }}>
      <VbenSpinner spinning={loading} />
      <iframe
        className="size-full border-none"
        onLoad={() => setLoading(false)}
        src={src}
        title={route.meta?.title}
      />
    </div>
  );
}

export { IFrameView };
