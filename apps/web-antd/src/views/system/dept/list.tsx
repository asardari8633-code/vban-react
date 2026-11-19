import type { TableColumnsType } from 'antd';

import type { SystemApi } from '#/api';

import { App, Button, Popconfirm, Space, Tag } from 'antd';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { useVbenTable } from '#/adapter/table';
import { createDept, deleteDept, getDeptList, updateDept } from '#/api';
import { $t } from '#/locales';

/**
 * مدیریت بخش‌ها (جدول درختی)
 */
export default function SystemDeptList() {
  const { message } = App.useApp();

  const [DeptForm, formApi] = useVbenForm({
    layout: 'vertical',
    schema: [
      { component: 'Input', fieldName: 'name', label: $t('system.dept.deptName'), rules: [{ max: 20, message: $t('ui.formRules.maxLength', [$t('system.dept.deptName'), 20]), required: true }] },
      {
        component: 'ApiTreeSelect',
        componentProps: {
          allowClear: true,
          api: getDeptList,
          labelField: 'name',
          valueField: 'id',
        },
        fieldName: 'pid',
        label: $t('system.dept.parentDept'),
      },
      {
        component: 'RadioGroup',
        componentProps: {
          buttonStyle: 'solid',
          optionType: 'button',
          options: [
            { label: $t('common.enabled'), value: 1 },
            { label: $t('common.disabled'), value: 0 },
          ],
        },
        defaultValue: 1,
        fieldName: 'status',
        label: $t('system.dept.status'),
      },
      { component: 'Textarea', fieldName: 'remark', label: $t('system.dept.remark') },
    ],
    showDefaultActions: false,
  });

  const [FormModal, modalApi] = useVbenModal({
    onConfirm: async () => {
      const values = await formApi.validate().catch(() => null);
      if (!values) return;
      modalApi.lock();
      try {
        const row = modalApi.getData<Partial<SystemApi.Dept> | undefined>();
        await (row?.id ? updateDept(row.id, values) : createDept(values as any));
        message.success($t('ui.actionMessage.operationSuccess'));
        modalApi.close();
        await tableApi.reload();
      } finally {
        modalApi.unlock();
      }
    },
    onOpenChange: (open) => {
      if (!open) return;
      const row = modalApi.getData<Partial<SystemApi.Dept> | undefined>();
      setTimeout(() => {
        formApi.resetForm();
        if (row) formApi.setValues(row);
      });
    },
  });

  function openForm(row?: Partial<SystemApi.Dept>, isCreate = !row?.id) {
    modalApi
      .setData(row)
      .setState({ title: $t(isCreate ? 'ui.actionTitle.create' : 'ui.actionTitle.edit', [$t('system.dept.name')]) })
      .open();
  }

  const columns: TableColumnsType<SystemApi.Dept> = [
    { dataIndex: 'name', title: $t('system.dept.deptName'), width: 260 },
    {
      dataIndex: 'status',
      render: (status: number) =>
        status === 1 ? <Tag color="success">{$t('common.enabled')}</Tag> : <Tag color="error">{$t('common.disabled')}</Tag>,
      title: $t('system.dept.status'),
      width: 100,
    },
    { dataIndex: 'createTime', title: $t('system.dept.createTime'), width: 180 },
    { dataIndex: 'remark', ellipsis: true, title: $t('system.dept.remark') },
    {
      fixed: 'end',
      key: 'operation',
      render: (_, row) => (
        <Space>
          <Button onClick={() => openForm({ pid: row.id }, true)} size="small" type="link">
            {$t('ui.actionTitle.create', [''])}
          </Button>
          <Button onClick={() => openForm(row)} size="small" type="link">
            {$t('common.edit')}
          </Button>
          <Popconfirm
            disabled={!!row.children?.length}
            onConfirm={async () => {
              await deleteDept(row.id);
              message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
              await tableApi.reload();
            }}
            title={$t('ui.actionMessage.deleteConfirm', [row.name])}
          >
            <Button danger disabled={!!row.children?.length} size="small" type="link">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: $t('system.dept.operation'),
      width: 200,
    },
  ];

  const [Grid, tableApi] = useVbenTable<SystemApi.Dept>({
    api: () => getDeptList(),
    columns,
    pagination: false,
    tableProps: { expandable: { defaultExpandAllRows: true } },
    title: $t('system.dept.title'),
    toolbar: (
      <Button icon={<Plus className="size-4" />} onClick={() => openForm()} type="primary">
        {$t('ui.actionTitle.create', [$t('system.dept.name')])}
      </Button>
    ),
  });

  return (
    <Page autoContentHeight>
      <Grid />
      <FormModal>
        <DeptForm />
      </FormModal>
    </Page>
  );
}

