import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


export async function proxy(request: NextRequest) {

  const token = await getToken({req: request});
  const url = request.nextUrl;

  // Protect logged-in users from seeing auth pages
  if (token && 
    (
      url.pathname.startsWith('/sign-in') || 
      url.pathname.startsWith('/sign-up') || 
      url.pathname.startsWith('/verify') || 
      url.pathname === '/'
    )
  ) {
      return NextResponse.redirect(new URL('/dashboard' , request.url));
  }

  // NOTE: next-auth/middleware might also run before this due to how next.js resolves the default export.
  // Actually, wait, if we export `{ default } from "next-auth/middleware"`, this `middleware` function won't be called directly by next unless we do:
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in' , request.url));
  }

  return NextResponse.next();
}
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}