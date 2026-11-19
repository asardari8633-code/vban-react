import type { ReactNode } from 'react';

import { useNavigate } from 'react-router';

import { Button } from 'antd';

import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { ArrowLeft, RotateCw } from '@vben-core/icons';

type FallbackStatus = '403' | '404' | '500' | 'coming-soon' | 'offline';

interface FallbackProps {
  description?: ReactNode;
  homePath?: string;
  /** تصویر سفارشی */
  image?: ReactNode;
  showBack?: boolean;
  status?: FallbackStatus;
  title?: ReactNode;
}

const palette: Record<FallbackStatus, string> = {
  '403': 'hsl(var(--warning))',
  '404': 'hsl(var(--primary))',
  '500': 'hsl(var(--destructive))',
  'coming-soon': 'hsl(var(--success))',
  offline: 'hsl(var(--muted-foreground))',
};

/**
 * تصویر ساده‌ی وضعیت
 */
function StatusIllustration({ status }: { status: FallbackStatus }) {
  const color = palette[status];
  const label = status === 'coming-soon' ? '⏳' : status === 'offline' ? '⚡' : status;
  return (
    <svg className="w-72 max-w-full md:w-96" viewBox="0 0 400 260">
      <ellipse cx="200" cy="238" fill="hsl(var(--muted))" rx="150" ry="14" />
      <rect fill="hsl(var(--card))" height="170" rx="16" stroke="hsl(var(--border))" width="260" x="70" y="40" />
      <rect fill={color} height="26" opacity="0.15" rx="16" width="260" x="70" y="40" />
      <circle cx="92" cy="53" fill={color} r="5" />
      <circle cx="110" cy="53" fill={color} opacity="0.6" r="5" />
      <circle cx="128" cy="53" fill={color} opacity="0.3" r="5" />
      <text
        dominantBaseline="middle"
        fill={color}
        fontFamily="inherit"
        fontSize={status.length > 3 ? 64 : 76}
        fontWeight="800"
        textAnchor="middle"
        x="200"
        y="142"
      >
        {label}
      </text>
      <circle cx="40" cy="70" fill={color} opacity="0.25" r="14">
        <animate attributeName="cy" dur="4s" repeatCount="indefinite" values="70;60;70" />
      </circle>
      <circle cx="360" cy="190" fill={color} opacity="0.2" r="20">
        <animate attributeName="cy" dur="5s" repeatCount="indefinite" values="190;178;190" />
      </circle>
    </svg>
  );
}

/**
 * صفحه‌ی خطا/وضعیت (۴۰۳، ۴۰۴، ۵۰۰، آفلاین، به‌زودی)
 */
function Fallback({ description, homePath, image, showBack = true, status = '404', title }: FallbackProps) {
  const navigate = useNavigate();

  const defaults: Record<FallbackStatus, { desc: string; title: string }> = {
    '403': { desc: $t('ui.fallback.forbiddenDesc'), title: $t('ui.fallback.forbidden') },
    '404': { desc: $t('ui.fallback.pageNotFoundDesc'), title: $t('ui.fallback.pageNotFound') },
    '500': { desc: $t('ui.fallback.internalErrorDesc'), title: $t('ui.fallback.internalError') },
    'coming-soon': { desc: '', title: $t('ui.fallback.comingSoon') },
    offline: { desc: $t('ui.fallback.offlineErrorDesc'), title: $t('ui.fallback.offlineError') },
  };

  const isOffline = status === 'offline';

  return (
    <div className="page-transition-fade flex size-full min-h-[70vh] flex-col items-center justify-center p-6">
      {image ?? <StatusIllustration status={status} />}
      <div className="flex-col-center">
        <p className="mt-8 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
          {title ?? defaults[status].title}
        </p>
        <p className="mt-4 mb-8 text-center text-muted-foreground md:text-lg">
          {description ?? defaults[status].desc}
        </p>
        {showBack &&
          (isOffline ? (
            <Button icon={<RotateCw className="size-4" />} onClick={() => location.reload()} size="large" type="primary">
              {$t('common.refresh')}
            </Button>
          ) : (
            <Button
              icon={<ArrowLeft className="size-4 rtl:rotate-180" />}
              onClick={() => navigate(homePath ?? preferences.app.defaultHomePath)}
              size="large"
              type="primary"
            >
              {$t('common.backToHome')}
            </Button>
          ))}
      </div>
    </div>
  );
}

export { Fallback };
export type { FallbackProps, FallbackStatus };
