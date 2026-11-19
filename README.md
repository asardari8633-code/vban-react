# Vben Admin React

بازنویسی کامل [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) (نسخه‌ی ۵) با **React 19**، **Ant Design 6** و **TypeScript**؛ با رابط کاربری **فارسی** و چیدمان کاملاً **راست‌به‌چپ (RTL)**.

معماری monorepo، تنظیمات زنده‌ی ظاهر، هفت حالت چیدمان، کنترل دسترسی سمت کلاینت/سرور، زبانه‌ها با نگه‌داری وضعیت صفحه، فرم‌ساز schema-محور و سرور ماک جداگانه، همگی مطابق نسخه‌ی اصلی پیاده‌سازی شده‌اند.

## شروع سریع

پیش‌نیاز: Node.js نسخه‌ی ۲۰.۱۹ یا بالاتر.

```bash
npm install
npm run dev
```

دستور `npm run dev` دو سرویس را هم‌زمان اجرا می‌کند:

| سرویس | آدرس |
| --- | --- |
| برنامه‌ی وب (Vite) | http://localhost:5666 |
| سرور ماک (Hono) | http://localhost:5320/api |

حساب‌های آزمایشی (رمز عبور همه: `123456`):

| نام کاربری | نقش | صفحه‌ی خانه |
| --- | --- | --- |
| `vben` | super | میز کار |
| `admin` | admin | میز کار |
| `jack` | user | تحلیل‌ها |

### دستورات

| دستور | کار |
| --- | --- |
| `npm run dev` | اجرای سرور ماک و برنامه‌ی وب |
| `npm run dev:antd` | فقط برنامه‌ی وب |
| `npm run dev:mock` | فقط سرور ماک |
| `npm run build` | ساخت نسخه‌ی production در `apps/web-antd/dist` |
| `npm run preview` | پیش‌نمایش نسخه‌ی ساخته‌شده |
| `npm run typecheck` | بررسی نوع کل monorepo |

## ساختار پروژه

ساختار پوشه‌ها و نام پکیج‌ها با نسخه‌ی اصلی Vben یکی است:

```
apps/
  web-antd/                 برنامه‌ی اصلی (React + antd)
    src/
      adapter/              اتصال کامپوننت‌های antd به فرم‌ساز و جدول
      api/                  درخواست‌ها (request.ts + core/system/examples)
      layouts/              چیدمان پایه و احراز هویت برنامه
      locales/langs/fa-IR/  ترجمه‌های اختصاصی برنامه
      router/               مسیرها، نگهبان دسترسی و تولید مسیرهای پویا
      store/                store احراز هویت
      views/                صفحات
      preferences.ts        تنظیمات اختصاصی برنامه
  backend-mock/             سرور ماک (Hono + JWT + داده‌ی فارسی faker)
packages/
  @core/
    base/
      shared/               ابزارها: درخت، ادغام، رنگ، کش، تاریخ
      typings/              تایپ‌های پایه (مسیر، منو، زبانه، چیدمان)
      design/               توکن‌های طراحی CSS، انیمیشن‌ها
      icons/                آیکون‌ها (iconify + lucide)
    composables/            هوک‌های پایه (اسکرول، رسانه، تمام‌صفحه، ...)
    preferences/            مدیریت تنظیمات (zustand) و متغیرهای CSS
    ui-kit/
      base-ui/              کامپوننت‌های پایه (لوگو، دکمه‌ی آیکونی، اسکرول، ...)
      layout-ui/            VbenAdminLayout با هفت حالت چیدمان
      menu-ui/              منو (بر پایه‌ی antd Menu) و منوی دوستونه
      tabs-ui/              نوار زبانه‌ها (chrome / card / plain / brisk)
      form-ui/              فرم‌ساز schema-محور (useVbenForm)
      popup-ui/             مودال و کشو با API (useVbenModal / useVbenDrawer)
  effects/
    access/                 تولید مسیرهای قابل دسترس، useAccess، AccessControl
    common-ui/              صفحات ورود، خطا، داشبورد، پروفایل، Page، ...
    hooks/                  useRoute، useTabs، useRefresh، ...
    layouts/                BasicLayout، AuthPageLayout و ابزارک‌های سربرگ
    plugins/                ECharts
    request/                RequestClient (axios) با رهگیرها و refresh token
  constants/ icons/ locales/ preferences/ stores/ styles/ types/ utils/
internal/
  tsconfig/                 پیکربندی مشترک TypeScript
```

## مفاهیم اصلی

### تنظیمات (Preferences)

همه‌ی ظاهر برنامه از یک شیء تنظیمات می‌آید (`packages/@core/preferences/src/config.ts`). برای تغییر پیش‌فرض‌ها فقط مقادیر متفاوت را در `apps/web-antd/src/preferences.ts` بنویسید:

