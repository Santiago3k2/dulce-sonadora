import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Página 404 que se muestra mientras el sitio está suspendido.
 * Neutral a propósito: el motivo (pago pendiente) se comunica en privado
 * al administrador, no se expone a los clientes finales.
 */
const SUSPENDED_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Sitio no disponible</title>
<style>
  :root { color-scheme: light dark; }
  html,body { height:100%; margin:0; }
  body {
    display:flex; align-items:center; justify-content:center;
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background:#faf7f5; color:#3a2f2a; padding:24px;
  }
  @media (prefers-color-scheme: dark) {
    body { background:#1a1614; color:#e8e1dc; }
  }
  .card { max-width:420px; text-align:center; }
  .code { font-size:64px; font-weight:700; letter-spacing:-2px; margin:0; opacity:.9; }
  h1 { font-size:18px; font-weight:600; margin:8px 0 4px; }
  p { font-size:14px; line-height:1.5; opacity:.7; margin:0; }
</style>
</head>
<body>
  <div class="card">
    <p class="code">404</p>
    <h1>Sitio temporalmente no disponible</h1>
    <p>Esta tienda no está disponible en este momento. Por favor contacta al administrador.</p>
  </div>
</body>
</html>`;

/**
 * Refresca la sesión de Supabase y protege /admin y /cuenta.
 * Solo comprueba que haya sesión (autenticación). En /admin, la autorización
 * (que el usuario sea admin) se verifica en el layout del panel; en /cuenta
 * cualquier usuario autenticado es un cliente válido.
 *
 * Interruptor de suspensión: con SITE_SUSPENDED = true, todas las rutas
 * públicas devuelven un 404. Es reversible: ponlo en false y haz push, y el
 * sitio vuelve a funcionar igual que antes. Se deja pasar /admin para que el
 * administrador conserve el control del panel.
 */

// ⬇⬇⬇  PARA REACTIVAR LA TIENDA: pon esto en false y haz git push  ⬇⬇⬇
const SITE_SUSPENDED = true;
// ⬆⬆⬆ ---------------------------------------------------------------- ⬆⬆⬆

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Interruptor: tienda suspendida ──────────────────────────────
  if (SITE_SUSPENDED && !pathname.startsWith('/admin')) {
    return new NextResponse(SUSPENDED_HTML, {
      status: 404,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  // Fuera de /admin y /cuenta no hace falta tocar la sesión.
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/cuenta')) {
    return NextResponse.next({ request });
  }

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
