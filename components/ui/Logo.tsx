'use client';

import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { width: 130, height: 60, heightClass: 'h-12' },
  md: { width: 180, height: 80, heightClass: 'h-16' },
  lg: { width: 260, height: 120, heightClass: 'h-24' },
};

export default function Logo({
  size = 'md',
  className = '',
  priority = false,
}: LogoProps) {
  const { width, height, heightClass } = sizeMap[size];

  return (
    <Image
      src="/logo.jpeg"
      alt="Dulce Soñadora — El encanto de soñar"
      width={width}
      height={height}
      priority={priority}
      className={`w-auto ${heightClass} object-contain mix-blend-multiply select-none ${className}`}
    />
  );
}
