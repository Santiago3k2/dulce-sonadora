'use client';

import { formatCOP } from '@/lib/utils/format';

interface PriceDisplayProps {
  priceRetail: number;
  priceWholesale: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center';
  showLabels?: boolean;
}

const sizeMap = {
  sm: { retail: 'text-xs', wholesale: 'text-sm' },
  md: { retail: 'text-sm', wholesale: 'text-base' },
  lg: { retail: 'text-base', wholesale: 'text-xl' },
  xl: { retail: 'text-lg', wholesale: 'text-3xl' },
};

export default function PriceDisplay({
  priceRetail,
  priceWholesale,
  size = 'md',
  align = 'left',
  showLabels = false,
}: PriceDisplayProps) {
  const sizes = sizeMap[size];
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <div className="flex items-baseline gap-1">
        {showLabels && (
          <span className="text-[10px] uppercase tracking-wider text-text-muted">
            Unidad
          </span>
        )}
        <span className={`${sizes.retail} text-text-muted line-through`}>
          {formatCOP(priceRetail)}
        </span>
      </div>
      <div className="flex items-baseline gap-1 mt-0.5">
        {showLabels && (
          <span className="text-[10px] uppercase tracking-wider text-pink-deeper font-medium">
            Mayorista
          </span>
        )}
        <span className={`${sizes.wholesale} text-pink-deeper font-semibold`}>
          {formatCOP(priceWholesale)}
        </span>
      </div>
    </div>
  );
}
