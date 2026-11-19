import { FloatButton } from 'antd';

interface VbenBackTopProps {
  /** سلکتور عنصر اسکرول */
  target: string;
  visibilityHeight?: number;
}

/**
 * دکمه‌ی بازگشت به بالا
 */
function VbenBackTop({ target, visibilityHeight = 200 }: VbenBackTopProps) {
  return (
    <FloatButton.BackTop
      style={{ insetInlineEnd: 24, bottom: 24 }}
      target={() => (document.querySelector(target) as HTMLElement) ?? window}
      visibilityHeight={visibilityHeight}
    />
  );
}

export { VbenBackTop };
