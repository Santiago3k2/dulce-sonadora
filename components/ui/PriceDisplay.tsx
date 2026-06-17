'use client';

import { Tag } from 'lucide-react';
import { formatCOP } from '@/lib/utils/format';

interface PriceDisplayProps {
  priceRetail: number;
  priceWholesale: number;
  /** Unidades a partir de las cuales aplica el precio mayorista (def. 6). */
  wholesaleMinQty?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  align?: 'left' | 'center';
  /**
   * 'card'   → compacto, para tarjetas y listados.
   * 'detail' → precio grande + cápsula con el beneficio mayorista (producto/quickview).
   */
  variant?: 'card' | 'detail';
}

const sizeMap = {
  sm: { retail: 'text-base', note: 'text-[10px]', icon: 10 },
  md: { retail: 'text-lg', note: 'text-[11px]', icon: 11 },
  lg: { retail: 'text-2xl', note: 'text-xs', icon: 13 },
  xl: { retail: 'text-3xl md:text-4xl', note: 'text-sm', icon: 15 },
};

export default function PriceDisplay({
  priceRetail,
  priceWholesale,
  wholesaleMinQty = 6,
  size = 'md',
  align = 'left',
  variant = 'card',
}: PriceDisplayProps) {
  const s = sizeMap[size];
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const save = Math.max(0, priceRetail - priceWholesale);

  // Versión ampliada (página de producto / vista rápida): el precio al detal
  // manda como precio principal y el mayorista se ofrece como beneficio.
  if (variant === 'detail') {
    return (
      <div className={`flex flex-col gap-2.5 ${alignClass}`}>
        <div className={`flex flex-col ${align === 'center' ? 'items-center' : 'items-start'}`}>
          <span className="text-[11px] uppercase tracking-wider text-text-muted">
            Precio por unidad
          </span>
          <span className={`${s.retail} font-semibold text-text-dark leading-tight`}>
            {formatCOP(priceRetail)}
          </span>
        </div>

        {save > 0 && (
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-pink-soft px-4 py-2 shadow-pink-soft">
            <Tag size={s.icon} className="text-pink-deeper shrink-0" />
            <span className="text-sm text-pink-deeper leading-snug">
              <strong className="font-semibold">Desde {wholesaleMinQty} unidades:</strong>{' '}
              {formatCOP(priceWholesale)} c/u
              <span className="text-pink-dark"> · ahorras {formatCOP(save)} c/u</span>
            </span>
          </div>
        )}
      </div>
    );
  }

  // Versión compacta (tarjetas): precio al detal destacado + guiño mayorista.
  return (
    <div className={`flex flex-col ${alignClass}`}>
      <span className={`${s.retail} font-semibold text-text-dark leading-tight`}>
        {formatCOP(priceRetail)}
      </span>
      {save > 0 && (
        <span
          className={`mt-0.5 inline-flex items-center gap-1 ${s.note} text-pink-deeper font-medium`}
        >
          <Tag size={s.icon} className="shrink-0" />
          Desde {wholesaleMinQty}: {formatCOP(priceWholesale)} c/u
        </span>
      )}
    </div>
  );
}
