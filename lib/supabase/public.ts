import { createClient } from '@supabase/supabase-js';

/**
 * Cliente público de solo lectura para la TIENDA (Server Components).
 * Usa la clave publishable/anon: RLS solo deja ver filas activas.
 *
 * IMPORTANTE — `cache: 'no-store'` en cada lectura:
 * Next.js 14 cachea los `fetch` por defecto, y ese Data Cache SOBREVIVE a los
 * redeploys. Eso hacía que los cambios de catálogo aplicados fuera del panel
 * admin (el script scripts/sync-supabase.ts o ediciones directas en Supabase)
 * NO se reflejaran en la tienda aunque se hiciera push. Con no-store la tienda
 * siempre muestra el estado real de Supabase. (El panel admin además revalida
 * con revalidatePath, así que sus ediciones ya se veían al instante.)
 */
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: 'no-store' });

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: noStoreFetch },
  }
);
