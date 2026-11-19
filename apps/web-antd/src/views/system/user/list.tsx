import type { TableColumnsType } from 'antd';

import type { SystemApi } from '#/api';

import { useEffect, useMemo, useState } from 'react';

import { App, Button, Card, Input, Popconfirm, Space, Switch, Tag, Tree } from 'antd';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus, Search } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { useVbenTable } from '#/adapter/table';
import { createUser, deleteUser, getDeptList, getUserList, updateUser } from '#/api';
import { $t } from '#/locales';

function toTreeData(list: SystemApi.Dept[]): any[] {
  return list.map((d) => ({ children: d.children ? toTreeData(d.children) : undefined, key: d.id, title: d.name, value: d.id }));
}

/**
 * مدیریت کاربران
 */
export default function SystemUserList() {
  const { message } = App.useApp();
  const [depts, setDepts] = useState<SystemApi.Dept[]>([]);
  const [deptKeyword, setDeptKeyword] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>();

  useEffect(() => {
    void getDeptList().then(setDepts);
  }, []);

  const deptMap = useMemo(() => {
    const map = new Map<string, string>();
    const walk = (list: SystemApi.Dept[]) =>
      list.forEach((d) => {
        map.set(d.id, d.name);
        if (d.children) walk(d.children);
      });
    walk(depts);
    return map;
  }, [depts]);

  const treeData = useMemo(() => {
    const filter = (nodes: any[]): any[] =>
      nodes
        .map((n) => ({ ...n, children: n.children ? filter(n.children) : undefined }))
        .filter((n) => !deptKeyword || n.title.includes(deptKeyword) || n.children?.length);
    return filter(toTreeData(depts));
  }, [depts, deptKeyword]);

  const [FormModal, modalApi] = useVbenModal({
    onConfirm: async () => {
      const values = await formApi.validate().catch(() => null);
      if (!values) return;
      modalApi.lock();
      try {
        const row = modalApi.getData<SystemApi.User | undefined>();
        const payload = { ...values, status: (values.status ? 1 : 0) as 0 | 1 };
        await (row?.id ? updateUser(row.id, payload) : createUser(payload));
        message.success($t('ui.actionMessage.operationSuccess'));
        modalApi.close();
        await tableApi.reload();
      } finally {
        modalApi.unlock();
      }
    },
    onOpenChange: (open) => {
      if (!open) return;
      const row = modalApi.getData<SystemApi.User | undefined>();
      setTimeout(() => {
        formApi.resetForm();
        if (row) formApi.setValues({ ...row, status: row.status === 1 });
      });
    },
  });

  const [UserForm, formApi] = useVbenForm({
    layout: 'vertical',
    schema: [
      { component: 'Input', fieldName: 'userName', label: $t('system.user.userName'), rules: 'required' },
      {
        component: 'TreeSelect',
        componentProps: { treeData: toTreeData(depts), treeDefaultExpandAll: true },
        fieldName: 'deptId',
        label: $t('system.user.dept'),
        rules: 'selectRequired',
      },
      {
        component: 'RadioGroup',
        componentProps: {
          options: [
            { label: $t('system.user.male'), value: 1 },
            { label: $t('system.user.female'), value: 2 },
          ],
        },
        defaultValue: 1,
        fieldName: 'gender',
        label: $t('system.user.gender'),
      },
      { component: 'Input', fieldName: 'mobile', label: $t('system.user.mobile'), rules: [{ message: 'شماره‌ی موبایل نامعتبر است', pattern: /^09\d{9}$/ }] },
      { component: 'Input', fieldName: 'email', label: $t('system.user.email'), rules: [{ message: 'ایمیل نامعتبر است', type: 'email' }] },
      { component: 'Switch', defaultValue: true, fieldName: 'status', label: $t('system.user.status') },
      { component: 'Textarea', fieldName: 'remark', formItemClass: 'col-span-2', label: $t('system.user.remark') },
    ],
    showDefaultActions: false,
    wrapperClass: 'grid-cols-2',
  });

  // درخت بخش‌ها پس از بارگذاری در فرم قرار می‌گیرد
  useEffect(() => {
    formApi.updateSchema([
      { componentProps: { treeData: toTreeData(depts), treeDefaultExpandAll: true }, fieldName: 'deptId' },
    ]);
  }, [depts, formApi]);

  const columns: TableColumnsType<SystemApi.User> = [
    { dataIndex: 'userName', title: $t('system.user.userName'), width: 160 },
    { dataIndex: 'deptId', render: (id: string) => deptMap.get(id) ?? '-', title: $t('system.user.dept'), width: 200 },
    {
      dataIndex: 'gender',
      render: (g: number) => (g === 1 ? <Tag color="blue">{$t('system.user.male')}</Tag> : <Tag color="pink">{$t('system.user.female')}</Tag>),
      title: $t('system.user.gender'),
      width: 90,
    },
    { dataIndex: 'mobile', render: (v: string) => <span dir="ltr">{v}</span>, title: $t('system.user.mobile'), width: 140 },
    { dataIndex: 'email', title: $t('system.user.email'), width: 220 },
    {
      dataIndex: 'status',
      render: (status: number, row) => (
        <Switch
          checked={status === 1}
          onChange={async (checked) => {
            await updateUser(row.id, { status: checked ? 1 : 0 });
            message.success($t('ui.actionMessage.operationSuccess'));
            await tableApi.reload();
          }}
          size="small"
        />
      ),
      title: $t('system.user.status'),
      width: 90,
    },
    { dataIndex: 'createTime', title: $t('system.user.createTime'), width: 170 },
    {
      fixed: 'end',
      key: 'operation',
      render: (_, row) => (
        <Space>
          <Button onClick={() => modalApi.setData(row).setState({ title: $t('ui.actionTitle.edit', [$t('system.user.name')]) }).open()} size="small" type="link">
            {$t('common.edit')}
          </Button>
          <Popconfirm
            onConfirm={async () => {
              await deleteUser(row.id);
              message.success($t('ui.actionMessage.deleteSuccess', [row.userName]));
              await tableApi.reload();
            }}
            title={$t('ui.actionMessage.deleteConfirm', [row.userName])}
          >
            <Button danger size="small" type="link">
              {$t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: $t('system.user.operation'),
      width: 140,
    },
  ];

  const [Grid, tableApi] = useVbenTable<SystemApi.User>({
    api: getUserList,
    columns,
    formSchema: [
      { component: 'Input', fieldName: 'userName', label: $t('system.user.userName') },
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
        label: $t('system.user.status'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: $t('system.user.male'), value: 1 },
            { label: $t('system.user.female'), value: 2 },
          ],
        },
        fieldName: 'gender',
        label: $t('system.user.gender'),
      },
    ],
    title: $t('system.user.list'),
    toolbar: (
      <Button
        icon={<Plus className="size-4" />}
        onClick={() => modalApi.setData(undefined).setState({ title: $t('ui.actionTitle.create', [$t('system.user.name')]) }).open()}
        type="primary"
      >
        {$t('ui.actionTitle.create', [$t('system.user.name')])}
      </Button>
    ),
  });

  return (
    <Page autoContentHeight>
      <div className="flex flex-col gap-4 lg:flex-row">
        <Card className="w-full shrink-0 lg:w-64" size="small" title={$t('system.dept.title')}>
          <Input
            allowClear
            className="mb-3"
            onChange={(e) => setDeptKeyword(e.target.value)}
            placeholder={$t('system.user.placeholder')}
            prefix={<Search className="size-4 text-muted-foreground" />}
          />
          {treeData.length > 0 && (
            <Tree
              blockNode
              defaultExpandAll
              onSelect={(keys) => {
                const id = keys[0] as string | undefined;
                setSelectedDept(id);
                tableApi.setExtraParams(id ? { deptId: id } : {});
                void tableApi.query();
              }}
              selectedKeys={selectedDept ? [selectedDept] : []}
              treeData={treeData}
            />
          )}
        </Card>
        <div className="min-w-0 flex-1">
          <Grid />
        </div>
      </div>
      <FormModal width={640}>
        <UserForm />
      </FormModal>
    </Page>
  );
}
