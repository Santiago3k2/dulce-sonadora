'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/data/products';
import { colorSwatch, imageForColor } from '@/lib/data/colors';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useCartStore } from '@/lib/store/cartStore';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.images[0]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      priceRetail: product.priceRetail,
      priceWholesale: product.priceWholesale,
      quantity,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/95 rounded-full flex items-center justify-center shadow hover:bg-pink-dark hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* grid-cols-1 + min-w-0: evita que la tira de miniaturas desborde el ancho en móvil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="bg-cream min-w-0">
            <div className="relative aspect-[2/3]">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar min-w-0 max-w-full">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`relative w-16 h-20 flex-shrink-0 ${
                      mainImage === img ? 'ring-2 ring-pink-dark' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Vista ${i + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col min-w-0">
            <h2 className="font-serif text-2xl md:text-3xl text-text-dark">
              {product.name}
            </h2>

            <div className="mt-4">
              <PriceDisplay
                priceRetail={product.priceRetail}
                priceWholesale={product.priceWholesale}
                size="xl"
                showLabels
              />
            </div>

            <p className="mt-4 text-sm text-text-muted leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Color */}
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Color: <span className="text-text-dark font-medium">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      const img = imageForColor(product, color);
                      if (img) setMainImage(img);
                    }}
                    aria-label={color}
                    title={color}
                    className={`w-9 h-9 rounded-full border-2 transition ${
                      selectedColor === color
                        ? 'border-pink-deeper scale-110'
                        : 'border-gray-line'
                    }`}
                    style={{ background: colorSwatch(color) }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Talla: <span className="text-text-dark font-medium">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 text-sm border rounded-full transition ${
                      selectedSize === size
                        ? 'bg-pink-deeper text-white border-pink-deeper'
                        : 'border-gray-line text-text-dark hover:border-pink-deeper'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                Cantidad
              </h3>
              <div className="inline-flex items-center border border-gray-line rounded-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 hover:text-pink-deeper"
                  aria-label="Restar"
                >
                  −
                </button>
                <span className="px-4 text-base w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 hover:text-pink-deeper"
                  aria-label="Sumar"
                >
                  +
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-text-muted italic">
              Precio mayorista aplica para pedidos mínimos de {product.wholesaleMinQty} unidades.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                {product.inStock ? 'Agregar al carrito' : 'Agotado'}
              </button>
              <Link
                href={`/producto/${product.slug}`}
                onClick={onClose}
                className="text-center text-sm text-pink-deeper hover:underline"
              >
                Ver detalles completos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
