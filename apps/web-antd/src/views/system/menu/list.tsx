import type { TableColumnsType } from 'antd';

import type { VbenFormSchema } from '#/adapter/form';
import type { SystemApi } from '#/api';

import { App, Button, Popconfirm, Space, Tag } from 'antd';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus, VbenIcon } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { useVbenTable } from '#/adapter/table';
import { createMenu, deleteMenu, getMenuList, isMenuNameExists, isMenuPathExists, updateMenu } from '#/api';
import { $t } from '#/locales';

const typeMeta: Record<SystemApi.SystemMenu['type'], { color: string; label: string }> = {
  button: { color: 'warning', label: 'system.menu.typeButton' },
  catalog: { color: 'processing', label: 'system.menu.typeCatalog' },
  embedded: { color: 'purple', label: 'system.menu.typeEmbedded' },
  link: { color: 'cyan', label: 'system.menu.typeLink' },
  menu: { color: 'success', label: 'system.menu.typeMenu' },
};

const isType = (values: Record<string, any>, types: string[]) => types.includes(values.type);

function useMenuFormSchema(getEditingId: () => number | string | undefined): VbenFormSchema[] {
  const flag = (fieldName: string, label: string, types = ['catalog', 'embedded', 'menu']): VbenFormSchema => ({
    component: 'Switch',
    dependencies: { show: (v) => isType(v, types), triggerFields: ['type'] },
    fieldName,
    formItemProps: { layout: 'horizontal' },
    label: $t(label),
  });

  return [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        optionType: 'button',
        options: (Object.keys(typeMeta) as SystemApi.SystemMenu['type'][]).map((key) => ({
          label: $t(typeMeta[key].label),
          value: key,
        })),
      },
      defaultValue: 'menu',
      fieldName: 'type',
      formItemClass: 'col-span-2',
      label: $t('system.menu.type'),
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.menu.menuName'),
      rules: [
        { message: $t('ui.formRules.required', [$t('system.menu.menuName')]), required: true },
        {
          validator: async (_: unknown, value: string) => {
            if (value && (await isMenuNameExists(value, getEditingId()))) {
              throw new Error($t('ui.formRules.alreadyExists', [$t('system.menu.menuName'), value]));
            }
          },
        },
      ],
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        api: getMenuList,
        labelField: 'name',
        valueField: 'id',
      },
      fieldName: 'pid',
      label: $t('system.menu.parent'),
    },
    {
      component: 'Input',
      dependencies: { show: (v) => !isType(v, ['button']), triggerFields: ['type'] },
      fieldName: 'meta.title',
      label: $t('system.menu.menuTitle'),
      rules: 'required',
    },
    {
      component: 'Input',
      dependencies: {
        rules: (v) =>
          isType(v, ['button'])
            ? []
            : [
                { message: $t('ui.formRules.required', [$t('system.menu.path')]), required: true },
                {
                  validator: async (_: unknown, value: string) => {
                    if (value && (await isMenuPathExists(value, getEditingId()))) {
                      throw new Error($t('ui.formRules.alreadyExists', [$t('system.menu.path'), value]));
                    }
                  },
                },
              ],
        show: (v) => !isType(v, ['button']),
        triggerFields: ['type'],
      },
      fieldName: 'path',
      label: $t('system.menu.path'),
    },
    {
      component: 'Input',
      dependencies: { show: (v) => isType(v, ['embedded', 'menu']), triggerFields: ['type'] },
      fieldName: 'meta.activePath',
      help: $t('system.menu.activePathHelp'),
      label: $t('system.menu.activePath'),
    },
    {
      component: 'Input',
      componentProps: { placeholder: 'mdi:home' },
      dependencies: { show: (v) => !isType(v, ['button']), triggerFields: ['type'] },
      fieldName: 'meta.icon',
      label: $t('system.menu.icon'),
    },
    {
      component: 'Input',
      dependencies: {
        required: (v) => isType(v, ['menu']),
        show: (v) => isType(v, ['menu']),
        triggerFields: ['type'],
      },
      fieldName: 'component',
      label: $t('system.menu.component'),
    },
    {
      component: 'Input',
      dependencies: {
        required: (v) => isType(v, ['embedded', 'link']),
        show: (v) => isType(v, ['embedded', 'link']),
        triggerFields: ['type'],
      },
      fieldName: 'linkSrc',
      label: $t('system.menu.linkSrc'),
      rules: [{ message: $t('ui.formRules.invalidURL'), type: 'url' }],
    },
    {
      component: 'Input',
      dependencies: { show: (v) => !isType(v, ['catalog']), triggerFields: ['type'] },
      fieldName: 'authCode',
      label: $t('system.menu.authCode'),
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
      label: $t('system.menu.status'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('system.menu.badgeType.dot'), value: 'dot' },
          { label: $t('system.menu.badgeType.normal'), value: 'normal' },
        ],
      },
      dependencies: { show: (v) => !isType(v, ['button']), triggerFields: ['type'] },
      fieldName: 'meta.badgeType',
      label: $t('system.menu.badgeType.title'),
    },
    {
      component: 'Input',
      dependencies: {
        show: (v) => !isType(v, ['button']) && v.meta?.badgeType === 'normal',
        triggerFields: ['type', 'meta.badgeType'],
      },
      fieldName: 'meta.badge',
      label: $t('system.menu.badge'),
    },
    {
      component: 'Divider',
      componentProps: { children: $t('system.menu.advancedSettings'), orientation: 'center' },
      dependencies: { show: (v) => !isType(v, ['button', 'link']), triggerFields: ['type'] },
      fieldName: 'divider1',
    },
    flag('meta.keepAlive', 'system.menu.keepAlive', ['menu']),
    flag('meta.affixTab', 'system.menu.affixTab', ['embedded', 'menu']),
    flag('meta.hideInMenu', 'system.menu.hideInMenu'),
    flag('meta.hideChildrenInMenu', 'system.menu.hideChildrenInMenu', ['catalog', 'menu']),
    flag('meta.hideInBreadcrumb', 'system.menu.hideInBreadcrumb'),
    flag('meta.hideInTab', 'system.menu.hideInTab'),
  ];
}

