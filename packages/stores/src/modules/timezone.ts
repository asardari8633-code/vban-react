import type { TimezoneOption } from '@vben-core/typings';

import { DEFAULT_TIME_ZONE_OPTIONS, preferences } from '@vben-core/preferences';
import { setCurrentTimezone } from '@vben-core/shared';
import { create } from 'zustand';

interface TimezoneHandler {
  getTimezone?: () => Promise<null | string | undefined>;
  getTimezoneOptions?: () => Promise<TimezoneOption[]>;
  setTimezone?: (timezone: string) => Promise<void>;
}

let handler: TimezoneHandler = {};

/**
 * ثبت توابع ارتباط با سرور برای منطقه‌ی زمانی
 */
function setTimezoneHandler(value: TimezoneHandler) {
  handler = value;
}

interface TimezoneState {
  initTimezone: () => Promise<void>;
  loadTimezoneOptions: () => Promise<TimezoneOption[]>;
  setTimezone: (timezone: string) => Promise<void>;
  timezone: string;
}

const useTimezoneStore = create<TimezoneState>()((set) => ({
  initTimezone: async () => {
    const tz = (await handler.getTimezone?.()) || preferences.app.timezone;
    setCurrentTimezone(tz);
    set({ timezone: tz });
  },
  loadTimezoneOptions: async () => {
    const options = await handler.getTimezoneOptions?.();
    return options?.length ? options : DEFAULT_TIME_ZONE_OPTIONS;
  },
  setTimezone: async (timezone) => {
    await handler.setTimezone?.(timezone);
    setCurrentTimezone(timezone);
    set({ timezone });
  },
  timezone: 'Asia/Tehran',
}));

export { setTimezoneHandler, useTimezoneStore };
export type { TimezoneHandler };
