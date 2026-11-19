import { updatePreferences, usePreferences } from '@vben/preferences';

/**
 * بزرگ‌نمایی محتوا (پنهان کردن سربرگ و نوار کناری)
 */
function useContentMaximize() {
  const { contentIsMaximize } = usePreferences();

  function toggleMaximize() {
    const isMaximize = !contentIsMaximize;
    updatePreferences({
      header: { hidden: isMaximize },
      sidebar: { hidden: isMaximize },
    });
  }

  return { contentIsMaximize, toggleMaximize };
}

export { useContentMaximize };
