import type { ComponentType } from 'react';

import type { FormAdapterConfig } from './types';

const componentRegistry: Record<string, ComponentType<any>> = {};

const adapterConfig: Required<FormAdapterConfig> = {
  collapseText: 'جمع کردن',
  expandText: 'بیشتر',
  inputPlaceholder: 'لطفاً وارد کنید',
  modelPropNameMap: { Checkbox: 'checked', Switch: 'checked', Upload: 'fileList' },
  requiredMessage: (label) => `لطفاً ${String(label ?? '')} را وارد کنید`,
  resetText: 'بازنشانی',
  selectComponents: [
    'ApiSelect',
    'ApiTreeSelect',
    'Cascader',
    'DatePicker',
    'RangePicker',
    'Select',
    'TimePicker',
    'TreeSelect',
  ],
  selectPlaceholder: 'لطفاً انتخاب کنید',
  selectRequiredMessage: (label) => `لطفاً ${String(label ?? '')} را انتخاب کنید`,
  submitText: 'ثبت',
};

interface SetupVbenFormOptions {
  components: Record<string, ComponentType<any>>;
  config?: FormAdapterConfig;
}

/**
 * ثبت کامپوننت‌ها و پیکربندی فرم (adapter) — در برنامه یک بار صدا زده می‌شود
 */
function setupVbenForm({ components, config }: SetupVbenFormOptions) {
  Object.assign(componentRegistry, components);
  if (config) {
    const { modelPropNameMap, ...rest } = config;
    Object.assign(adapterConfig, rest);
    if (modelPropNameMap) Object.assign(adapterConfig.modelPropNameMap, modelPropNameMap);
  }
}

function getRegisteredComponent(name: string) {
  return componentRegistry[name];
}

export { adapterConfig, getRegisteredComponent, setupVbenForm };
export type { SetupVbenFormOptions };
