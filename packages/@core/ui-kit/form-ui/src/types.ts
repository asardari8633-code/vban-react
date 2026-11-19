import type { FormInstance, FormItemProps } from 'antd';
import type { Rule } from 'antd/es/form';
import type { ComponentType, ReactNode } from 'react';

type FormValues = Record<string, any>;

interface FormSchemaDependencies {
  /** غیرفعال شدن */
  disabled?: (values: FormValues) => boolean;
  /** فیلد اصلاً رندر نشود */
  if?: (values: FormValues) => boolean;
  /** پراپ‌های پویا */
  componentProps?: (values: FormValues) => Record<string, any>;
  /** الزامی شدن پویا */
  required?: (values: FormValues) => boolean;
  /** قوانین پویا */
  rules?: (values: FormValues) => Rule[];
  /** نمایش/پنهان (فیلد رندر می‌شود ولی دیده نمی‌شود) */
  show?: (values: FormValues) => boolean;
  /** فیلدهایی که تغییرشان باعث محاسبه‌ی دوباره می‌شود */
  triggerFields: string[];
}

interface FormSchema {
  /** نام کامپوننت ثبت‌شده در adapter یا خود کامپوننت */
  component: ComponentType<any> | string;
  componentProps?: ((values: FormValues, api: FormApi) => Record<string, any>) | Record<string, any>;
  defaultValue?: any;
  dependencies?: FormSchemaDependencies;
  /** توضیح زیر فیلد */
  description?: ReactNode;
  disabled?: boolean;
  fieldName: string;
  /** کلاس آیتم (مثلاً col-span-2) */
  formItemClass?: string;
  formItemProps?: Partial<FormItemProps>;
  help?: ReactNode;
  /** فیلد پنهان */
  hide?: boolean;
  label?: ReactNode;
  /** محتوای داخل کامپوننت (children) */
  renderComponentContent?: (values: FormValues) => ReactNode;
  /** 'required' | 'selectRequired' یا قوانین antd */
  rules?: 'required' | 'selectRequired' | Rule[];
  /** پسوند کنار فیلد */
  suffix?: ReactNode;
  /** نام پراپ مقدار (مثلاً checked برای Switch) */
  valuePropName?: string;
}

interface ActionButtonOptions {
  content?: ReactNode;
  loading?: boolean;
  show?: boolean;
}

interface VbenFormProps {
  /** کلاس ناحیه‌ی دکمه‌ها */
  actionWrapperClass?: string;
  /** حالت جمع‌شده (فرم جست‌وجو) */
  collapsed?: boolean;
  /** تعداد ردیف‌های قابل مشاهده در حالت جمع‌شده */
  collapsedRows?: number;
  /** تنظیمات مشترک همه‌ی فیلدها */
  commonConfig?: Partial<Pick<FormSchema, 'componentProps' | 'disabled' | 'formItemClass' | 'formItemProps'>> & {
    labelWidth?: number;
  };
  handleReset?: (values: FormValues) => unknown;
  handleSubmit?: (values: FormValues) => unknown;
  handleValuesChange?: (values: FormValues, changed: FormValues) => void;
  labelWidth?: number;
  layout?: 'horizontal' | 'inline' | 'vertical';
  resetButtonOptions?: ActionButtonOptions;
  schema: FormSchema[];
  showCollapseButton?: boolean;
  showDefaultActions?: boolean;
  submitButtonOptions?: ActionButtonOptions;
  /** با Enter ارسال شود */
  submitOnEnter?: boolean;
  /** کلاس شبکه (مثلاً grid-cols-1 md:grid-cols-3) */
  wrapperClass?: string;
}

interface FormApi {
  form: FormInstance;
  getState: () => VbenFormProps;
  getValues: <T = FormValues>() => T;
  resetForm: () => void;
  resetValidate: () => void;
  setFieldValue: (field: string, value: any) => void;
  setState: (state: ((prev: VbenFormProps) => Partial<VbenFormProps>) | Partial<VbenFormProps>) => void;
  setValues: (values: FormValues) => void;
  submitForm: () => Promise<FormValues | undefined>;
  updateSchema: (schema: Array<Partial<FormSchema> & { fieldName: string }>) => void;
  validate: () => Promise<FormValues>;
}

interface FormAdapterConfig {
  /** پیام پیش‌فرض الزامی بودن */
  requiredMessage?: (label: ReactNode) => string;
  /** پیام پیش‌فرض الزامی بودن برای انتخاب */
  selectRequiredMessage?: (label: ReactNode) => string;
  /** نام پراپ مقدار برای هر کامپوننت (مثل Switch → checked) */
  modelPropNameMap?: Record<string, string>;
  /** placeholder پیش‌فرض */
  inputPlaceholder?: string;
  selectPlaceholder?: string;
  /** کامپوننت‌هایی که placeholder از نوع انتخاب دارند */
  selectComponents?: string[];
  resetText?: string;
  submitText?: string;
  expandText?: string;
  collapseText?: string;
}

export type {
  ActionButtonOptions,
  FormAdapterConfig,
  FormApi,
  FormSchema,
  FormSchemaDependencies,
  FormValues,
  VbenFormProps,
};
