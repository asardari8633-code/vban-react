import type { Context } from 'hono';

import type { UserInfo } from './mock-data';

import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { sign, verify } from 'hono/jwt';

import { MOCK_USERS } from './mock-data';

const ACCESS_TOKEN_SECRET = 'access_token_secret';
const REFRESH_TOKEN_SECRET = 'refresh_token_secret';
const REFRESH_COOKIE = 'jwt';

type SafeUser = Omit<UserInfo, 'password'>;

function strip(user: UserInfo): SafeUser {
  const { password: _pwd, ...rest } = user;
  return rest;
}

export async function generateAccessToken(user: UserInfo) {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  return sign({ ...strip(user), exp }, ACCESS_TOKEN_SECRET, 'HS256');
}

export async function generateRefreshToken(user: UserInfo) {
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
  return sign({ ...strip(user), exp }, REFRESH_TOKEN_SECRET, 'HS256');
}

/**
 * بررسی توکن دسترسی از هدر Authorization
 */
export async function verifyAccessToken(c: Context): Promise<null | SafeUser> {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer')) return null;
  const [, token] = authHeader.split(' ');
  if (!token) return null;
  try {
    const decoded = (await verify(token, ACCESS_TOKEN_SECRET, 'HS256')) as { username: string };
    const user = MOCK_USERS.find((item) => item.username === decoded.username);
    return user ? strip(user) : null;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<null | SafeUser> {
  try {
    const decoded = (await verify(token, REFRESH_TOKEN_SECRET, 'HS256')) as { username: string };
    const user = MOCK_USERS.find((item) => item.username === decoded.username);
    return user ? strip(user) : null;
  } catch {
    return null;
  }
}

export function setRefreshTokenCookie(c: Context, token: string) {
  setCookie(c, REFRESH_COOKIE, token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60,
    path: '/',
    sameSite: 'Lax',
  });
}

export function getRefreshTokenFromCookie(c: Context) {
  return getCookie(c, REFRESH_COOKIE);
}

export function clearRefreshTokenCookie(c: Context) {
  deleteCookie(c, REFRESH_COOKIE, { path: '/' });
}
