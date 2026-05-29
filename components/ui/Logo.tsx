'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

// El logo recortado mide ~614 x 410 (relación ~1.5:1)
const sizeMap = {
  sm: { width: 105, height: 70, heightClass: 'h-14' },
  md: { width: 150, height: 100, heightClass: 'h-20' },
  lg: { width: 210, height: 140, heightClass: 'h-28' },
};

export default function Logo({
  size = 'md',
  className = '',
  priority = false,
}: LogoProps) {
  const { width, height, heightClass } = sizeMap[size];

  return (
    <Image
      src="/logo.png"
      alt="Dulce Soñadora — El encanto de soñar"
      width={width}
      height={height}
      priority={priority}
      className={`w-auto ${heightClass} object-contain select-none drop-shadow-sm ${className}`}
    />
  );
}
