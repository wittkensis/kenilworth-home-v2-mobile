'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyLogin(password: string): Promise<boolean> {
  return password === process.env.APP_PASSWORD;
}

export async function setAuthCookie() {
  const token = process.env.AUTH_TOKEN;
  if (!token) throw new Error('AUTH_TOKEN not set');
  const jar = await cookies();
  jar.set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.delete('auth');
  redirect('/login');
}
