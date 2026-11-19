import type { TableColumnsType } from 'antd';

import type { SystemApi } from '#/api';

import { useEffect, useState } from 'react';

import { App, Button, Popconfirm, Space, Switch, Tree } from 'antd';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus, VbenIcon } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { useVbenTable } from '#/adapter/table';
import { createRole, deleteRole, getMenuList, getRoleList, updateRole } from '#/api';
import { $t } from '#/locales';

function toPermissionTree(menus: SystemApi.SystemMenu[]): any[] {
  return menus.map((menu) => ({
    children: menu.children?.length ? toPermissionTree(menu.children) : undefined,
    icon: menu.meta?.icon ? <VbenIcon icon={menu.meta.icon} size={14} /> : undefined,
    key: menu.id,
    title: $t(menu.meta?.title ?? menu.name),
  }));
}

/**
 * مدیریت نقش‌ها
 */
export default function SystemRoleList() {
  const { message } = App.useApp();
  const [permissionTree, setPermissionTree] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

  useEffect(() => {
    void getMenuList().then((list) => setPermissionTree(toPermissionTree(list)));
  }, []);

  const [RoleForm, formApi] = useVbenForm({
    layout: 'vertical',
    schema: [
      { component: 'Input', fieldName: 'name', label: $t('system.role.roleName'), rules: 'required' },
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
        label: $t('system.role.status'),
      },
      { component: 'Textarea', fieldName: 'remark', label: $t('system.role.remark') },
    ],
    showDefaultActions: false,
  });

  const [FormDrawer, drawerApi] = useVbenDrawer({
    onConfirm: async () => {
      const values = await formApi.validate().catch(() => null);
      if (!values) return;
      drawerApi.lock();
      try {
        const row = drawerApi.getData<SystemApi.Role | undefined>();
        const payload = { ...values, permissions: checkedKeys };
        await (row?.id ? updateRole(row.id, payload) : createRole(payload as any));
        message.success($t('ui.actionMessage.operationSuccess'));
        drawerApi.close();
        await tableApi.reload();
      } finally {
        drawerApi.unlock();
      }
    },
    onOpenChange: (open) => {
      if (!open) return;
      const row = drawerApi.getData<SystemApi.Role | undefined>();
      setCheckedKeys(row?.permissions ?? []);
      setTimeout(() => {
        formApi.resetForm();
        if (row) formApi.setValues(row);
      });
    },
  });

  const columns: TableColumnsType<SystemApi.Role> = [
    { dataIndex: 'name', title: $t('system.role.roleName'), width: 180 },
    { dataIndex: 'id', ellipsis: true, title: $t('system.role.id'), width: 220 },
    {
      dataIndex: 'status',
      render: (status: number, row) => (
        <Switch
          checked={status === 1}
          checkedChildren={$t('common.enabled')}
          onChange={async (checked) => {
            await updateRole(row.id, { status: checked ? 1 : 0 });
            message.success($t('ui.actionMessage.operationSuccess'));
            await tableApi.reload();
          }}
          unCheckedChildren={$t('common.disabled')}
        />
      ),
      title: $t('system.role.status'),
      width: 110,
    },
    { dataIndex: 'remark', ellipsis: true, title: $t('system.role.remark'), width: 260 },
    { dataIndex: 'createTime', sorter: true, title: $t('system.role.createTime'), width: 180 },
    {
      fixed: 'end',
      key: 'operation',
      render: (_, row) => (
        <Space>
          <Button onClick={() => drawerApi.setData(row).setState({ title: $t('ui.actionTitle.edit', [$t('system.role.name')]) }).open()} size="small" type="link">
            {$t('common.edit')}
          </Button>
          <Popconfirm
            onConfirm={async () => {
              await deleteRole(row.id);
              message.success($t('ui.actionMessage.deleteSuccess', [row.name]));
              await tableApi.reload();
            }}
            title={$t('ui.actionMessage.deleteConfirm', [row.name])}
          >
            <Button danger size="small" type="link">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: $t('system.role.operation'),
      width: 140,
    },
  ];

  const [Grid, tableApi] = useVbenTable<SystemApi.Role>({
    api: getRoleList,
    columns,
    formSchema: [
      { component: 'Input', fieldName: 'name', label: $t('system.role.roleName') },
      { component: 'Input', fieldName: 'id', label: $t('system.role.id') },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('common.enabled'), value: 1 },
            { label: $t('common.disabled'), value: 0 },
          ],
        },
        fieldName: 'status',
        label: $t('system.role.status'),
      },
      { component: 'Input', fieldName: 'remark', label: $t('system.role.remark') },
    ],
    title: $t('system.role.list'),
    toolbar: (
      <Button
        icon={<Plus className="size-4" />}
        onClick={() => drawerApi.setData(undefined).setState({ title: $t('ui.actionTitle.create', [$t('system.role.name')]) }).open()}
        type="primary"
      >
        {$t('ui.actionTitle.create', [$t('system.role.name')])}
      </Button>
    ),
  });

  return (
    <Page autoContentHeight>
      <Grid />
      <FormDrawer width={520}>
        <RoleForm />
        <div className="mb-2 font-medium">{$t('system.role.permissions')}</div>
        <div className="rounded-md border border-border p-2">
          <Tree
            checkable
            checkedKeys={checkedKeys}
            defaultExpandAll
            onCheck={(keys) => setCheckedKeys((Array.isArray(keys) ? keys : keys.checked) as number[])}
            showIcon
            treeData={permissionTree}
          />
        </div>
      </FormDrawer>
    </Page>
  );
}
