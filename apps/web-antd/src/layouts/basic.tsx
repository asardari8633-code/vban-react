import type { NotificationItem } from '@vben/layouts';

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import { BookOpenText, CircleHelp, SvgGithubIcon, UserRoundPen } from '@vben/icons';
import {
  BasicLayout as VbenBasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { $t } from '#/locales';
import { logout } from '#/store/auth';
import LoginForm from '#/views/_core/authentication/login';

const initialNotifications: NotificationItem[] = [
  {
    avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
    date: '۳ ساعت پیش',
    id: 1,
    isRead: true,
    message: 'گزارش‌های هفتگی تیم آماده‌ی بررسی هستند.',
    title: '۱۴ گزارش هفتگی جدید دریافت شد',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: 'همین الان',
    id: 2,
    isRead: false,
    message: 'به نظر شما در بحث «طراحی داشبورد» پاسخ داده شد.',
    title: 'سارا به شما پاسخ داد',
  },
  {
    avatar: 'https://avatar.vercel.sh/2',
    date: '۱۴۰۳/۰۱/۰۱',
    id: 3,
    isRead: false,
    message: 'یک نظر جدید روی وظیفه‌ی شما ثبت شد.',
    title: 'علی برای شما نظر گذاشت',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '۱ روز پیش',
    id: 4,
    isRead: false,
    message: 'جلسه‌ی برنامه‌ریزی فردا ساعت ۱۰ صبح برگزار می‌شود.',
    title: 'یادآوری کار',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '۱ روز پیش',
    id: 5,
    isRead: false,
    link: '/dashboard/workspace',
    message: 'برای رفتن به میز کار کلیک کنید.',
    title: 'نمونه‌ی هدایت به میز کار',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '۱ روز پیش',
    id: 6,
    isRead: false,
    link: 'https://doc.vben.pro',
    message: 'برای باز شدن لینک خارجی کلیک کنید.',
    title: 'نمونه‌ی لینک خارجی',
  },
];

/**
 * چیدمان پایه‌ی برنامه با ابزارک‌های اختصاصی
 */
function BasicLayout() {
  const navigate = useNavigate();
  const userInfo = useUserStore((s) => s.userInfo);
  const loginExpired = useAccessStore((s) => s.loginExpired);
  const { isDark, preferences } = usePreferences();
  const { destroyWatermark, updateWatermark } = useWatermark();
  const [notifications, setNotifications] = useState(initialNotifications);

  const avatar = userInfo?.avatar || preferences.app.defaultAvatar;
  const showDot = notifications.some((item) => !item.isRead);

  const menus = useMemo(
    () => [
      { handler: () => navigate('/profile'), icon: UserRoundPen, text: $t('page.auth.profile') },
      { handler: () => openWindow(VBEN_DOC_URL), icon: BookOpenText, text: $t('ui.widgets.document') },
      { handler: () => openWindow(VBEN_GITHUB_URL), icon: SvgGithubIcon, text: 'GitHub' },
      { handler: () => openWindow(`${VBEN_GITHUB_URL}/issues`), icon: CircleHelp, text: $t('ui.widgets.qa') },
    ],
    [navigate],
  );

  // واترمارک بر اساس تنظیمات
  useEffect(() => {
    if (preferences.app.watermark) {
      updateWatermark({
        content: preferences.app.watermarkContent || `${userInfo?.username ?? ''} - ${userInfo?.realName ?? ''}`,
      });
    } else {
      destroyWatermark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.app.watermark, preferences.app.watermarkContent, userInfo, isDark]);

  function handleClick(item: NotificationItem) {
    if (!item.link) return;
    if (/^https?:\/\//.test(item.link)) window.open(item.link, '_blank');
    else navigate(item.link);
  }

  return (
    <VbenBasicLayout
      extra={
        <AuthenticationLoginExpiredModal avatar={avatar} open={loginExpired}>
          <LoginForm />
        </AuthenticationLoginExpiredModal>
      }
      lockScreen={<LockScreen avatar={avatar} onToLogin={() => void logout()} />}
      notification={
        <Notification
          dot={showDot}
          notifications={notifications}
          onClear={() => setNotifications([])}
          onClick={handleClick}
          onMakeAll={() => setNotifications((list) => list.map((item) => ({ ...item, isRead: true })))}
          onRead={(item) =>
            setNotifications((list) => list.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)))
          }
          onRemove={(item) => setNotifications((list) => list.filter((n) => n.id !== item.id))}
        />
      }
      onClearPreferencesAndLogout={() => void logout(false)}
      userDropdown={
        <UserDropdown
          avatar={avatar}
          description="ann.vben@gmail.com"
          menus={menus}
          onLogout={() => void logout(false)}
          tagText="Pro"
          text={userInfo?.realName}
        />
      }
    />
  );
}

export { BasicLayout };
