import type { ComponentType, ReactNode } from 'react';

import { useEffect } from 'react';

import { App, Dropdown, Tag } from 'antd';

import { LockKeyhole, LogOut, VbenIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import { VbenAvatar } from '@vben-core/base-ui';
import { isMacOs } from '@vben-core/shared';

import { useLockScreenModal } from './lock-screen';

interface UserDropdownMenu {
  handler: () => void;
  icon?: ComponentType<any> | string;
  text: ReactNode;
}

interface UserDropdownProps {
  avatar?: string;
  description?: ReactNode;
  /** آیتم‌های اضافه‌ی بالای منو */
  extraItems?: ReactNode;
  menus?: UserDropdownMenu[];
  onLogout?: () => void;
  tagText?: ReactNode;
  text?: ReactNode;
}

const altKey = isMacOs() ? '⌥' : 'Alt';

/**
 * منوی کاربر در سربرگ: اطلاعات کاربر، منوها، قفل صفحه و خروج
 */
function UserDropdown({ avatar, description, extraItems, menus = [], onLogout, tagText, text }: UserDropdownProps) {
  const { globalLockScreenShortcutKey, globalLogoutShortcutKey, preferences } = usePreferences();
  const { modal } = App.useApp();
  const { node: lockModal, open: openLockModal } = useLockScreenModal(avatar, text);
  const enableLockScreen = preferences.widget.lockScreen;

  function handleLogout() {
    modal.confirm({
      cancelText: $t('common.cancel'),
      centered: true,
      content: $t('ui.widgets.logoutTip'),
      okText: $t('common.confirm'),
      onOk: () => onLogout?.(),
      title: $t('common.prompt'),
    });
  }

  // میان‌برهای سراسری: Alt+Q خروج، Alt+L قفل صفحه
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.code === 'KeyQ' && globalLogoutShortcutKey) {
        e.preventDefault();
        handleLogout();
      }
      if (e.code === 'KeyL' && globalLockScreenShortcutKey && enableLockScreen) {
        e.preventDefault();
        openLockModal();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const items: any[] = [
    {
      disabled: true,
      key: 'header',
      label: (
        <div className="flex cursor-default items-center gap-3 py-2 text-foreground">
          <VbenAvatar dot size={40} src={avatar} />
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {text}
              {tagText && <Tag color="green">{tagText}</Tag>}
            </div>
            <div className="text-xs text-muted-foreground">{description}</div>
          </div>
        </div>
      ),
    },
    { key: 'divider-1', type: 'divider' },
    ...menus.map((menu, index) => ({
      icon: <VbenIcon icon={menu.icon} size={16} />,
      key: `menu-${index}`,
      label: menu.text,
      onClick: menu.handler,
    })),
    { key: 'divider-2', type: 'divider' },
    ...(enableLockScreen
      ? [
          {
            extra: globalLockScreenShortcutKey ? <span className="text-xs opacity-60">{altKey} L</span> : undefined,
            icon: <LockKeyhole className="size-4" />,
            key: 'lock',
            label: $t('ui.widgets.lockScreen.title'),
            onClick: openLockModal,
          },
        ]
      : []),
    {
      extra: globalLogoutShortcutKey ? <span className="text-xs opacity-60">{altKey} Q</span> : undefined,
      icon: <LogOut className="size-4" />,
      key: 'logout',
      label: $t('common.logout'),
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        popupRender={(menuNode) => (
          <div className="min-w-60">
            {extraItems}
            {menuNode}
          </div>
        )}
        trigger={['click']}
      >
        <div className="ms-1 me-2 flex cursor-pointer items-center rounded-full p-1.5 hover:bg-accent">
          <VbenAvatar dot size={32} src={avatar} />
        </div>
      </Dropdown>
      {lockModal}
    </>
  );
}

export { UserDropdown };
export type { UserDropdownMenu, UserDropdownProps };
