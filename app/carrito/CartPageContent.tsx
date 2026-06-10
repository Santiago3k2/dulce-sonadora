'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatCOP, buildWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils/format';
import { logWhatsAppOrder } from '@/app/checkout/actions';

export default function CartPageContent() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const isWholesaleActive = useCartStore((s) => s.isWholesaleActive);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-text-muted">
        Cargando carrito…
      </div>
    );
  }

  const totalQty = totalQuantity();
  const total = totalPrice();
  const wholesale = isWholesaleActive();
  const remaining = Math.max(0, 6 - totalQty);

  const whatsappMessage = (() => {
    if (items.length === 0) return '';
    let msg = '¡Hola Dulce Soñadora! 🌸 Quiero hacer el siguiente pedido:\n\n';
    items.forEach((it) => {
      const unit = wholesale ? it.priceWholesale : it.priceRetail;
      msg += `• ${it.name} x${it.quantity} — Talla ${it.size}, Color ${it.color} — ${formatCOP(unit * it.quantity)}\n`;
    });
    msg += `\nTotal: ${formatCOP(total)}`;
    if (wholesale) msg += `\n(¡Precio mayorista aplicado!)`;
    msg += `\n\n¡Gracias!`;
    return msg;
  })();

  const whatsappLink = buildWhatsAppLink(WHATSAPP_NUMBER, whatsappMessage);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-5xl">Tu Carrito</h1>
        <div className="divider-gradient" />
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag
            size={64}
            className="mx-auto text-pink-soft mb-4"
            strokeWidth={1.2}
          />
          <p className="font-serif text-xl mb-2">Tu carrito está vacío</p>
          <p className="text-text-muted mb-6">¡Descubre nuestras pijamas y lencería!</p>
          <Link href="/tienda" className="btn-primary">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2">
            {wholesale ? (
              <div className="bg-gradient-warm text-white px-5 py-4 rounded-lg text-center font-semibold mb-6 shadow-pink">
                ¡Precio mayorista activado! 🎉
              </div>
            ) : (
              <div className="bg-gradient-pink-soft px-5 py-4 rounded-lg text-center text-pink-deeper text-sm mb-6 border border-pink-soft">
                Añade <strong>{remaining}</strong> unidad{remaining > 1 ? 'es' : ''} más para activar el <strong>precio mayorista</strong>.
              </div>
            )}

            <ul className="space-y-4">
              {items.map((item) => {
                const unit = wholesale ? item.priceWholesale : item.priceRetail;
                return (
                  <li
                    key={item.id}
                    className="flex gap-4 border border-gray-line rounded-lg p-4"
                  >
                    <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-gray-soft overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/producto/${item.slug}`}
                          className="font-medium hover:text-pink-deeper"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Eliminar"
                          className="text-text-muted hover:text-pink-deeper"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-text-muted mt-1">
                        Talla {item.size} · {item.color}
                      </p>
                      <div className="mt-2 text-sm">
                        <span className="line-through text-text-muted text-xs mr-2">
                          {formatCOP(item.priceRetail)}
                        </span>
                        <span className="text-pink-deeper font-medium">
                          {formatCOP(unit)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-gray-line rounded-full">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            aria-label="Restar"
                            className="px-3 py-1.5 hover:text-pink-deeper"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            aria-label="Sumar"
                            className="px-3 py-1.5 hover:text-pink-deeper"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-semibold text-pink-deeper">
                          {formatCOP(unit * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex justify-between items-center text-sm">
              <button
                onClick={() => {
                  if (confirm('¿Vaciar el carrito?')) clearCart();
                }}
                className="text-text-muted hover:text-pink-deeper"
              >
                Vaciar carrito
              </button>
              <Link href="/tienda" className="text-pink-deeper hover:underline">
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-soft p-6 rounded-lg sticky top-28">
              <h2 className="font-serif text-xl mb-4">Resumen</h2>
              <div className="space-y-2 text-sm border-b border-gray-line pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-text-muted">Cantidad de prendas</span>
                  <span className="font-medium">{totalQty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Precio aplicado</span>
                  <span className="font-medium text-pink-deeper">
                    {wholesale ? 'Mayorista' : 'Unidad'}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm text-text-muted">Total</span>
                <span className="font-serif text-3xl text-pink-deeper font-semibold">
                  {formatCOP(total)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-pink-deeper hover:bg-pink-dark text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition mb-3"
              >
                <ShoppingBag size={18} />
                Finalizar pedido
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // Registra el pedido en el panel admin sin bloquear la apertura del chat
                  void logWhatsAppOrder(
                    items.map((i) => ({
                      productId: i.productId,
                      color: i.color,
                      size: i.size,
                      quantity: i.quantity,
                    })),
                    'página del carrito'
                  );
                }}
                className="w-full bg-white border border-[#25D366] text-[#1ebe5d] hover:bg-[#25D366]/5 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 transition text-sm"
              >
                <MessageCircle size={18} />
                O pedir por WhatsApp
              </a>
              <p className="mt-3 text-xs text-text-muted text-center">
                Pago contra entrega. Te confirmamos el pedido y coordinamos el envío.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
