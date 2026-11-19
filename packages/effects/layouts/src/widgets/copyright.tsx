import type { CopyrightPreferences } from '@vben/preferences';

/**
 * متن کپی‌رایت پاورقی
 */
function Copyright({ companyName, companySiteLink, date, icp, icpLink }: Partial<CopyrightPreferences>) {
  return (
    <div className="flex-center text-md text-muted-foreground">
      {icp && (
        <a className="vben-link mx-1" href={icpLink || 'javascript:void(0)'} rel="noreferrer" target="_blank">
          {icp}
        </a>
      )}
      <span dir="ltr">Copyright © {date}</span>
      {companyName && (
        <a className="vben-link mx-1" href={companySiteLink || 'javascript:void(0)'} rel="noreferrer" target="_blank">
          {companyName}
        </a>
      )}
    </div>
  );
}

export { Copyright };
