'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Truck, RotateCcw, Shield } from 'lucide-react';
import { priceForSize, type Product } from '@/lib/data/products';
import { colorSwatch, imageForColor } from '@/lib/data/colors';
import PriceDisplay from '@/components/ui/PriceDisplay';
import Badge from '@/components/ui/Badge';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';

export default function ProductDetail({ product }: { product: Product }) {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWish = useWishlistStore((s) => s.toggleItem);
  const inWish = useWishlistStore((s) => s.isInWishlist(product.id));
  const router = useRouter();

  // Precio de la talla elegida (cae al precio base si la prenda no varía por talla).
  const price = priceForSize(product, selectedSize);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      priceRetail: price.retail,
      priceWholesale: price.wholesale,
      quantity,
    });
  };

  // Pedir y pagar contra entrega: agrega al carrito y lleva al checkout.
  const handleOrderNow = () => {
    handleAdd();
    router.push('/checkout');
  };

  // grid-cols-1 + min-w-0: sin esto, en móvil la tira de miniaturas (6+ fotos)
  // empuja la columna más allá del ancho de pantalla y la foto principal se
  // desborda gigante (el min-width:auto de grid/flex no deja encoger).
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col-reverse md:flex-row gap-4 min-w-0">
        {product.images.length > 1 && (
          <div className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto no-scrollbar md:max-h-[640px] min-w-0 max-w-full">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 bg-gray-soft overflow-hidden transition ${
                  mainImage === img
                    ? 'ring-2 ring-pink-deeper'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
        <div className="relative aspect-[2/3] flex-1 bg-cream overflow-hidden rounded-lg">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-contain"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="new">Nuevo</Badge>}
            {product.isFeatured && <Badge variant="featured">Favorito</Badge>}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-800 text-white px-5 py-2 text-sm uppercase tracking-widest font-semibold">
                Agotado
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col min-w-0">
        <h1 className="font-serif text-3xl md:text-4xl text-text-dark leading-tight">
          {product.name}
        </h1>

        <div className="mt-2 flex items-center gap-1 text-amber-500 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>★</span>
          ))}
          <span className="text-text-muted ml-2 text-xs">
            Producto destacado por nuestras clientas
          </span>
        </div>

        <div className="mt-6">
          <PriceDisplay
            priceRetail={price.retail}
            priceWholesale={price.wholesale}
            size="xl"
            showLabels
          />
        </div>

        <p className="mt-6 text-text-muted leading-relaxed">
          {product.description}
        </p>

        {/* Color */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">
            Color: <span className="text-pink-deeper">{selectedColor}</span>
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
                className={`w-10 h-10 rounded-full border-2 transition ${
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
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">
            Talla: <span className="text-pink-deeper">{selectedSize}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[48px] px-4 py-2 text-sm border rounded-full transition ${
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

        {/* Quantity + Add */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="inline-flex items-center border border-gray-line rounded-full">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-3 hover:text-pink-deeper"
              aria-label="Restar"
            >
              −
            </button>
            <span className="px-4 text-base w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 py-3 hover:text-pink-deeper"
              aria-label="Sumar"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {product.inStock ? 'Agregar al carrito' : 'Agotado'}
          </button>
          <button
            onClick={() => toggleWish(product.id)}
            aria-label="Favorito"
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition ${
              inWish
                ? 'border-pink-deeper bg-pink-soft/30 text-pink-deeper'
                : 'border-gray-line text-text-muted hover:border-pink-deeper hover:text-pink-deeper'
            }`}
          >
            <Heart
              size={18}
              className={inWish ? 'fill-pink-deeper' : ''}
            />
          </button>
        </div>

        <button
          onClick={handleOrderNow}
          disabled={!product.inStock}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-pink-deeper hover:bg-pink-dark text-white py-3 px-6 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          Pedir y pagar contra entrega
        </button>

        <p className="mt-5 text-xs text-text-muted italic">
          ⓘ Precio mayorista aplica automáticamente al sumar {product.wholesaleMinQty} o más unidades en el carrito.
        </p>

        {/* Trust badges */}
        <div className="mt-8 pt-6 border-t border-gray-line grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center gap-1.5 text-xs">
            <Truck size={20} className="text-pink-deeper" />
            <span className="font-medium">Envío contra entrega</span>
            <span className="text-text-muted">Toda Colombia</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 text-xs">
            <RotateCcw size={20} className="text-pink-deeper" />
            <span className="font-medium">Cambios fáciles</span>
            <span className="text-text-muted">Por talla</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 text-xs">
            <Shield size={20} className="text-pink-deeper" />
            <span className="font-medium">Calidad garantizada</span>
            <span className="text-text-muted">Hecho en Colombia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
