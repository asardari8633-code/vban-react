import type { TableColumnsType, TableProps } from 'antd';
import type { ReactNode } from 'react';

import type { VbenFormSchema } from './form';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, Card, Table, Tooltip } from 'antd';

import { RotateCw } from '@vben/icons';

import { $t } from '#/locales';

import { useVbenForm } from './form';

interface PageResult<T> {
  items: T[];
  total: number;
}

interface VbenTableOptions<T> {
  /** دریافت داده: پارامترهای صفحه‌بندی + مقادیر فرم جست‌وجو */
  api: (params: Record<string, any>) => Promise<PageResult<T> | T[]>;
  columns: TableColumnsType<T>;
  /** تعداد ردیف پیش‌فرض */
  defaultPageSize?: number;
  /** schema فرم جست‌وجو */
  formSchema?: VbenFormSchema[];
  /** کلاس شبکه‌ی فرم جست‌وجو */
  formWrapperClass?: string;
  /** صفحه‌بندی سمت سرور (پیش‌فرض true) */
  pagination?: boolean;
  rowKey?: string;
  tableProps?: Omit<TableProps<T>, 'columns' | 'dataSource'>;
  title?: ReactNode;
  /** دکمه‌های نوار ابزار */
  toolbar?: ReactNode;
}

interface VbenTableApi {
  /** پارامترهای اضافه برای درخواست‌ها */
  setExtraParams: (params: Record<string, any>) => void;
  query: () => Promise<void>;
  reload: () => Promise<void>;
}

/**
 * جدول با فرم جست‌وجو و صفحه‌بندی سمت سرور (معادل useVbenVxeGrid در Vben)
 */
function useVbenTable<T extends Record<string, any>>(options: VbenTableOptions<T>) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const extraParams = useRef<Record<string, any>>({});
  const reloadRef = useRef<() => Promise<void>>(async () => {});
  const queryRef = useRef<() => Promise<void>>(async () => {});

  const [SearchForm, formApi] = useVbenForm({
    collapsed: true,
    collapsedRows: 1,
    handleReset: () => queryRef.current(),
    handleSubmit: () => queryRef.current(),
    layout: 'vertical',
    schema: options.formSchema ?? [],
    showCollapseButton: (options.formSchema?.length ?? 0) > 3,
    submitButtonOptions: { content: $t('common.search') },
    wrapperClass: options.formWrapperClass ?? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  });

  const api = useMemo<VbenTableApi>(
    () => ({
      query: () => queryRef.current(),
      reload: () => reloadRef.current(),
      setExtraParams: (params) => {
        extraParams.current = params;
      },
    }),
    [],
  );

  const Grid = useMemo(() => {
    function VbenTable() {
      const opts = optionsRef.current;
      const [data, setData] = useState<T[]>([]);
      const [loading, setLoading] = useState(false);
      const [page, setPage] = useState({ current: 1, pageSize: opts.defaultPageSize ?? 10, total: 0 });
      const [sorter, setSorter] = useState<{ sortBy?: string; sortOrder?: 'asc' | 'desc' }>({});

      const load = useCallback(
        async (current = page.current, pageSize = page.pageSize, sort = sorter) => {
          setLoading(true);
          try {
            const values = (opts.formSchema?.length ? formApi.getValues() : {}) ?? {};
            const params = Object.fromEntries(
              Object.entries({ ...values, ...extraParams.current }).filter(
                ([, v]) => v !== undefined && v !== null && v !== '',
              ),
            );
            const result = await opts.api({
              ...params,
              ...(opts.pagination === false ? {} : { page: current, pageSize }),
              ...sort,
            });
            if (Array.isArray(result)) {
              setData(result);
              setPage((p) => ({ ...p, total: result.length }));
            } else {
              setData(result.items);
              setPage({ current, pageSize, total: result.total });
            }
          } finally {
            setLoading(false);
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [page.current, page.pageSize, sorter],
      );

      reloadRef.current = () => load();
      queryRef.current = () => load(1);

      useEffect(() => {
        void load(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return (
        <div className="flex flex-col gap-4">
          {opts.formSchema && opts.formSchema.length > 0 && (
            <Card size="small" styles={{ body: { paddingBottom: 0 } }}>
              <SearchForm />
            </Card>
          )}
          <Card
            extra={
              <div className="flex items-center gap-2">
                {opts.toolbar}
                <Tooltip title={$t('common.refresh')}>
                  <Button icon={<RotateCw className="size-4" />} onClick={() => void load()} shape="circle" />
                </Tooltip>
              </div>
            }
            styles={{ body: { padding: 0 } }}
            title={opts.title}
          >
            <Table<T>
              columns={opts.columns}
              dataSource={data}
              loading={loading}
              onChange={(pagination, _filters, sort) => {
                const s = Array.isArray(sort) ? sort[0] : sort;
                const nextSort = s?.order
                  ? { sortBy: String(s.field), sortOrder: s.order === 'ascend' ? ('asc' as const) : ('desc' as const) }
                  : {};
                setSorter(nextSort);
                void load(pagination.current ?? 1, pagination.pageSize ?? page.pageSize, nextSort);
              }}
              pagination={
                opts.pagination === false
                  ? false
                  : {
                      current: page.current,
                      pageSize: page.pageSize,
                      showSizeChanger: true,
                      showTotal: (total) => `مجموع ${new Intl.NumberFormat('fa-IR').format(total)} مورد`,
                      total: page.total,
                    }
              }
              rowKey={opts.rowKey ?? 'id'}
              scroll={{ x: 'max-content' }}
              size="middle"
              {...opts.tableProps}
            />
          </Card>
        </div>
      );
    }
    return VbenTable;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [Grid, api, formApi] as const;
}

export { useVbenTable };
export type { PageResult, VbenTableApi, VbenTableOptions };
