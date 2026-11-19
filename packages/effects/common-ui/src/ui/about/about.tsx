import type { ReactNode } from 'react';

import { Card, Descriptions, Tag } from 'antd';

import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';

import { Page } from '../../components/page/page';

interface AboutMetadata {
  authorEmail?: string;
  authorName?: string;
  authorUrl?: string;
  buildTime?: string;
  dependencies?: Record<string, string>;
  description?: string;
  devDependencies?: Record<string, string>;
  homepage?: string;
  license?: string;
  repositoryUrl?: string;
  version?: string;
}

interface AboutProps {
  description?: ReactNode;
  metadata: AboutMetadata;
  name?: ReactNode;
  title?: ReactNode;
}

function renderLink(href: string, text?: string) {
  return (
    <a className="vben-link" href={href} rel="noreferrer" target="_blank">
      {text ?? href}
    </a>
  );
}

/**
 * صفحه‌ی درباره‌ی پروژه: اطلاعات پایه و وابستگی‌ها
 */
function About({ description, metadata, name = 'Vben Admin', title = 'درباره‌ی پروژه' }: AboutProps) {
  const {
    buildTime,
    dependencies = {},
    devDependencies = {},
    homepage,
    license,
    version,
  } = metadata;

  const basicItems = [
    { children: <Tag color="blue">{version}</Tag>, key: 'version', label: 'نسخه' },
    { children: license, key: 'license', label: 'مجوز' },
    { children: buildTime, key: 'buildTime', label: 'زمان ساخت' },
    { children: renderLink(homepage ?? VBEN_DOC_URL), key: 'homepage', label: 'وب‌سایت' },
    { children: renderLink(VBEN_DOC_URL), key: 'doc', label: 'مستندات' },
    { children: renderLink(VBEN_GITHUB_URL, 'GitHub'), key: 'github', label: 'مخزن نسخه‌ی اصلی' },
  ];

  const toItems = (deps: Record<string, string>) =>
    Object.entries(deps).map(([key, value]) => ({ children: value, key, label: key }));

  return (
    <Page
      description={
        description ?? (
          <>
            <a className="vben-link" href={VBEN_GITHUB_URL} rel="noreferrer" target="_blank">
              {name}
            </a>{' '}
            یک قالب مدیریتی فرانت‌اند مدرن است که این نسخه‌ی آن با React، Ant Design و TypeScript
            بازنویسی شده است. معماری monorepo، تم‌پذیری کامل، کنترل دسترسی پویا، زبانه‌ها و چیدمان‌های
            متنوع را ارائه می‌دهد.
          </>
        )
      }
      title={title}
    >
      <Card className="mb-4" title="اطلاعات پایه">
        <Descriptions bordered column={{ lg: 3, md: 2, sm: 1, xs: 1 }} items={basicItems} size="small" />
      </Card>
      <Card className="mb-4" title="وابستگی‌های تولید">
        <Descriptions bordered column={{ lg: 4, md: 3, sm: 1, xs: 1 }} items={toItems(dependencies)} size="small" />
      </Card>
      <Card title="وابستگی‌های توسعه">
        <Descriptions bordered column={{ lg: 4, md: 3, sm: 1, xs: 1 }} items={toItems(devDependencies)} size="small" />
      </Card>
    </Page>
  );
}

export { About };
export type { AboutMetadata, AboutProps };
