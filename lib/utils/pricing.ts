/**
 * Precios según método de pago.
 *
 * Pago en línea (ePayco / tarjeta / PSE) lleva recargo de pasarela:
 *   recargo = (precio × 2.68% + $900) × 1.19  (IVA 19% sobre la comisión)
 * WhatsApp / transferencia / acuerdo directo: precio normal sin recargo.
 *
 * Misma fórmula de las tablas Excel "PAGO_ONLINE" (precios exactos al peso).
 */

export type PaymentMethod = 'whatsapp' | 'transferencia' | 'online';

export const ONLINE_FEE_RATE = 0.0268; // 2.68% del valor del producto
export const ONLINE_FEE_FIXED = 900; // $900 COP fijos
export const ONLINE_FEE_IVA = 0.19; // IVA sobre la comisión

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp / contra entrega', hint: 'Coordinamos el pago al confirmar' },
  { value: 'transferencia', label: 'Transferencia bancaria', hint: 'Nequi, Daviplata o cuenta bancaria' },
  { value: 'online', label: 'Pago en línea', hint: 'Tarjeta débito/crédito · incluye costo de pasarela' },
];

export function isOnline(method: PaymentMethod): boolean {
  return method === 'online';
}

/** Precio con recargo de pasarela, redondeado al peso (igual que el Excel). */
export function onlinePrice(base: number): number {
  const fee = (base * ONLINE_FEE_RATE + ONLINE_FEE_FIXED) * (1 + ONLINE_FEE_IVA);
  return Math.round(base + fee);
}

/** Precio unitario según el método de pago elegido. */
export function priceForMethod(base: number, method: PaymentMethod): number {
  return isOnline(method) ? onlinePrice(base) : base;
}

export function isPaymentMethod(v: unknown): v is PaymentMethod {
  return v === 'whatsapp' || v === 'transferencia' || v === 'online';
}
