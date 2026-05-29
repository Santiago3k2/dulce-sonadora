'use client';

interface BadgeProps {
  variant?: 'new' | 'sale' | 'sold-out' | 'featured';
  children: React.ReactNode;
  className?: string;
}

const styles = {
  new: 'bg-pink-soft text-pink-deeper',
  sale: 'bg-pink-deeper text-white',
  'sold-out': 'bg-gray-700 text-white',
  featured: 'bg-white text-pink-deeper border border-pink-soft',
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
