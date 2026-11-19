import type { ReactNode } from 'react';

import { Input, InputNumber, Segmented, Select, Switch, Tooltip } from 'antd';

import { CircleHelp } from '@vben/icons';
import { cn } from '@vben-core/shared';

function Block({ children, title }: { children: ReactNode; title: ReactNode }) {
  return (
    <div className="mb-4 flex flex-col py-2">
      <h3 className="mb-3 font-semibold leading-none tracking-tight">{title}</h3>
      {children}
    </div>
  );
}

interface ItemBaseProps {
  children?: ReactNode;
  disabled?: boolean;
  tip?: ReactNode;
  title: ReactNode;
}

function ItemRow({ children, disabled, tip, title }: ItemBaseProps) {
  return (
    <div
      className={cn(
        'my-1 flex w-full items-center justify-between rounded-md px-2 py-2.5 hover:bg-accent',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <span className="flex items-center text-sm">
        {title}
        {tip && (
          <Tooltip styles={{ root: { whiteSpace: "pre-line" } }} title={tip}>
            <CircleHelp className="ms-1 size-3.5 cursor-help text-muted-foreground" />
          </Tooltip>
        )}
      </span>
      {children}
    </div>
  );
}

function SwitchItem({
  disabled,
  onChange,
  tip,
  title,
  value,
}: Omit<ItemBaseProps, 'children'> & { onChange: (v: boolean) => void; value: boolean }) {
  return (
    <ItemRow disabled={disabled} tip={tip} title={title}>
      <Switch checked={value} disabled={disabled} onChange={onChange} size="small" />
    </ItemRow>
  );
}

function SelectItem<T extends string>({
  disabled,
  items,
  onChange,
  tip,
  title,
  value,
}: Omit<ItemBaseProps, 'children'> & {
  items: { label: ReactNode; value: T }[];
  onChange: (v: T) => void;
  value: T;
}) {
  return (
    <ItemRow disabled={disabled} tip={tip} title={title}>
      <Select className="w-40" disabled={disabled} onChange={onChange} options={items} size="small" value={value} />
    </ItemRow>
  );
}

function ToggleItem<T extends string>({
  disabled,
  items,
  onChange,
  title,
  value,
}: Omit<ItemBaseProps, 'children'> & {
  items: { label: ReactNode; value: T }[];
  onChange: (v: T) => void;
  value: T;
}) {
  return (
    <ItemRow disabled={disabled} title={title}>
      <Segmented disabled={disabled} onChange={(v) => onChange(v as T)} options={items} size="small" value={value} />
    </ItemRow>
  );
}

function NumberFieldItem({
  disabled,
  max,
  min,
  onChange,
  step,
  tip,
  title,
  value,
}: Omit<ItemBaseProps, 'children'> & {
  max?: number;
  min?: number;
  onChange: (v: number) => void;
  step?: number;
  value: number;
}) {
  return (
    <ItemRow disabled={disabled} tip={tip} title={title}>
      <InputNumber
        className="w-32"
        disabled={disabled}
        max={max}
        min={min}
        onChange={(v) => v !== null && onChange(Number(v))}
        size="small"
        step={step}
        value={value}
      />
    </ItemRow>
  );
}

function InputItem({
  disabled,
  onChange,
  placeholder,
  tip,
  title,
  value,
}: Omit<ItemBaseProps, 'children'> & { onChange: (v: string) => void; placeholder?: string; value: string }) {
  return (
    <ItemRow disabled={disabled} tip={tip} title={title}>
      <Input
        className="w-40"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="small"
        value={value}
      />
    </ItemRow>
  );
}

export { Block, InputItem, ItemRow, NumberFieldItem, SelectItem, SwitchItem, ToggleItem };
