import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

type FormatDate = Date | dayjs.Dayjs | number | string;

let currentTimezone = 'Asia/Tehran';

function setCurrentTimezone(tz?: string) {
  if (tz) currentTimezone = tz;
}

function getCurrentTimezone() {
  return currentTimezone;
}

function getSystemTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * قالب‌بندی تاریخ میلادی با dayjs
 */
function formatDate(time: FormatDate, format = 'YYYY-MM-DD') {
  try {
    const date = dayjs.isDayjs(time) ? time : dayjs(time);
    if (!date.isValid()) return String(time);
    return date.tz(currentTimezone).format(format);
  } catch {
    return String(time);
  }
}

function formatDateTime(time: FormatDate) {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss');
}

/**
 * قالب‌بندی تاریخ به تقویم شمسی با Intl (fa-IR)
 */
function formatJalali(
  time: FormatDate,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  const date = dayjs.isDayjs(time) ? time.toDate() : new Date(time as any);
  if (Number.isNaN(date.getTime())) return String(time);
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: currentTimezone,
    ...options,
  }).format(date);
}

function formatJalaliDateTime(time: FormatDate) {
  return formatJalali(time, { dateStyle: 'medium', timeStyle: 'short' });
}

export {
  dayjs,
  formatDate,
  formatDateTime,
  formatJalali,
  formatJalaliDateTime,
  getCurrentTimezone,
  getSystemTimezone,
  setCurrentTimezone,
};
