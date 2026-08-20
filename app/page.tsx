import HeroSlider from '@/components/home/HeroSlider';
import { HERO_SLUGS, type HeroPrice } from '@/lib/data/hero-slides';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import {
  getCategories,
  getFeaturedProducts,
  getNewProducts,
  getProductsBySlugs,
} from '@/lib/data/queries';

export default async function HomePage() {
  const [categories, featured, news, heroProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewProducts(),
    getProductsBySlugs(HERO_SLUGS),
  ]);

  // El hero muestra el precio real del catálogo, no uno escrito a mano.
  const heroPrices: Record<string, HeroPrice> = {};
  for (const p of heroProducts) {
    heroPrices[p.slug] = { retail: p.priceRetail, wholesale: p.priceWholesale };
  }

  return (
    <>
      <HeroSlider prices={heroPrices} />
      <CategoryGrid categories={categories} />
      <BenefitsSection />
      <FeaturedProducts featured={featured} news={news} />
    </>
  );
}
