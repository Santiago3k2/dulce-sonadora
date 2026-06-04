import { createClient } from '@supabase/supabase-js';

/**
 * Cliente público de solo lectura para la TIENDA (Server Components).
 * Usa la clave publishable/anon: RLS solo deja ver filas activas.
 */
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
