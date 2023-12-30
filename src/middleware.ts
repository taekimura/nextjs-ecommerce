import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let isPublicRoute = false;
  if (
    request.nextUrl.pathname === '/login' ||
    request.nextUrl.pathname === '/register'
  ) {
    isPublicRoute = true;
  }

  // if the token is not valid and the route is not public, redirect to login
  const token = request.cookies.get('token')?.value || '';
  if (!token && !isPublicRoute && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // if the token is valid and the route is public, redirect to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/']
};
