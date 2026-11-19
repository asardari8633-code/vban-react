import type { MessageInstance } from 'antd/es/message/interface';
import type { HookAPI as ModalHookAPI } from 'antd/es/modal/useModal';
import type { NotificationInstance } from 'antd/es/notification/interface';

import { App, message as staticMessage, Modal, notification as staticNotification } from 'antd';

let messageApi: MessageInstance = staticMessage;
let notificationApi: NotificationInstance = staticNotification;
let modalApi: ModalHookAPI = Modal as unknown as ModalHookAPI;

/**
 * اتصال message/notification/modal زمینه‌دار antd برای استفاده خارج از کامپوننت‌ها
 * (مثلاً در رهگیرهای درخواست) تا تم و جهت RTL رعایت شود.
 */
function AntdStaticBinder() {
  const app = App.useApp();
  messageApi = app.message;
  notificationApi = app.notification;
  modalApi = app.modal;
  return null;
}

const message = new Proxy({} as MessageInstance, {
  get: (_, key) => (messageApi as any)[key],
});

const notification = new Proxy({} as NotificationInstance, {
  get: (_, key) => (notificationApi as any)[key],
});

const modal = new Proxy({} as ModalHookAPI, {
  get: (_, key) => (modalApi as any)[key],
});

export { AntdStaticBinder, message, modal, notification };
