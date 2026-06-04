import Link from 'next/link';
import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts, getCategoryGroups } from '@/lib/data/queries';

export const metadata = {
  title: 'Tienda — Dulce Soñadora',
  description: 'Explora todo nuestro catálogo de pijamas y lencería.',
};

export default async function ShopPage() {
  const [products, categoryGroups] = await Promise.all([
    getAllProducts(),
    getCategoryGroups(),
  ]);
  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
      {/* Header */}
      <header className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          Catálogo completo
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-text-dark">Tienda</h1>
        <div className="divider-gradient" />
        <p className="mt-4 text-text-muted max-w-2xl mx-auto text-sm">
          Descubre {products.length} productos pensados para tu comodidad y elegancia.
        </p>
      </header>

      {/* Category chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categoryGroups.flatMap((g) =>
          g.categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className="px-4 py-1.5 text-xs uppercase tracking-wider border border-gray-line rounded-full hover:border-pink-deeper hover:text-pink-deeper transition"
            >
              {c.name}
            </Link>
          ))
        )}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
