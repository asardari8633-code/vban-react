import type { FormInstance } from 'antd';

import type { FormApi, FormSchema, FormValues, VbenFormProps } from './types';

import { set } from '@vben-core/shared';
import { createStore } from 'zustand';

/**
 * پیاده‌سازی API فرم
 */
class VbenFormApi implements FormApi {
  /** callbackها غیرواکنشی‌اند و در هر رندر به‌روز می‌شوند (بدون setState در حین رندر) */
  callbacks: Pick<VbenFormProps, 'handleReset' | 'handleSubmit' | 'handleValuesChange'> = {};
  form!: FormInstance;
  readonly store;

  constructor(options: VbenFormProps) {
    this.callbacks = {
      handleReset: options.handleReset,
      handleSubmit: options.handleSubmit,
      handleValuesChange: options.handleValuesChange,
    };
    this.store = createStore<VbenFormProps>()(() => ({
      collapsed: true,
      collapsedRows: 1,
      layout: 'horizontal',
      showDefaultActions: true,
      submitOnEnter: false,
      ...options,
    }));
  }

  /** مقادیر پیش‌فرض بر اساس schema */
  getDefaultValues() {
    const values: FormValues = {};
    for (const item of this.store.getState().schema) {
      if (item.defaultValue !== undefined) set(values, item.fieldName, item.defaultValue);
    }
    return values;
  }

  getState = () => this.store.getState();

  getValues = <T = FormValues,>() => {
    return this.form?.getFieldsValue(true) as T;
  };

  resetForm = () => {
    this.form?.resetFields();
    this.form?.setFieldsValue(this.getDefaultValues());
  };

  resetValidate = () => {
    const fields = this.store.getState().schema.map((item) => ({
      errors: [],
      name: item.fieldName.includes('.') ? item.fieldName.split('.') : item.fieldName,
    }));
    this.form?.setFields(fields);
  };

  setFieldValue = (field: string, value: any) => {
    this.form?.setFieldValue(field.includes('.') ? field.split('.') : field, value);
  };

  setState = (state: ((prev: VbenFormProps) => Partial<VbenFormProps>) | Partial<VbenFormProps>) => {
    const prev = this.store.getState();
    this.store.setState(typeof state === 'function' ? state(prev) : state);
  };

  setValues = (values: FormValues) => {
    this.form?.setFieldsValue(values);
  };

  submitForm = async () => {
    try {
      const values = await this.validate();
      await this.callbacks.handleSubmit?.(values);
      return values;
    } catch {
      return undefined;
    }
  };

  updateSchema = (schema: Array<Partial<FormSchema> & { fieldName: string }>) => {
    const map = new Map(schema.map((item) => [item.fieldName, item]));
    this.setState((prev) => ({
      schema: prev.schema.map((item) => {
        const update = map.get(item.fieldName);
        return update ? { ...item, ...update } : item;
      }),
    }));
  };

  validate = async () => {
    await this.form.validateFields();
    return this.getValues();
  };
}

export { VbenFormApi };