/**
 * مدیریت منوها
 */
export default function SystemMenuList() {
  const { message } = App.useApp();

  const [MenuForm, formApi] = useVbenForm({
    layout: 'vertical',
    schema: useMenuFormSchema(() => drawerApi.getData<SystemApi.SystemMenu | undefined>()?.id),
    showDefaultActions: false,
    wrapperClass: 'grid-cols-2 gap-x-4',
  });

  const [FormDrawer, drawerApi] = useVbenDrawer({
    onConfirm: async () => {
      const values = await formApi.validate().catch(() => null);
      if (!values) return;
      drawerApi.lock();
      try {
        const row = drawerApi.getData<SystemApi.SystemMenu | undefined>();
        const { linkSrc, ...rest } = values;
        const payload = {
          ...rest,
          meta: {
            ...rest.meta,
            ...(rest.type === 'link' ? { link: linkSrc } : {}),
            ...(rest.type === 'embedded' ? { iframeSrc: linkSrc } : {}),
          },
        };
        await (row?.id ? updateMenu(row.id, payload) : createMenu(payload));
        message.success($t('ui.actionMessage.operationSuccess'));
        drawerApi.close();
        await tableApi.reload();
      } finally {
        drawerApi.unlock();
      }
    },
    onOpenChange: (open) => {
      if (!open) return;
      const row = drawerApi.getData<Partial<SystemApi.SystemMenu> | undefined>();
      setTimeout(() => {
        formApi.resetForm();
        if (row) {
          formApi.setValues({
            ...row,
            linkSrc: row.meta?.link ?? row.meta?.iframeSrc,
          });
        }
      });
    },
  });

  function openForm(row?: Partial<SystemApi.SystemMenu>, isCreate = !row?.id) {
    drawerApi
      .setData(row)
      .setState({ title: $t(isCreate ? 'ui.actionTitle.create' : 'ui.actionTitle.edit', [$t('system.menu.name')]) })
      .open();
  }

  const columns: TableColumnsType<SystemApi.SystemMenu> = [
    {
      dataIndex: ['meta', 'title'],
      render: (_, row) => (
        <span className="inline-flex items-center gap-2">
          {row.meta?.icon && <VbenIcon icon={row.meta.icon} size={16} />}
          {$t(row.meta?.title ?? row.name)}
        </span>
      ),
      title: $t('system.menu.menuTitle'),
      width: 240,
    },
    {
      dataIndex: 'type',
      render: (type: SystemApi.SystemMenu['type']) => <Tag color={typeMeta[type]?.color}>{$t(typeMeta[type]?.label)}</Tag>,
      title: $t('system.menu.type'),
      width: 110,
    },
    { dataIndex: 'authCode', title: $t('system.menu.authCode'), width: 180 },
    { dataIndex: 'path', render: (v) => <code dir="ltr">{v}</code>, title: $t('system.menu.path'), width: 200 },
    { dataIndex: 'component', render: (v) => <code dir="ltr">{v}</code>, title: $t('system.menu.component'), width: 220 },
    {
      dataIndex: 'status',
      render: (status: number) =>
        status === 1 ? <Tag color="success">{$t('common.enabled')}</Tag> : <Tag color="error">{$t('common.disabled')}</Tag>,
      title: $t('system.menu.status'),
      width: 100,
    },
    {
      fixed: 'end',
      key: 'operation',
      render: (_, row) => (
        <Space>
          {row.type !== 'button' && (
            <Button onClick={() => openForm({ pid: row.id }, true)} size="small" type="link">
              {$t('common.create')}
            </Button>
          )}
          <Button onClick={() => openForm(row)} size="small" type="link">
            {$t('common.edit')}
          </Button>
          <Popconfirm
            onConfirm={async () => {
              await deleteMenu(row.id);
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
      title: $t('system.menu.operation'),
      width: 200,
    },
  ];

  const [Grid, tableApi] = useVbenTable<SystemApi.SystemMenu>({
    api: () => getMenuList(),
    columns,
    pagination: false,
    title: $t('system.menu.title'),
    toolbar: (
      <Button icon={<Plus className="size-4" />} onClick={() => openForm()} type="primary">
        {$t('ui.actionTitle.create', [$t('system.menu.name')])}
      </Button>
    ),
  });

  return (
    <Page autoContentHeight>
      <Grid />
      <FormDrawer width={640}>
        <MenuForm />
      </FormDrawer>
    </Page>
  );
}
