'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { createServerSupabase } from '@/lib/supabase/server';
import { tierIsWholesale } from '@/lib/customer';
import { isPaymentMethod, priceForMethod, type PaymentMethod } from '@/lib/utils/pricing';
import { notifyNewOrder } from '@/lib/notifications/email';
import { CAMPAIGN_OFFERS } from '@/lib/data/campaignOffers';

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
  payment_method?: PaymentMethod;
  /** Clave de campaña /oferta: aplica su precio fijo (CAMPAIGN_OFFERS) al producto. */
  campaign?: string;
}

const WHOLESALE_MIN_QTY = 6;

const METHOD_LABEL: Record<PaymentMethod, string> = {
  whatsapp: 'WhatsApp / contra entrega',
  transferencia: 'Transferencia bancaria',
  online: 'Pago en línea (con recargo de pasarela)',
};

/** Inserta el pedido tolerando columnas que aún no existan en la BD
 *  (payment_method, customer_id): si la migración no se ha corrido, reintenta
 *  sin esa columna — payment_method se preserva dentro de las notas. */
async function insertOrder(
  sb: ReturnType<typeof createAdminClient>,
  row: Record<string, unknown>,
  method: PaymentMethod
) {
  let payload: Record<string, unknown> = { ...row, payment_method: method };

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await sb.from('orders').insert(payload).select('order_number').single();
    if (!res.error) return res;
    const msg = res.error.message;

    if (/payment_method/i.test(msg) && 'payment_method' in payload) {
      const { payment_method: _pm, ...rest } = payload;
      const notes = [`[Pago: ${METHOD_LABEL[method]}]`, row.notes].filter(Boolean).join(' ');
      payload = { ...rest, notes };
      continue;
    }
    if (/customer_id/i.test(msg) && 'customer_id' in payload) {
      const { customer_id: _cid, ...rest } = payload;
      payload = rest;
      continue;
    }
    return res;
  }

  return sb.from('orders').insert(payload).select('order_number').single();
}

/**
 * Crea un pedido. Funciona como invitado o con cliente logueado; corre en el
 * servidor y RECALCULA los precios desde la BD para que no se puedan manipular.
 * Si hay sesión, asocia el pedido al cliente y aplica su tier/descuento.
 * Si el método de pago es online, aplica el recargo de pasarela por unidad
 * (misma fórmula de la tabla de precios PAGO_ONLINE).
 */
export async function createOrder(input: CreateOrderInput) {
  const name = input.customer_name?.trim();
  const phone = input.customer_phone?.trim();
  if (!name || !phone) return { error: 'Tu nombre y teléfono son obligatorios.' };

  const items = (input.items || []).filter((i) => i.productId && i.quantity > 0);
  if (!items.length) return { error: 'El carrito está vacío.' };

  const method: PaymentMethod = isPaymentMethod(input.payment_method)
    ? input.payment_method
    : 'whatsapp';

  const sb = createAdminClient();
  const ids = [...new Set(items.map((i) => i.productId))];
  const { data: products, error: pe } = await sb
    .from('products')
    .select('id,name,ref,slug,price_retail,price_wholesale,size_prices,images,is_active')
    .in('id', ids);
  if (pe) return { error: pe.message };

  const byId = new Map((products ?? []).map((p) => [p.id, p]));
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  // Cliente logueado: aplica su tier (mayorista/vip) y descuento especial.
  // La sesión se lee server-side, así que no se puede falsear desde el navegador.
  let customerId: string | null = null;
  let tierWholesale = false;
  let discountPct = 0;
  const {
    data: { user },
  } = await createServerSupabase().auth.getUser();
  if (user) {
    customerId = user.id;
    const { data: prof } = await sb
      .from('profiles')
      .select('tier, discount_pct')
      .eq('id', user.id)
      .maybeSingle();
    if (prof) {
      tierWholesale = tierIsWholesale(prof.tier);
      discountPct = Number(prof.discount_pct) || 0;
    }
  }

  // Mayorista por cantidad (≥6) O por tier del cliente.
  const isWholesale = totalQty >= WHOLESALE_MIN_QTY || tierWholesale;

  // Precio fijo de campaña (/oferta): solo aplica al producto de esa campaña.
  const offer = input.campaign ? CAMPAIGN_OFFERS[input.campaign] : undefined;

  const lineItems = [];
  let total = 0;
  for (const it of items) {
    const p = byId.get(it.productId);
    if (!p || !p.is_active) continue;
    // Precio de la talla pedida (si la prenda varía por talla); si no, el base.
    // Si la campaña tiene precio fijo para ESTE producto, manda sobre el catálogo.
    const useOffer = offer && p.slug === offer.productSlug;
    const sp = (p.size_prices as Record<string, { retail: number; wholesale: number }> | null)?.[it.size];
    const raw = useOffer
      ? isWholesale
        ? offer!.wholesale
        : offer!.retail
      : isWholesale
        ? sp?.wholesale ?? p.price_wholesale
        : sp?.retail ?? p.price_retail;
    const base = discountPct > 0 ? Math.round(raw * (1 - discountPct / 100)) : raw;
    const unit = priceForMethod(base, method);
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
      basePrice: base,
    });
  }
  if (!lineItems.length) return { error: 'No se pudieron procesar los productos del carrito.' };

  const { data, error } = await insertOrder(
    sb,
    {
      customer_id: customerId,
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
    },
    method
  );
  if (error) return { error: error.message };

  await notifyNewOrder({
    orderNumber: data.order_number as number,
    customerName: name,
    customerPhone: phone,
    customerCity: input.customer_city?.trim() || null,
    total,
    paymentLabel: METHOD_LABEL[method],
    items: lineItems.map((li) => ({
      name: li.name,
      quantity: li.quantity,
      size: li.size,
      color: li.color,
      unitPrice: li.unitPrice,
    })),
  });

  revalidatePath('/admin/pedidos');
  revalidatePath('/admin');
  return { ok: true, orderNumber: data.order_number as number, total };
}

