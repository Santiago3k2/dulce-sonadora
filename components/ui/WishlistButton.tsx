'use client';

import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWishlistStore } from '@/lib/store/wishlistStore';

interface WishlistButtonProps {
  productId: string;
  className?: string;
  size?: number;
}

export default function WishlistButton({
  productId,
  className = '',
  size = 18,
}: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);
  const toggleItem = useWishlistStore((s) => s.toggleItem);

  useEffect(() => setMounted(true), []);

  const isActive = mounted && isInWishlist(productId);

  return (
    <button
      type="button"
      aria-label={isActive ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleItem(productId);
      }}
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm border border-gray-line transition hover:scale-110 ${className}`}
    >
      <Heart
        size={size}
        className={`transition ${
          isActive
            ? 'fill-pink-dark stroke-pink-dark'
            : 'stroke-text-muted'
        }`}
      />
    </button>
  );
}
