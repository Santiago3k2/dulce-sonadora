'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { isPaymentMethod, priceForMethod, type PaymentMethod } from '@/lib/utils/pricing';
import { notifyNewOrder } from '@/lib/notifications/email';

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
}

const WHOLESALE_MIN_QTY = 6;

const METHOD_LABEL: Record<PaymentMethod, string> = {
  whatsapp: 'WhatsApp / contra entrega',
  transferencia: 'Transferencia bancaria',
  online: 'Pago en línea (con recargo de pasarela)',
};

/** Inserta el pedido; si la columna payment_method aún no existe en la BD,
 *  reintenta guardándolo dentro de las notas (compatibilidad hasta migrar). */
async function insertOrder(
  sb: ReturnType<typeof createAdminClient>,
  row: Record<string, unknown>,
  method: PaymentMethod
) {
  const first = await sb
    .from('orders')
    .insert({ ...row, payment_method: method })
    .select('order_number')
    .single();
  if (!first.error) return first;
  if (!/payment_method/i.test(first.error.message)) return first;
  const notes = [`[Pago: ${METHOD_LABEL[method]}]`, row.notes].filter(Boolean).join(' ');
  return sb
    .from('orders')
    .insert({ ...row, notes })
    .select('order_number')
    .single();
}

/**
 * Crea un pedido. Público (el cliente no inicia sesión), pero corre en el
 * servidor y RECALCULA los precios desde la BD para que no se puedan manipular.
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
    const base = isWholesale ? p.price_wholesale : p.price_retail;
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
      .select('id,name,ref,slug,price_retail,price_wholesale,images,is_active')
      .in('id', ids);

    const byId = new Map((products ?? []).map((p) => [p.id, p]));
    const totalQty = valid.reduce((s, i) => s + i.quantity, 0);
    const isWholesale = totalQty >= WHOLESALE_MIN_QTY;

    const lineItems = [];
    let total = 0;
    for (const it of valid) {
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
