import { createServerSupabase } from '@/lib/supabase/server';

export type CustomerTier = 'detal' | 'mayorista' | 'vip';

export interface CustomerProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  tier: CustomerTier | string;
  discount_pct: number;
  notes: string | null;
}

/** ¿El tier da precio mayorista sin importar la cantidad? */
export function tierIsWholesale(tier: string | null | undefined): boolean {
  return tier === 'mayorista' || tier === 'vip';
}

/**
 * Devuelve el cliente logueado (sesión Supabase) junto con su perfil.
 * `null` si no hay sesión. Úsalo en Server Components / Server Actions del cliente.
 */
export async function getCustomer() {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;

  const { data: profile } = await sb
    .from('profiles')
    .select('id, full_name, phone, address, city, tier, discount_pct, notes')
    .eq('id', user.id)
    .maybeSingle();

  return { user, profile: (profile ?? null) as CustomerProfile | null };
}