```ts
export const overridesPreferences = defineOverridesPreferences({
  app: { layout: 'sidebar-mixed-nav' },
  theme: { mode: 'light' },
});
```

تنظیمات کاربر در `localStorage` ذخیره می‌شود؛ پس از تغییر پیش‌فرض‌ها از «پاک کردن حافظه و خروج» در کشوی تنظیمات استفاده کنید. در کامپوننت‌ها از `usePreferences()` و خارج از React از `preferences` و `updatePreferences()` استفاده کنید.

### مسیرها و منو

مسیرها در `apps/web-antd/src/router/routes/modules/*.ts` تعریف می‌شوند و منو به‌طور خودکار از آن‌ها ساخته می‌شود. عنوان‌ها کلید ترجمه‌اند:

```ts
{
  name: 'Analytics',
  path: 'analytics',
  component: lazy(() => import('#/views/dashboard/analytics')),
  meta: { title: 'page.dashboard.analytics', icon: 'lucide:area-chart', affixTab: true },
}
```

فیلدهای `meta` همان فیلدهای Vben هستند: `authority`، `keepAlive`، `hideInMenu`، `hideInTab`، `activePath`، `badge`، `link`، `iframeSrc`، `menuVisibleWithForbidden`، `maxNumOfOpenTab` و ...

### کنترل دسترسی

مقدار `app.accessMode`:

- `frontend`: مسیرها با `meta.authority` و نقش کاربر فیلتر می‌شوند.
- `backend`: منوها از `GET /api/menu/all` دریافت و رشته‌ی `component` به فایل‌های `views` نگاشت می‌شود.
- `mixed`: ترکیب هر دو.

در سطح کامپوننت:

```tsx
<AccessControl codes={['AC_100100']} type="code">
  <Button>فقط با کد دسترسی</Button>
</AccessControl>

const { hasAccessByRoles, hasAccessByCodes } = useAccess();
```

### زبانه‌ها و نگه‌داری صفحه

صفحه‌هایی که `meta.keepAlive` دارند با کامپوننت `<Activity>` در React ۱۹ زنده نگه داشته می‌شوند؛ وضعیتشان هنگام جابه‌جایی بین زبانه‌ها حفظ می‌شود. هوک `useTabs()` عملیات بستن، سنجاق، تازه‌سازی و تغییر عنوان زبانه را فراهم می‌کند.

### فرم، مودال و جدول

```tsx
const [Form, formApi] = useVbenForm({
  schema: [{ component: 'Input', fieldName: 'name', label: 'نام', rules: 'required' }],
  handleSubmit: (values) => console.log(values),
});

const [Modal, modalApi] = useVbenModal({ title: 'ویرایش', onConfirm: save });
modalApi.setData(row).open();

const [Grid, tableApi] = useVbenTable({ api: getUserList, columns, formSchema });
```

کامپوننت‌های قابل استفاده در `schema` در `apps/web-antd/src/adapter/component.tsx` ثبت شده‌اند.

### درخواست‌ها

`requestClient` در `apps/web-antd/src/api/request.ts` توکن را اضافه می‌کند، پاسخ `{ code, data, message }` را باز می‌کند، خطای 401 را با ورود مجدد یا مودال انقضا مدیریت می‌کند و در صورت فعال بودن `enableRefreshToken` توکن را تازه می‌کند.

## تفاوت‌ها با نسخه‌ی Vue

| Vue Vben | این نسخه |
| --- | --- |
| Vue 3 + vue-router | React 19 + react-router 7 (`useRoutes` با مسیرهای پویا) |
| pinia | zustand |
| `<KeepAlive>` | `<Activity>` در React ۱۹ |
| router guard | کامپوننت `AccessGuard` |
| vue-i18n | i18next (درون‌یابی `{0}` حفظ شده است) |
| shadcn-ui + vee-validate | Ant Design 6 و `Form` آن |
| vxe-table | antd `Table` با `useVbenTable` |
| Nitro mock | Hono روی Node |
| pnpm + turbo | npm workspaces |

## ساخت و استقرار

```bash
npm run build
```

خروجی در `apps/web-antd/dist` است. آدرس API را با `VITE_GLOB_API_URL` در `apps/web-antd/.env.production` تنظیم کنید. سرور ماک فقط برای توسعه است و باید در production با API واقعی جایگزین شود.

## مجوز

MIT. بر پایه‌ی [Vue Vben Admin](https://github.com/vbenjs/vue-vben-admin) اثر vbenjs.

## دمو آنلاین

نسخه‌ی دمو روی GitHub Pages اجرا می‌شود و به بک‌اند نیاز ندارد: سرور ماک (Hono) داخل مرورگر اجرا می‌شود
(`npm run build:demo`). ورود: `vben` / `123456` (یا `admin`، `jack` با همان رمز).
