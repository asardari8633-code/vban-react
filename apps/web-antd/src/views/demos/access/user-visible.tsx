import { Fallback } from '@vben/common-ui';

/**
 * صفحه‌ای که فقط برای نقش User قابل مشاهده است
 */
export default function AccessVisiblePage() {
  return (
    <Fallback
      description="این صفحه فقط در منوی کاربرانی با نقش User نمایش داده می‌شود."
      showBack={false}
      status="coming-soon"
      title="فقط برای User قابل مشاهده"
    />
  );
}
