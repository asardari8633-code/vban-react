import { Card } from 'antd';

import { Page } from '@vben/common-ui';
import {
  Bell,
  BookOpenText,
  CircleHelp,
  House,
  IconifyIcon,
  LockKeyhole,
  Search,
  Settings,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
  SvgGithubIcon,
  Trash2,
  VbenIcon,
} from '@vben/icons';

const iconifyNames = [
  'mdi:home',
  'mdi:account',
  'mdi:github',
  'logos:react',
  'logos:typescript-icon',
  'logos:vitejs',
  'ant-design:ant-design-outlined',
  'carbon:workspace',
  'ion:layers-outline',
  'svg-spinners:6-dots-rotate',
  'line-md:loading-twotone-loop',
  'twemoji:flag-iran',
];

const lucideIcons = [House, Search, Bell, Settings, LockKeyhole, Trash2, BookOpenText, CircleHelp];
const svgIcons = [SvgCardIcon, SvgCakeIcon, SvgDownloadIcon, SvgBellIcon, SvgGithubIcon];

/**
 * انواع آیکون: iconify (آنلاین)، lucide (آفلاین) و SVG داخلی
 */
export default function IconsDemo() {
  return (
    <Page description="آیکون‌ها با کامپوننت VbenIcon به سه شکل قابل استفاده‌اند." title="آیکون‌ها">
      <Card className="mb-5" title="Iconify — مثل <IconifyIcon icon='mdi:home' />">
        <div className="flex flex-wrap gap-6">
          {iconifyNames.map((name) => (
            <div className="flex-col-center gap-2" key={name}>
              <IconifyIcon icon={name} size={32} />
              <code className="text-xs text-muted-foreground" dir="ltr">
                {name}
              </code>
            </div>
          ))}
        </div>
      </Card>
      <Card className="mb-5" title="Lucide (bundle شده)">
        <div className="flex flex-wrap gap-6">
          {lucideIcons.map((Icon, i) => (
            <Icon className="size-8" key={i} />
          ))}
        </div>
      </Card>
      <Card className="mb-5" title="SVG داخلی">
        <div className="flex flex-wrap gap-6">
          {svgIcons.map((Icon, i) => (
            <Icon key={i} size={40} />
          ))}
        </div>
      </Card>
      <Card title="VbenIcon — رشته، آدرس تصویر یا کامپوننت">
        <div className="flex items-center gap-6">
          <VbenIcon icon="mdi:react" size={32} />
          <VbenIcon icon="https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp" size={32} />
          <VbenIcon icon={SvgGithubIcon} size={32} />
        </div>
      </Card>
    </Page>
  );
}
