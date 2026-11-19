import type { TableColumnsType } from 'antd';

import type { DemoTableApi } from '#/api';

import { Image, Rate, Tag } from 'antd';

import { Page } from '@vben/common-ui';

import { useVbenTable } from '#/adapter/table';
import { getExampleTableApi } from '#/api';

const statusColor = { error: 'error', success: 'success', warning: 'warning' } as const;
const statusText = { error: 'خطا', success: 'موفق', warning: 'هشدار' } as const;

/**
 * جدول با داده‌ی سرور، صفحه‌بندی و مرتب‌سازی
 */
export default function TableRemote() {
  const columns: TableColumnsType<DemoTableApi.Product> = [
    { dataIndex: 'imageUrl', render: (src) => <Image height={36} src={src} width={36} />, title: 'تصویر', width: 80 },
    { dataIndex: 'productName', sorter: true, title: 'نام محصول', width: 200 },
    { dataIndex: 'category', title: 'دسته', width: 140 },
    {
      dataIndex: 'price',
      render: (v) => `${new Intl.NumberFormat('fa-IR').format(Number(v))} ریال`,
      sorter: true,
      title: 'قیمت',
      width: 160,
    },
    { dataIndex: 'quantity', sorter: true, title: 'موجودی', width: 100 },
    { dataIndex: 'rating', render: (v) => <Rate allowHalf disabled value={v} />, sorter: true, title: 'امتیاز', width: 170 },
    {
      dataIndex: 'status',
      render: (s: keyof typeof statusColor) => <Tag color={statusColor[s]}>{statusText[s]}</Tag>,
      title: 'وضعیت',
      width: 100,
    },
    {
      dataIndex: 'releaseDate',
      render: (v) => new Intl.DateTimeFormat('fa-IR-u-ca-persian', { dateStyle: 'medium' }).format(new Date(v)),
      sorter: true,
      title: 'تاریخ انتشار',
      width: 140,
    },
  ];

  const [Grid] = useVbenTable<DemoTableApi.Product>({
    api: (params) => getExampleTableApi(params as DemoTableApi.PageFetchParams),
    columns,
    defaultPageSize: 10,
    title: 'فهرست محصولات',
  });

  return (
    <Page description="داده‌ها از سرور ماک با صفحه‌بندی و مرتب‌سازی سمت سرور دریافت می‌شوند." title="جدول با داده‌ی سرور">
      <Grid />
    </Page>
  );
}
