'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Loader2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatCOP, buildWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils/format';
import { createOrder } from '@/app/checkout/actions';
import {
  PAYMENT_METHODS,
  priceForMethod,
  isOnline,
  type PaymentMethod,
} from '@/lib/utils/pricing';

export default function CheckoutContent() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const isWholesaleActive = useCartStore((s) => s.isWholesaleActive);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('whatsapp');
  const [error, setError] = useState('');
  const [saving, start] = useTransition();
  const [done, setDone] = useState<{ orderNumber: number; message: string } | null>(null);

  const inputCls =
    'w-full rounded-lg border border-gray-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const labelCls = 'block text-xs font-medium text-text-muted mb-1.5';

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-text-muted">Cargando…</div>
    );
  }

  if (done) {
    const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, done.message);
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <CheckCircle2 size={64} className="mx-auto text-emerald-500 mb-4" strokeWidth={1.5} />
        <h1 className="font-serif text-3xl mb-2">¡Pedido recibido! 🌸</h1>
        <p className="text-text-muted mb-1">Tu número de pedido es</p>
        <p className="text-2xl font-bold text-pink-deeper mb-6">#{done.orderNumber}</p>
        <p className="text-sm text-text-muted mb-6">
          Ya quedó registrado. Para confirmarlo más rápido y coordinar el envío contra entrega,
          escríbenos por WhatsApp:
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 px-6 rounded-full font-medium transition"
        >
          <MessageCircle size={18} /> Confirmar por WhatsApp
        </a>
        <div className="mt-6">
          <Link href="/tienda" className="text-pink-deeper hover:underline text-sm">
            ← Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-pink-soft mb-4" strokeWidth={1.2} />
        <p className="font-serif text-xl mb-2">Tu carrito está vacío</p>
        <Link href="/tienda" className="btn-primary mt-4 inline-block">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const wholesale = isWholesaleActive();
  // Precio unitario según método de pago elegido (online lleva recargo de pasarela)
  const unitFor = (it: (typeof items)[number]) =>
    priceForMethod(wholesale ? it.priceWholesale : it.priceRetail, payMethod);
  const total = items.reduce((s, it) => s + unitFor(it) * it.quantity, 0);
  const baseTotal = totalPrice();
  const surcharge = total - baseTotal;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const orderItems = items.map((i) => ({
      productId: i.productId,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
    }));
    const snapshot = items.map((it) => ({ ...it }));
    const wasWholesale = wholesale;
    const wasMethod = payMethod;
    start(async () => {
      const res = await createOrder({
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        customer_city: city,
        notes,
        items: orderItems,
        payment_method: payMethod,
      });
      if (res?.error) {
        setError(res.error);
        return;
      }
      if (res.orderNumber == null || res.total == null) {
        setError('No se pudo crear el pedido. Intenta de nuevo.');
        return;
      }
      const methodLabel = PAYMENT_METHODS.find((m) => m.value === wasMethod)?.label ?? wasMethod;
      let msg = `¡Hola Dulce Soñadora! 🌸 Confirmo mi pedido #${res.orderNumber}:\n\n`;
      snapshot.forEach((it) => {
        const unit = priceForMethod(
          wasWholesale ? it.priceWholesale : it.priceRetail,
          wasMethod
        );
        msg += `• ${it.name} x${it.quantity} (Talla ${it.size}, ${it.color}) — ${formatCOP(unit * it.quantity)}\n`;
      });
      msg += `\nTotal: ${formatCOP(res.total)}\nMétodo de pago: ${methodLabel}\n\nNombre: ${name}\nTeléfono: ${phone}`;
      if (address) msg += `\nDirección: ${address}${city ? ', ' + city : ''}`;
      if (notes) msg += `\nNota: ${notes}`;
      setDone({ orderNumber: res.orderNumber, message: msg });
      clearCart();
    });
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-4xl">Finalizar pedido</h1>
        <div className="divider-gradient" />
      </header>

      <div className="grid lg:grid-cols-5 gap-8">
        <form onSubmit={submit} className="lg:col-span-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Teléfono / WhatsApp *</label>
              <input
                className={inputCls}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                inputMode="tel"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Dirección de entrega</label>
            <input className={inputCls} value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Ciudad</label>
            <input className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Nota (opcional)</label>
            <textarea
              className={inputCls}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. punto de referencia, color preferido…"
            />
          </div>

          <div>
            <label className={labelCls}>Método de pago *</label>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition ${
                    payMethod === m.value
                      ? 'border-pink-deeper bg-pink-deeper/5 ring-1 ring-pink-deeper/30'
                      : 'border-gray-line hover:border-pink-deeper/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payMethod"
                    value={m.value}
                    checked={payMethod === m.value}
                    onChange={() => setPayMethod(m.value)}
                    className="mt-0.5 accent-pink-deeper"
                  />
                  <span className="text-sm">
                    <span className="font-medium block">{m.label}</span>
                    <span className="text-xs text-text-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {isOnline(payMethod) && surcharge > 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">
                El pago en línea incluye el costo de la pasarela de pago
                (+{formatCOP(surcharge)}). Pagando por WhatsApp o transferencia ahorras ese
                recargo.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pink-deeper hover:bg-pink-dark text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {saving && <Loader2 size={18} className="animate-spin" />}
            Confirmar pedido · {formatCOP(total)}
          </button>
          <p className="text-xs text-text-muted text-center">
            {isOnline(payMethod)
              ? 'Te enviaremos el enlace de pago seguro al confirmar tu pedido.'
              : 'Pago contra entrega. Te contactamos para coordinar el envío.'}
          </p>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-gray-soft rounded-lg p-5">
            <h2 className="font-serif text-lg mb-4">Tu pedido</h2>
            <ul className="space-y-3 mb-4">
              {items.map((it) => {
                const unit = unitFor(it);
                return (
                  <li key={it.id} className="flex gap-3">
                    <div className="relative w-12 h-16 bg-white rounded overflow-hidden shrink-0">
                      <Image src={it.image} alt="" fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0 text-sm">
                      <p className="font-medium line-clamp-1">{it.name}</p>
                      <p className="text-xs text-text-muted">
                        Talla {it.size} · {it.color} · x{it.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-pink-deeper whitespace-nowrap">
                      {formatCOP(unit * it.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            {wholesale && (
              <p className="text-xs text-emerald-600 mb-2 text-center">
                ¡Precio mayorista aplicado! 🎉
              </p>
            )}
            {isOnline(payMethod) && surcharge > 0 && (
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>Incluye costo pasarela de pago</span>
                <span>+{formatCOP(surcharge)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline border-t border-gray-line pt-3">
              <span className="text-sm text-text-muted">Total</span>
              <span className="font-serif text-2xl text-pink-deeper font-semibold">
                {formatCOP(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
