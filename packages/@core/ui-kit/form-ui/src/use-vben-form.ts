import type { VbenFormProps } from './types';

import { useMemo, useRef } from 'react';

import { VbenFormApi } from './form-api';
import { createFormComponent } from './vben-form';

/**
 * ساخت فرم schema-محور (معادل useVbenForm در Vben)
 * @example
 * const [Form, formApi] = useVbenForm({ schema: [...], handleSubmit(values) {...} });
 */
function useVbenForm(options: VbenFormProps) {
  const apiRef = useRef<VbenFormApi | null>(null);
  if (!apiRef.current) apiRef.current = new VbenFormApi(options);
  const api = apiRef.current;
  // به‌روزرسانی callbackها در هر رندر (بدون تغییر store)
  api.callbacks = {
    handleReset: options.handleReset,
    handleSubmit: options.handleSubmit,
    handleValuesChange: options.handleValuesChange,
  };
  const Component = useMemo(() => createFormComponent(api), [api]);
  return [Component, api] as const;
}

export { useVbenForm };
