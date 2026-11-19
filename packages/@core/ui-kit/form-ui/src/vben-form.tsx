import type { Rule } from 'antd/es/form';
import type { ReactNode } from 'react';

import type { FormSchema, FormValues, VbenFormProps } from './types';
import type { VbenFormApi } from './form-api';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Button, Form } from 'antd';
import { useStore } from 'zustand';

import { ChevronDown } from '@vben-core/icons';
import { cn, isFunction } from '@vben-core/shared';

import { adapterConfig, getRegisteredComponent } from './config';

function resolveRules(schema: FormSchema, values: FormValues): Rule[] | undefined {
  const deps = schema.dependencies;
  let rules: Rule[] = [];
  const isSelect =
    typeof schema.component === 'string' && adapterConfig.selectComponents.includes(schema.component);
  if (schema.rules === 'required') {
    rules = [{ message: adapterConfig.requiredMessage(schema.label), required: true }];
  } else if (schema.rules === 'selectRequired') {
    rules = [{ message: adapterConfig.selectRequiredMessage(schema.label), required: true }];
  } else if (Array.isArray(schema.rules)) {
    rules = schema.rules;
  }
  if (deps?.rules) rules = deps.rules(values);
  if (deps?.required?.(values) && !rules.some((r: any) => r.required)) {
    rules = [
      {
        message: isSelect
          ? adapterConfig.selectRequiredMessage(schema.label)
          : adapterConfig.requiredMessage(schema.label),
        required: true,
      },
      ...rules,
    ];
  }
  return rules.length > 0 ? rules : undefined;
}

interface FieldProps {
  api: VbenFormApi;
  commonConfig: VbenFormProps['commonConfig'];
  schema: FormSchema;
  values: FormValues;
}

/**
 * یک فیلد فرم بر اساس schema
 */
function FormField({ api, commonConfig, schema, values }: FieldProps) {
  const deps = schema.dependencies;
  if (deps?.if && !deps.if(values)) return null;
  const visible = deps?.show ? deps.show(values) : true;

  const Comp =
    typeof schema.component === 'string'
      ? getRegisteredComponent(schema.component)
      : schema.component;
  const componentName = typeof schema.component === 'string' ? schema.component : '';

  const baseProps = isFunction(commonConfig?.componentProps)
    ? commonConfig.componentProps(values, api)
    : (commonConfig?.componentProps ?? {});
  const ownProps = isFunction(schema.componentProps)
    ? schema.componentProps(values, api)
    : (schema.componentProps ?? {});
  const dynamicProps = deps?.componentProps?.(values) ?? {};
  const disabled = deps?.disabled?.(values) ?? schema.disabled ?? commonConfig?.disabled;

  const isSelect = adapterConfig.selectComponents.includes(componentName);
  const placeholder =
    componentName && !['Checkbox', 'CheckboxGroup', 'Divider', 'RadioGroup', 'Switch', 'Rate', 'Upload'].includes(componentName)
      ? isSelect
        ? adapterConfig.selectPlaceholder
        : adapterConfig.inputPlaceholder
      : undefined;

  const props: Record<string, any> = {
    ...(placeholder && componentName !== 'RangePicker' ? { placeholder } : {}),
    ...baseProps,
    ...ownProps,
    ...dynamicProps,
  };
  if (disabled !== undefined) props.disabled = disabled;

  const valuePropName =
    schema.valuePropName ?? adapterConfig.modelPropNameMap[componentName] ?? 'value';

  const content: ReactNode = Comp ? (
    <Comp {...props}>{schema.renderComponentContent?.(values)}</Comp>
  ) : (
    <span className="text-destructive">کامپوننت «{componentName}» ثبت نشده است</span>
  );

  if (componentName === 'Divider') {
    return <div className={cn('col-span-full', schema.formItemClass)}>{content}</div>;
  }

  return (
    <Form.Item
      className={cn(commonConfig?.formItemClass, schema.formItemClass, (!visible || schema.hide) && 'hidden!')}
      extra={schema.description}
      help={schema.help}
      label={schema.label}
      name={toNamePath(schema.fieldName)}
      rules={visible && !schema.hide ? resolveRules(schema, values) : undefined}
      valuePropName={valuePropName}
      {...commonConfig?.formItemProps}
      {...schema.formItemProps}
    >
      {schema.suffix ? (
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">{content}</div>
          {schema.suffix}
        </div>
      ) : (
        content
      )}
    </Form.Item>
  );
}

