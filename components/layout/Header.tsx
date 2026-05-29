'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Search,
} from 'lucide-react';
import { categoryGroups } from '@/lib/data/categories';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const cartCount = useCartStore((s) => s.totalQuantity());
  const wishlistCount = useWishlistStore((s) => s.count());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-warm text-white text-center text-xs py-2.5 px-4 font-medium tracking-wide">
        ✨ Envíos contra entrega a toda Colombia · Precio mayorista desde 6 unidades 🌸
      </div>

      <header
        className={`sticky top-0 z-30 bg-white transition-shadow ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* Desktop */}
          <div className="hidden md:flex items-center justify-between h-28">
            {/* Logo */}
            <Link href="/" aria-label="Dulce Soñadora — Inicio" className="flex items-center">
              <Logo size="md" priority />
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-7">
              <Link
                href="/"
                className="text-sm uppercase tracking-wider hover:text-pink-deeper transition"
              >
                Inicio
              </Link>
              {categoryGroups.map((group) => (
                <div
                  key={group.key}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(group.key)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button className="flex items-center gap-1 text-sm uppercase tracking-wider hover:text-pink-deeper transition">
                    {group.label}
                    <ChevronDown size={14} />
                  </button>
                  {openGroup === group.key && (
                    <div className="absolute top-full left-0 pt-3 z-20">
                      <div className="bg-white shadow-lg border border-gray-line rounded-md py-3 min-w-[220px] animate-fade-in">
                        {group.categories.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/categoria/${cat.slug}`}
                            className="block px-5 py-2 text-sm hover:bg-pink-soft/30 hover:text-pink-deeper transition"
                          >
                            {cat.name}
                          </Link>
                        ))}
                        <div className="border-t border-gray-line mt-2 pt-2">
                          <Link
                            href="/tienda"
                            className="block px-5 py-2 text-xs italic text-pink-deeper hover:text-pink-dark"
                          >
                            Ver todo →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Link
                href="/contacto"
                className="text-sm uppercase tracking-wider hover:text-pink-deeper transition"
              >
                Contáctanos
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link
                href="/wishlist"
                aria-label="Lista de deseos"
                className="relative hover:text-pink-deeper transition"
              >
                <Heart size={22} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-deeper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={openCart}
                aria-label="Abrir carrito"
                className="relative hover:text-pink-deeper transition"
              >
                <ShoppingBag size={22} />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-deeper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link
                href="/contacto"
                aria-label="Mi cuenta"
                className="hover:text-pink-deeper transition"
              >
                <User size={22} />
              </Link>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center justify-between h-20">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="p-2 -ml-2"
            >
              <Menu size={24} />
            </button>
            <Link href="/" aria-label="Dulce Soñadora — Inicio" className="flex items-center">
              <Logo size="sm" priority />
            </Link>
            <button
              onClick={openCart}
              aria-label="Abrir carrito"
              className="relative p-2 -mr-2"
            >
              <ShoppingBag size={22} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-pink-deeper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col overflow-y-auto`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-line">
            <Logo size="sm" />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="p-2 -m-2"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex-1 px-5 py-5 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-gray-line text-sm uppercase tracking-wider hover:text-pink-deeper"
            >
              Inicio
            </Link>
            <Link
              href="/tienda"
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-gray-line text-sm uppercase tracking-wider hover:text-pink-deeper"
            >
              Tienda
            </Link>
            {categoryGroups.map((group) => (
              <details
                key={group.key}
                className="border-b border-gray-line"
              >
                <summary className="py-3 cursor-pointer text-sm uppercase tracking-wider list-none flex items-center justify-between hover:text-pink-deeper">
                  {group.label}
                  <ChevronDown size={14} />
                </summary>
                <ul className="pb-3 pl-3 space-y-2">
                  {group.categories.map((cat) => (
                    <li key={cat.slug}>
                      <Link
                        href={`/categoria/${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-sm text-text-muted hover:text-pink-deeper"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-gray-line text-sm uppercase tracking-wider hover:text-pink-deeper"
            >
              Contáctanos
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-gray-line text-sm uppercase tracking-wider hover:text-pink-deeper"
            >
              <span className="inline-flex items-center gap-2">
                <Heart size={16} /> Lista de deseos
                {mounted && wishlistCount > 0 && (
                  <span className="bg-pink-deeper text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </span>
            </Link>
          </nav>
        </aside>
      </div>
    </>
  );
}
