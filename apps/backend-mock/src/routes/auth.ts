import { Hono } from 'hono';

import {
  clearRefreshTokenCookie,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenFromCookie,
  setRefreshTokenCookie,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { MOCK_CODES, MOCK_MENUS, MOCK_USERS } from '../utils/mock-data';
import {
  forbiddenResponse,
  unAuthorizedResponse,
  useResponseError,
  useResponseSuccess,
} from '../utils/response';

const auth = new Hono();

/** ورود */
auth.post('/auth/login', async (c) => {
  const { password, username } = await c.req.json().catch(() => ({}));
  if (!password || !username) {
    return c.json(useResponseError('BadRequestException', 'نام کاربری و رمز عبور الزامی است'), 400);
  }
  const findUser = MOCK_USERS.find((item) => item.username === username && item.password === password);
  if (!findUser) {
    clearRefreshTokenCookie(c);
    return forbiddenResponse(c, 'نام کاربری یا رمز عبور نادرست است.');
  }
  const accessToken = await generateAccessToken(findUser);
  const refreshToken = await generateRefreshToken(findUser);
  setRefreshTokenCookie(c, refreshToken);
  const { password: _pwd, ...user } = findUser;
  return c.json(useResponseSuccess({ ...user, accessToken }));
});

/** خروج */
auth.post('/auth/logout', (c) => {
  clearRefreshTokenCookie(c);
  return c.json(useResponseSuccess(''));
});

/** تازه‌سازی توکن با refresh token در کوکی */
auth.post('/auth/refresh', async (c) => {
  const refreshToken = getRefreshTokenFromCookie(c);
  if (!refreshToken) return forbiddenResponse(c);
  clearRefreshTokenCookie(c);
  const userinfo = await verifyRefreshToken(refreshToken);
  if (!userinfo) return forbiddenResponse(c);
  const findUser = MOCK_USERS.find((item) => item.username === userinfo.username);
  if (!findUser) return forbiddenResponse(c);
  const accessToken = await generateAccessToken(findUser);
  setRefreshTokenCookie(c, refreshToken);
  // مانند نسخه‌ی اصلی، توکن خام برگردانده می‌شود
  return c.text(accessToken);
});

/** کدهای دسترسی کاربر */
auth.get('/auth/codes', async (c) => {
  const userinfo = await verifyAccessToken(c);
  if (!userinfo) return unAuthorizedResponse(c);
  const codes = MOCK_CODES.find((item) => item.username === userinfo.username)?.codes ?? [];
  return c.json(useResponseSuccess(codes));
});

/** اطلاعات کاربر */
auth.get('/user/info', async (c) => {
  const userinfo = await verifyAccessToken(c);
  if (!userinfo) return unAuthorizedResponse(c);
  return c.json(
    useResponseSuccess({
      ...userinfo,
      avatar: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/avatar-v1.webp',
      desc: 'مدیر ارشد سامانه',
      userId: String(userinfo.id),
    }),
  );
});

/** منوهای کاربر (حالت دسترسی backend) */
auth.get('/menu/all', async (c) => {
  const userinfo = await verifyAccessToken(c);
  if (!userinfo) return unAuthorizedResponse(c);
  const menus = MOCK_MENUS.find((item) => item.username === userinfo.username)?.menus ?? [];
  return c.json(useResponseSuccess(menus));
});

export { auth };