/**
 * Registra en la BD un pedido iniciado por el botón de WhatsApp (carrito,
 * drawer o página de producto) ANTES de abrir el chat, para que el panel
 * admin lo vea y se pueda hacer seguimiento comercial aunque el cliente
 * no termine escribiendo. No bloquea la navegación: se llama fire-and-forget.
 */
export async function logWhatsAppOrder(items: CartLine[], source: string) {
  try {
    const valid = (items || []).filter((i) => i.productId && i.quantity > 0);
    if (!valid.length) return { ok: false };

    const sb = createAdminClient();
    const ids = [...new Set(valid.map((i) => i.productId))];
    const { data: products } = await sb
      .from('products')
      .select('id,name,ref,slug,price_retail,price_wholesale,size_prices,images,is_active')
      .in('id', ids);

    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    const totalQty = valid.reduce((s, i) => s + i.quantity, 0);
    const isWholesale = totalQty >= WHOLESALE_MIN_QTY;

    const lineItems = [];
    let total = 0;
    for (const it of valid) {
      const p = byId.get(it.productId);
      if (!p || !p.is_active) continue;
      const sp = (p.size_prices as Record<string, { retail: number; wholesale: number }> | null)?.[it.size];
      const unit = isWholesale
        ? sp?.wholesale ?? p.price_wholesale
        : sp?.retail ?? p.price_retail;
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
    if (!lineItems.length) return { ok: false };

    const { data } = await insertOrder(
      sb,
      {
        customer_name: 'Cliente WhatsApp (por confirmar)',
        customer_phone: '(en el chat)',
        notes: `Pedido iniciado con el botón de WhatsApp (${source}). El cliente abre el chat para confirmar — hacerle seguimiento si no escribe.`,
        items: lineItems,
        subtotal: total,
        total,
        is_wholesale: isWholesale,
        status: 'pendiente',
      },
      'whatsapp'
    );

    if (data?.order_number != null) {
      await notifyNewOrder({
        orderNumber: data.order_number as number,
        customerName: 'Cliente WhatsApp (por confirmar)',
        customerPhone: 'en el chat de WhatsApp',
        total,
        paymentLabel: 'WhatsApp / contra entrega',
        isWhatsAppLead: true,
        items: lineItems.map((li) => ({
          name: li.name,
          quantity: li.quantity,
          size: li.size,
          color: li.color,
          unitPrice: li.unitPrice,
        })),
      });
    }

    revalidatePath('/admin/pedidos');
    revalidatePath('/admin');
    return { ok: true };
  } catch {
    // Nunca interrumpir la apertura de WhatsApp por un fallo de registro.
    return { ok: false };
  }
}
