import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  AnalysisChartCard,
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { AnalyticsVisitsSource } from '../analytics/charts';

const projectItems: WorkbenchProjectItem[] = [
  { color: '', content: 'منتظر فرصت نمان، آن را بساز.', date: '۱۴۰۳/۰۱/۱۲', group: 'گروه متن‌باز', icon: 'carbon:logo-github', title: 'Github', url: 'https://github.com' },
  { color: '#00d8ff', content: 'سلامت جسم پایه‌ی رسیدن به هدف است.', date: '۱۴۰۳/۰۱/۱۲', group: 'فنی', icon: 'bx:bxl-react', title: 'React', url: 'https://react.dev' },
  { color: '#1677ff', content: 'امروزت آینده‌ات را می‌سازد.', date: '۱۴۰۳/۰۱/۱۲', group: 'رابط کاربری', icon: 'ant-design:ant-design-outlined', title: 'Ant Design', url: 'https://ant.design' },
  { color: '#3178c6', content: 'هیچ استعدادی مهم‌تر از تلاش نیست.', date: '۱۴۰۳/۰۱/۱۲', group: 'معماری', icon: 'logos:typescript-icon', title: 'TypeScript', url: 'https://www.typescriptlang.org' },
  { color: '#e18525', content: 'اشتیاق از هر مانعی عبور می‌کند.', date: '۱۴۰۳/۰۱/۱۲', group: 'وب', icon: 'ion:logo-html5', title: 'Html5', url: 'https://developer.mozilla.org/fa/docs/Web/HTML' },
  { color: '#EBD94E', content: 'راه را باید رفت، نه فقط به آن فکر کرد.', date: '۱۴۰۳/۰۱/۱۲', group: 'فرانت‌اند', icon: 'ion:logo-javascript', title: 'JavaScript', url: 'https://developer.mozilla.org/fa/docs/Web/JavaScript' },
];

const quickNavItems: WorkbenchQuickNavItem[] = [
  { color: '#1fdaca', icon: 'ion:home-outline', title: 'خانه', url: '/' },
  { color: '#bf0c2c', icon: 'ion:grid-outline', title: 'داشبورد', url: '/dashboard/analytics' },
  { color: '#e18525', icon: 'ion:layers-outline', title: 'کامپوننت‌ها', url: '/demos/features/icons' },
  { color: '#3fb27f', icon: 'ion:settings-outline', title: 'مدیریت سیستم', url: '/system/user' },
  { color: '#4daf1bc9', icon: 'ion:key-outline', title: 'دسترسی‌ها', url: '/demos/access/page-control' },
  { color: '#00d8ff', icon: 'ion:bar-chart-outline', title: 'نمودارها', url: '/dashboard/analytics' },
];

const initialTodos: WorkbenchTodoItem[] = [
  { completed: false, content: 'بازبینی کدهای جدید ارسال‌شده به مخزن و اطمینان از کیفیت و رعایت استانداردها.', date: '۱۴۰۳/۰۵/۰۸ ۱۱:۰۰', title: 'بازبینی کدهای فرانت‌اند' },
  { completed: true, content: 'بررسی و بهینه‌سازی کارایی سامانه و کاهش مصرف پردازنده.', date: '۱۴۰۳/۰۵/۰۸ ۱۱:۰۰', title: 'بهینه‌سازی کارایی' },
  { completed: false, content: 'بررسی امنیتی سامانه برای اطمینان از نبود آسیب‌پذیری یا دسترسی غیرمجاز.', date: '۱۴۰۳/۰۵/۰۸ ۱۱:۰۰', title: 'بررسی امنیتی' },
  { completed: false, content: 'به‌روزرسانی همه‌ی وابستگی‌های npm به آخرین نسخه.', date: '۱۴۰۳/۰۵/۰۸ ۱۱:۰۰', title: 'به‌روزرسانی وابستگی‌ها' },
  { completed: false, content: 'رفع مشکل نمایش رابط کاربری گزارش‌شده توسط کاربران در مرورگرهای مختلف.', date: '۱۴۰۳/۰۵/۰۸ ۱۱:۰۰', title: 'رفع مشکل نمایش' },
];

const trendItems: WorkbenchTrendItem[] = [
  { avatar: 'svg:avatar-1', content: 'در گیت‌هاب پروژه‌ی Vben Admin را منتشر کرد', date: 'همین الان', title: 'ویلیام' },
  { avatar: 'svg:avatar-2', content: 'به Vben ستاره داد', date: '۱ ساعت پیش', title: 'اوان' },
  { avatar: 'svg:avatar-3', content: 'دستورالعمل جدیدی اضافه کرد', date: '۱ روز پیش', title: 'کریس' },
  { avatar: 'svg:avatar-4', content: 'مقاله‌ی «طراحی داشبورد» را منتشر کرد', date: '۲ روز پیش', title: 'Vben' },
  { avatar: 'svg:avatar-1', content: 'به بحث «معماری monorepo» پاسخ داد', date: '۳ روز پیش', title: 'پیتر' },
  { avatar: 'svg:avatar-2', content: 'وظیفه‌ی «استقرار» را بست', date: '۱ هفته پیش', title: 'جک' },
].map((item, i) => ({ ...item, avatar: `https://avatar.vercel.sh/vben-${i}` }));

/**
 * میز کار
 */
export default function Workspace() {
  const userInfo = useUserStore((s) => s.userInfo);
  const navigate = useNavigate();
  const [todos, setTodos] = useState(initialTodos);

  function navTo(url?: string) {
    if (!url) return;
    if (url.startsWith('http')) openWindow(url);
    else navigate(url);
  }

  return (
    <div className="p-5">
      <WorkbenchHeader
        avatar={userInfo?.avatar || preferences.app.defaultAvatar}
        description="امروز هوا آفتابی است و دمای هوا بین ۱۵ تا ۲۵ درجه است!"
        title={`صبح بخیر، ${userInfo?.realName ?? ''}؛ کار امروزت را شروع کن!`}
      />
      <div className="mt-5 flex flex-col gap-5 lg:flex-row">
        <div className="flex w-full flex-col gap-5 lg:w-3/5">
          <WorkbenchProject items={projectItems} onClick={(item) => navTo(item.url)} title="پروژه‌ها" />
          <WorkbenchTrends items={trendItems} title="فعالیت‌های اخیر" />
        </div>
        <div className="flex w-full flex-col gap-5 lg:w-2/5">
          <WorkbenchQuickNav items={quickNavItems} onClick={(item) => navTo(item.url)} title="دسترسی سریع" />
          <WorkbenchTodo
            items={todos}
            onToggle={(index, completed) =>
              setTodos((list) => list.map((t, i) => (i === index ? { ...t, completed } : t)))
            }
            title="کارهای در انتظار"
          />
          <AnalysisChartCard title="منبع بازدید">
            <AnalyticsVisitsSource />
          </AnalysisChartCard>
        </div>
      </div>
    </div>
  );
}
