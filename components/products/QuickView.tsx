'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/data/products';
import PriceDisplay from '@/components/ui/PriceDisplay';
import { useCartStore } from '@/lib/store/cartStore';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

const COLOR_HEX_MAP: Record<string, string> = {
  rosa: '#F9C5D1',
  durazno: '#F4A9A0',
  rojo: '#D43F4F',
  blanco: '#FFFFFF',
  negro: '#111111',
  azul: '#2F4B8B',
  'azul acero': '#7E97AD',
  'azul marino': '#1B2C4E',
  verde: '#5BA86C',
  'verde menta': '#9FD8B5',
  menta: '#A8E0C4',
  amarillo: '#F6D858',
  morado: '#8E5BA8',
  lila: '#C9A8D8',
  crema: '#F1E4D0',
  cereza: '#B5253A',
  beige: '#D6BFA1',
  fucsia: '#D9388E',
  sage: '#B5C5A8',
  gris: '#9C9C9C',
  leopardo:
    'repeating-linear-gradient(45deg,#D9A86A 0 6px,#7A4E20 6px 8px,#D9A86A 8px 14px)',
  multicolor:
    'linear-gradient(90deg,#F9C5D1,#F6D858,#9FD8B5,#8E5BA8)',
  teal: '#3F8896',
  malva: '#C49BB7',
  donut: '#F6D858',
};

function colorSwatch(color: string) {
  const key = color.toLowerCase().split('/')[0].trim();
  return COLOR_HEX_MAP[key] || '#E8829A';
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

        <div className="grid md:grid-cols-2 gap-0">
          {/* Images */}
          <div className="bg-gray-soft">
            <div className="relative aspect-[731/1280]">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
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
          <div className="p-6 md:p-8 flex flex-col">
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
                      const img = product.colorImages?.[color];
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
