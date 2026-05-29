'use client';

interface BadgeProps {
  variant?: 'new' | 'sale' | 'sold-out' | 'featured';
  children: React.ReactNode;
  className?: string;
}

const styles = {
  new: 'bg-gradient-to-r from-pink-dark to-pink-deeper text-white shadow-pink-soft',
  sale: 'bg-gradient-to-r from-pink-vivid to-pink-deeper text-white shadow-pink',
  'sold-out': 'bg-gray-800 text-white',
  featured: 'bg-gradient-to-r from-gold-soft to-rose-gold text-white shadow-pink-soft',
};

export default function Badge({ variant = 'new', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
