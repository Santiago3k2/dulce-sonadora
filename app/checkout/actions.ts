'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

interface CartLine {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  customer_city?: string;
  notes?: string;
  items: CartLine[];
}

const WHOLESALE_MIN_QTY = 6;

/**
 * Crea un pedido. Público (el cliente no inicia sesión), pero corre en el
 * servidor y RECALCULA los precios desde la BD para que no se puedan manipular.
 */
export async function createOrder(input: CreateOrderInput) {
  const name = input.customer_name?.trim();
  const phone = input.customer_phone?.trim();
  if (!name || !phone) return { error: 'Tu nombre y teléfono son obligatorios.' };

  const items = (input.items || []).filter((i) => i.productId && i.quantity > 0);
  if (!items.length) return { error: 'El carrito está vacío.' };

  const sb = createAdminClient();
  const ids = [...new Set(items.map((i) => i.productId))];
  const { data: products, error: pe } = await sb
    .from('products')
    .select('id,name,ref,slug,price_retail,price_wholesale,images,is_active')
    .in('id', ids);
  if (pe) return { error: pe.message };

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const isWholesale = totalQty >= WHOLESALE_MIN_QTY;

  const lineItems = [];
  let total = 0;
  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p || !p.is_active) continue;
    const unit = isWholesale ? p.price_wholesale : p.price_retail;
    total += unit * it.quantity;
    lineItems.push({
      productId: p.id,
      ref: p.ref,
      slug: p.slug,
      name: p.name,
      image: (p.images as string[] | null)?.[0] ?? null,
      color: it.color,
      size: it.size,
      quantity: it.quantity,
      unitPrice: unit,
    });
  }
  if (!lineItems.length) return { error: 'No se pudieron procesar los productos del carrito.' };

  const { data, error } = await sb
    .from('orders')
    .insert({
      customer_name: name,
      customer_phone: phone,
      customer_address: input.customer_address?.trim() || null,
      customer_city: input.customer_city?.trim() || null,
      notes: input.notes?.trim() || null,
      items: lineItems,
      subtotal: total,
      total,
      is_wholesale: isWholesale,
      status: 'pendiente',
    })
    .select('order_number')
    .single();
  if (error) return { error: error.message };

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { ok: true, orderNumber: data.order_number as number, total };
}
