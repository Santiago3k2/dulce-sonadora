import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Devuelve el usuario si hay sesión Y está en la tabla `admins`. Si no, null.
 * Úsalo en Server Components / Server Actions del panel para autorizar.
 */
export async function getAdminUser() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // La tabla admins está bloqueada por RLS → se consulta con service_role.
  const admin = createAdminClient();
  const { data } = await admin
    .from('admins')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  return data ? user : null;
}
