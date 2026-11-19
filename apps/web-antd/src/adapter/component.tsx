import type { ComponentType } from 'react';

import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Mentions,
  Radio,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  TimePicker,
  TreeSelect,
  Upload,
} from 'antd';

import { ApiSelect, ApiTreeSelect } from '@vben/common-ui';
import { setupVbenForm } from '@vben-core/form-ui';

/**
 * نام کامپوننت‌هایی که در schema فرم‌ها قابل استفاده‌اند
 */
type ComponentName =
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'ColorPicker'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Slider'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload';

const components: Record<ComponentName, ComponentType<any>> = {
  ApiSelect,
  ApiTreeSelect,
  AutoComplete,
  Cascader,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  ColorPicker,
  DatePicker,
  DefaultButton: (props: any) => <Button {...props} />,
  Divider,
  Input,
  InputNumber,
  InputPassword: Input.Password,
  Mentions,
  PrimaryButton: (props: any) => <Button type="primary" {...props} />,
  RadioGroup: Radio.Group,
  RangePicker: DatePicker.RangePicker,
  Rate,
  Select,
  Slider,
  Space,
  Switch,
  Textarea: Input.TextArea,
  TimePicker,
  TreeSelect,
  Upload,
};

/**
 * ثبت کامپوننت‌های antd در فرم‌ساز (معادل adapter/component در Vben)
 */
function setupComponentAdapter() {
  setupVbenForm({ components });
}

export { components, setupComponentAdapter };
export type { ComponentName };
