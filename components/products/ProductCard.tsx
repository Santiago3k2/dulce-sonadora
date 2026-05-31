'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye } from 'lucide-react';
import type { Product } from '@/lib/data/products';
import PriceDisplay from '@/components/ui/PriceDisplay';
import WishlistButton from '@/components/ui/WishlistButton';
import Badge from '@/components/ui/Badge';
import QuickView from './QuickView';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mainImage = product.images[0];
  const secondaryImage = product.images[1] ?? mainImage;

  return (
    <>
      <div className="group relative">
        <Link
          href={`/producto/${product.slug}`}
          className="block"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image */}
          <div className="relative aspect-[731/1280] bg-gray-soft overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-contain transition-all duration-500 ${
                hovered && product.images.length > 1
                  ? 'opacity-0 scale-105'
                  : 'opacity-100'
              }`}
            />
            {product.images.length > 1 && (
              <Image
                src={secondaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-contain transition-all duration-500 ${
                  hovered ? 'opacity-100 scale-105' : 'opacity-0'
                }`}
              />
            )}

            {/* Out of stock overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-gray-800 text-white px-4 py-2 text-xs uppercase tracking-widest font-semibold">
                  Agotado
                </span>
              </div>
            )}

            {/* Badges top-left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNew && <Badge variant="new">Nuevo</Badge>}
              {product.isFeatured && <Badge variant="featured">Favorito</Badge>}
            </div>

            {/* Wishlist top-right */}
            <div className="absolute top-3 right-3">
              <WishlistButton productId={product.id} />
            </div>

            {/* Quick view button on hover */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className={`absolute left-1/2 -translate-x-1/2 bottom-4 bg-white text-text-dark text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all duration-300 ${
                hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } hover:bg-pink-deeper hover:text-white`}
            >
              <Eye size={14} />
              Vista rápida
            </button>
          </div>

          {/* Info */}
          <div className="pt-3 space-y-1">
            <h3 className="text-sm md:text-base font-medium text-text-dark line-clamp-2 group-hover:text-pink-deeper transition">
              {product.name}
            </h3>
            <PriceDisplay
              priceRetail={product.priceRetail}
              priceWholesale={product.priceWholesale}
              size="md"
            />
          </div>
        </Link>

        {/* Select options button */}
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <Link
            href={`/producto/${product.slug}`}
            className="text-xs uppercase tracking-wider text-pink-deeper hover:text-pink-dark transition"
          >
            Seleccionar opciones →
          </Link>
          <Link
            href={`/oferta/${product.slug}`}
            className="text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-pink-vivid to-pink-deeper bg-clip-text text-transparent hover:opacity-80 transition"
          >
            ✨ Ver oferta
          </Link>
        </div>
      </div>

      {quickViewOpen && (
        <QuickView product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </>
  );
}
