import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresca la sesión de Supabase y protege /admin y /cuenta.
 * Solo comprueba que haya sesión (autenticación). En /admin, la autorización
 * (que el usuario sea admin) se verifica en el layout del panel; en /cuenta
 * cualquier usuario autenticado es un cliente válido.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
  };

  // Panel admin
  if (pathname.startsWith('/admin')) {
    const isLogin = pathname === '/admin/login';
    if (!user && !isLogin) return redirectTo('/admin/login');
    if (user && isLogin) return redirectTo('/admin');
  }

  // Cuenta del cliente
  if (pathname.startsWith('/cuenta')) {
    const isPublic = pathname === '/cuenta/login' || pathname === '/cuenta/registro';
    if (!user && !isPublic) return redirectTo('/cuenta/login');
    if (user && isPublic) return redirectTo('/cuenta');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/cuenta/:path*'],
};