/** نام‌های نقطه‌دار (مثل meta.title) به مسیر تو در تو تبدیل می‌شوند */
function toNamePath(fieldName: string) {
  return fieldName.includes('.') ? fieldName.split('.') : fieldName;
}

function countGridColumns(el: HTMLElement | null) {
  if (!el) return 1;
  const template = getComputedStyle(el).gridTemplateColumns;
  return Math.max(1, template.split(' ').filter(Boolean).length);
}

/**
 * ساخت کامپوننت فرم متصل به API
 */
function createFormComponent(api: VbenFormApi) {
  function VbenForm(overrides: Partial<VbenFormProps> & { className?: string }) {
    const storeState = useStore(api.store);
    const state = { ...storeState, ...overrides };
    const [form] = Form.useForm();
    api.form = form;
    const gridRef = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    const initialValues = useMemo(() => api.getDefaultValues(), []);

    useLayoutEffect(() => {
      const el = gridRef.current;
      if (!el) return;
      const update = () => setColumns(countGridColumns(el));
      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    // فیلدهای وابسته با تغییر مقادیر دوباره محاسبه می‌شوند
    const values: FormValues = Form.useWatch([], { form, preserve: true }) ?? initialValues;

    const visibleSchema = state.schema;
    // در حالت جمع‌شده یک خانه برای دکمه‌ها در ردیف آخر می‌ماند
    const collapsedCount = Math.max(1, (state.collapsedRows ?? 1) * columns - 1);
    const canCollapse = !!state.showCollapseButton && state.schema.length > collapsedCount;
    const collapsedLimit = canCollapse && state.collapsed ? collapsedCount : Infinity;

    async function handleSubmit() {
      try {
        setSubmitting(true);
        const vals = await api.validate();
        await (overrides.handleSubmit ?? api.callbacks.handleSubmit)?.(vals);
      } catch {
        /* خطای اعتبارسنجی */
      } finally {
        setSubmitting(false);
      }
    }

    async function handleReset() {
      api.resetForm();
      await (overrides.handleReset ?? api.callbacks.handleReset)?.(api.getValues());
    }

    const labelWidth = state.commonConfig?.labelWidth ?? state.labelWidth;
    const layout = state.layout === 'inline' ? 'horizontal' : state.layout;

    const actions = state.showDefaultActions ? (
      <div
        className={cn(
          'col-span-full flex items-start justify-end gap-2 pb-6',
          state.actionWrapperClass,
        )}
      >
        {state.resetButtonOptions?.show !== false && (
          <Button onClick={handleReset}>
            {state.resetButtonOptions?.content ?? adapterConfig.resetText}
          </Button>
        )}
        {state.submitButtonOptions?.show !== false && (
          <Button
            htmlType="submit"
            loading={submitting || state.submitButtonOptions?.loading}
            type="primary"
          >
            {state.submitButtonOptions?.content ?? adapterConfig.submitText}
          </Button>
        )}
        {canCollapse && (
          <Button
            onClick={() => api.setState({ collapsed: !state.collapsed })}
            type="link"
          >
            {state.collapsed ? adapterConfig.expandText : adapterConfig.collapseText}
            <ChevronDown className={cn('ms-1 size-4 transition-transform', !state.collapsed && 'rotate-180')} />
          </Button>
        )}
      </div>
    ) : null;

    return (
      <Form
        className={cn('vben-form', overrides.className)}
        colon={false}
        form={form}
        initialValues={initialValues}
        labelCol={layout === 'horizontal' && labelWidth ? { style: { width: labelWidth } } : undefined}
        layout={layout}
        onFinish={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !state.submitOnEnter && (e.target as HTMLElement).tagName === 'INPUT') {
            if (!state.showDefaultActions) e.preventDefault();
          }
        }}
        onValuesChange={(changed, all) =>
          (overrides.handleValuesChange ?? api.callbacks.handleValuesChange)?.(all, changed)
        }
      >
        <div className={cn('grid gap-x-4', state.wrapperClass ?? 'grid-cols-1')} ref={gridRef}>
          {visibleSchema.map((schema, index) => (
            <div
              className={cn('contents', index >= collapsedLimit && '[&>*]:hidden!')}
              key={schema.fieldName}
            >
              <FormField api={api} commonConfig={state.commonConfig} schema={schema} values={values ?? {}} />
            </div>
          ))}
          {actions}
        </div>
      </Form>
    );
  }
  return VbenForm;
}

export { createFormComponent };
