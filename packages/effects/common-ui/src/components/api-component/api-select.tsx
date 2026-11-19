import type { SelectProps, TreeSelectProps } from 'antd';

import { useEffect, useState } from 'react';

import { Select, TreeSelect } from 'antd';

import { get } from '@vben-core/shared';

interface ApiComponentBaseProps {
  /** تابع دریافت داده */
  api?: (params?: any) => Promise<any>;
  /** فیلد فرزندان (برای درخت) */
  childrenField?: string;
  /** شرط بارگذاری فوری */
  immediate?: boolean;
  /** نام فیلد برچسب */
  labelField?: string;
  /** پارامترهای api */
  params?: Record<string, any>;
  /** مسیر آرایه در پاسخ (مثلاً items) */
  resultField?: string;
  /** نام فیلد مقدار */
  valueField?: string;
  /** تبدیل نهایی گزینه‌ها */
  afterFetch?: (data: any) => any;
}

function normalize(list: any[], labelField: string, valueField: string, childrenField: string): any[] {
  return (list ?? []).map((item) => ({
    ...item,
    children: item[childrenField]?.length
      ? normalize(item[childrenField], labelField, valueField, childrenField)
      : undefined,
    label: item[labelField],
    title: item[labelField],
    value: item[valueField],
  }));
}

function useApiOptions({
  afterFetch,
  api,
  childrenField = 'children',
  immediate = true,
  labelField = 'label',
  params,
  resultField,
  valueField = 'value',
}: ApiComponentBaseProps) {
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const paramsKey = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!api || !immediate) return;
    let cancelled = false;
    setLoading(true);
    api(params)
      .then((res) => {
        if (cancelled) return;
        let data = resultField ? get(res, resultField) : res;
        if (afterFetch) data = afterFetch(data);
        setOptions(normalize(Array.isArray(data) ? data : [], labelField, valueField, childrenField));
      })
      .catch(() => !cancelled && setOptions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, paramsKey, immediate]);

  return { loading, options };
}

type ApiSelectProps = ApiComponentBaseProps & Omit<SelectProps, 'options'>;

/**
 * Select با گزینه‌های دریافتی از API
 */
function ApiSelect({ afterFetch, api, childrenField, immediate, labelField, params, resultField, valueField, ...rest }: ApiSelectProps) {
  const { loading, options } = useApiOptions({ afterFetch, api, childrenField, immediate, labelField, params, resultField, valueField });
  return <Select loading={loading} options={options} {...rest} />;
}

type ApiTreeSelectProps = ApiComponentBaseProps & Omit<TreeSelectProps, 'treeData'>;

/**
 * TreeSelect با داده‌ی دریافتی از API
 */
function ApiTreeSelect({ afterFetch, api, childrenField, immediate, labelField, params, resultField, valueField, ...rest }: ApiTreeSelectProps) {
  const { loading, options } = useApiOptions({ afterFetch, api, childrenField, immediate, labelField, params, resultField, valueField });
  return <TreeSelect loading={loading} treeData={options} treeDefaultExpandAll {...rest} />;
}

export { ApiSelect, ApiTreeSelect };
export type { ApiSelectProps, ApiTreeSelectProps };
