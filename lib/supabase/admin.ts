import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente con service_role para operaciones del ADMIN y creación de pedidos.
 * ⚠️ SOLO servidor — omite RLS. Nunca importar desde componentes de cliente.
 * El acceso del admin se protege con la sesión (ver middleware / lib/auth).
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY. Pégala en .env.local (y en Vercel) desde Supabase → Settings → API.'
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
