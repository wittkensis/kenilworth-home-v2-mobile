'use server';

import { redirect } from 'next/navigation';
import { verifyLogin, setAuthCookie, clearAuthCookie } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string;
  const valid = await verifyLogin(password);
  if (!valid) {
    redirect('/login?error=1');
  }
  await setAuthCookie();
  redirect('/maintenance');
}

export { clearAuthCookie as logoutAction };
