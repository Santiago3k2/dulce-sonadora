'use server';

import { revalidatePath } from 'next/cache';
import { getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { ORDER_STATUSES } from '@/lib/admin/types';

export async function setOrderStatus(id: string, status: string) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return { error: 'Estado inválido' };
  }
  const sb = createAdminClient();
  const { error } = await sb.from('orders').update({ status }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteOrder(id: string) {
  const user = await getAdminUser();
  if (!user) return { error: 'No autorizado' };
  const sb = createAdminClient();
  const { error } = await sb.from('orders').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { ok: true };
}
