import WishlistContent from './WishlistContent';
import { getAllProducts } from '@/lib/data/queries';

export const metadata = {
  title: 'Tu lista de deseos — Dulce Soñadora',
  description: 'Tus productos favoritos guardados.',
};

export default async function WishlistPage() {
  const products = await getAllProducts();
  return <WishlistContent products={products} />;
}
