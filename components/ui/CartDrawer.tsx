'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatCOP, buildWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/utils/format';
import { logWhatsAppOrder } from '@/app/checkout/actions';

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalQuantity = useCartStore((s) => s.totalQuantity);
  const isWholesaleActive = useCartStore((s) => s.isWholesaleActive);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

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
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-line">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-pink-deeper" />
            <h2 className="font-serif text-lg">Tu carrito</h2>
            <span className="text-xs text-text-muted">({totalQty})</span>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="p-2 -m-2 hover:text-pink-deeper transition"
          >
            <X size={22} />
          </button>
        </header>

        {/* Wholesale banner */}
        {wholesale ? (
          <div className="bg-gradient-warm text-white px-5 py-3 text-center text-sm font-semibold shadow-pink-soft">
            ¡Precio mayorista activado! 🎉
          </div>
        ) : items.length > 0 ? (
          <div className="bg-gradient-pink-soft px-5 py-3 text-center text-xs text-pink-deeper font-medium">
            Añade <strong>{remaining}</strong> más para precio mayorista
          </div>
        ) : null}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-muted">
              <ShoppingBag size={48} className="mb-3 text-pink-soft" />
              <p className="font-serif text-lg mb-1">Tu carrito está vacío</p>
              <p className="text-sm">Descubre nuestras pijamas</p>
              <Link
                href="/tienda"
                onClick={closeCart}
                className="mt-5 btn-primary"
              >
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const unit = wholesale ? item.priceWholesale : item.priceRetail;
                return (
                  <li key={item.id} className="flex gap-3 border-b border-gray-line pb-4">
                    <div className="relative w-20 h-24 flex-shrink-0 bg-gray-soft overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/producto/${item.slug}`}
                          onClick={closeCart}
                          className="font-medium text-sm hover:text-pink-deeper truncate"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Eliminar"
                          className="text-text-muted hover:text-pink-deeper"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Talla {item.size} · {item.color}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-gray-line rounded-full">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            aria-label="Restar"
                            className="px-2 py-1 hover:text-pink-deeper"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 text-sm w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            aria-label="Sumar"
                            className="px-2 py-1 hover:text-pink-deeper"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-semibold text-pink-deeper text-sm">
                          {formatCOP(unit * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <footer className="border-t border-gray-line px-5 py-4 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-text-muted">Total</span>
              <span className="font-serif text-2xl text-pink-deeper font-semibold">
                {formatCOP(total)}
              </span>
            </div>
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
                  'carrito (drawer)'
                );
              }}
              className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition"
            >
              <MessageCircle size={18} />
              Hacer pedido por WhatsApp
            </a>
            <Link
              href="/carrito"
              onClick={closeCart}
              className="block w-full text-center text-pink-deeper hover:underline text-sm"
            >
              Ver carrito completo
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
