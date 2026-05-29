'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import ProductGrid from '@/components/products/ProductGrid';
import { products } from '@/lib/data/products';
import { useWishlistStore } from '@/lib/store/wishlistStore';

export default function WishlistContent() {
  const [mounted, setMounted] = useState(false);
  const items = useWishlistStore((s) => s.items);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-text-muted">
        Cargando favoritos…
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          Tus favoritos
        </p>
        <h1 className="font-serif text-3xl md:text-5xl">Lista de Deseos</h1>
        <div className="divider-gradient" />
      </header>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-20">
          <Heart
            size={64}
            className="mx-auto text-pink-soft mb-4"
            strokeWidth={1.2}
          />
          <p className="font-serif text-xl mb-2">No tienes favoritos aún</p>
          <p className="text-text-muted mb-6">
            Toca el corazón en los productos que te gustan para guardarlos aquí.
          </p>
          <Link href="/tienda" className="btn-primary">
            Explorar tienda
          </Link>
        </div>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </div>
  );
}
