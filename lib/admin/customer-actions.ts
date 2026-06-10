'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

const TIERS = ['detal', 'mayorista', 'vip'] as const;

/**
 * Asigna tier (detal/mayorista/vip), % de descuento extra y notas internas a
 * un cliente. Solo el admin; corre con service_role, que es el único al que el
 * trigger de la BD le permite tocar estos campos.
 */
export async function setCustomerTier(
  id: string,
  input: { tier: string; discount_pct: number; notes: string }
) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };

  if (!(TIERS as readonly string[]).includes(input.tier)) {
    return { error: 'Tier inválido' };
  }
  const discount = Number(input.discount_pct);
  if (!Number.isFinite(discount) || discount < 0 || discount > 90) {
    return { error: 'El descuento debe estar entre 0 y 90%.' };
  }

  const sb = createAdminClient();
  const { error } = await sb
    .from('profiles')
    .update({
      tier: input.tier,
      discount_pct: discount,
      notes: input.notes.trim() || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/clientes');
  return { ok: true };
}
