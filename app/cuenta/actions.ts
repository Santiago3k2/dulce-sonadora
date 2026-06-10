'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

interface ProfileInput {
  full_name: string;
  phone: string;
  address?: string;
  city?: string;
}

/**
 * Actualiza el perfil del cliente logueado. La RLS solo deja editar el propio
 * perfil y el trigger de la BD conserva tier/discount_pct/notes (eso lo maneja
 * el admin), así que aunque lleguen no se aplican.
 */
export async function updateProfile(input: ProfileInput) {
  const sb = createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: 'No has iniciado sesión.' };

  const full_name = input.full_name?.trim();
  const phone = input.phone?.trim();
  if (!full_name || !phone) return { error: 'Tu nombre y teléfono son obligatorios.' };

  const { error } = await sb
    .from('profiles')
    .update({
      full_name,
      phone,
      address: input.address?.trim() || null,
      city: input.city?.trim() || null,
    })
    .eq('id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/cuenta');
  return { ok: true };
}

export async function signOutCustomer() {
  const sb = createServerSupabase();
  await sb.auth.signOut();
  redirect('/cuenta/login');
}
