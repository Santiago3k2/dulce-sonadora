'use client';

import type { Product } from '@/lib/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  cols?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  emptyMessage = 'No hay productos disponibles en esta categoría todavía.',
  cols = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted font-serif text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const colsClass = {
    2: 'grid-cols-2 md:grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[cols];

  return (
    <div className={`grid ${colsClass} gap-4 md:gap-6 lg:gap-8`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
