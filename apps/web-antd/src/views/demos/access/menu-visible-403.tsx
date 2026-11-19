import { Fallback } from '@vben/common-ui';

/**
 * این صفحه هیچ‌وقت نمایش داده نمی‌شود: منو دیده می‌شود ولی دسترسی به ۴۰۳ هدایت می‌شود
 */
export default function MenuVisible403() {
  return <Fallback status="403" />;
}
