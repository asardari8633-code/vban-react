import { Fallback } from '@vben/common-ui';

/**
 * صفحه‌ای که فقط برای نقش Super قابل مشاهده است
 */
export default function AccessVisiblePage() {
  return (
    <Fallback
      description="این صفحه فقط در منوی کاربرانی با نقش Super نمایش داده می‌شود."
      showBack={false}
      status="coming-soon"
      title="فقط برای Super قابل مشاهده"
    />
  );
}
