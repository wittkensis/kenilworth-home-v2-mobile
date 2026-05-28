import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth'];

// /api/focus is called by the Focus app — must remain unauthenticated
const ALWAYS_PUBLIC = ['/api/focus'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ALWAYS_PUBLIC.some((p) => pathname.startsWith(p))) return NextResponse.next();
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = request.cookies.get('kw_auth')?.value;
  const expected = process.env.APP_PASSWORD;

  if (!token || !expected || token !== expected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
