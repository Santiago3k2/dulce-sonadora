import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Intercambia el código del enlace de confirmación de correo por una sesión.
 * Lo usa el registro de cliente cuando Supabase tiene activada la confirmación
 * por email (el enlace del correo apunta aquí con ?code=...).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/cuenta';

  if (code) {
    const sb = createServerSupabase();
    await sb.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
