import type { FormSchema, VbenFormProps } from '@vben-core/form-ui';

import type { ComponentName } from './component';

import { $t } from '@vben/locales';
import { setupVbenForm, useVbenForm as useBaseVbenForm } from '@vben-core/form-ui';

import { components } from './component';

/**
 * پیکربندی فرم: پیام‌های اعتبارسنجی و متن دکمه‌ها از i18n
 */
function setupFormAdapter() {
  setupVbenForm({
    components,
    config: {
      collapseText: $t('common.collapse'),
      expandText: $t('common.expand'),
      inputPlaceholder: $t('ui.placeholder.input'),
      requiredMessage: (label) => $t('ui.formRules.required', [String(label ?? '')]),
      resetText: $t('common.reset'),
      selectPlaceholder: $t('ui.placeholder.select'),
      selectRequiredMessage: (label) => $t('ui.formRules.selectRequired', [String(label ?? '')]),
      submitText: $t('common.submit'),
    },
  });
}

/** schema با نام کامپوننت‌های تایپ‌شده */
type VbenFormSchema = Omit<FormSchema, 'component'> & {
  component: ComponentName | FormSchema['component'];
};

function useVbenForm(options: Omit<VbenFormProps, 'schema'> & { schema: VbenFormSchema[] }) {
  return useBaseVbenForm(options as VbenFormProps);
}

export { setupFormAdapter, useVbenForm };
export type { VbenFormSchema };
