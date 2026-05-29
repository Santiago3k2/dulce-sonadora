'use client';

import { Sparkles, Heart, Truck } from 'lucide-react';

const benefits = [
  {
    icon: <Sparkles size={32} className="text-pink-deeper" strokeWidth={1.4} />,
    title: 'Calidad Superior',
    description: 'Confeccionadas con los mejores materiales para que duren y se sientan increíbles.',
  },
  {
    icon: <Heart size={32} className="text-pink-deeper" strokeWidth={1.4} />,
    title: 'Diseños Encantadores',
    description: 'Florales, pasteles y prints únicos — perfectas como regalo o autoregalo.',
  },
  {
    icon: <Truck size={32} className="text-pink-deeper" strokeWidth={1.4} />,
    title: 'Envíos Contra Entrega',
    description: 'Entregamos en toda Colombia directo a tu puerta. Pagas al recibir.',
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-gray-soft py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-3 gap-10">
        {benefits.map((b, i) => (
          <div key={i} className="text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white border border-pink-soft flex items-center justify-center mb-4">
              {b.icon}
            </div>
            <h3 className="font-serif text-xl text-text-dark mb-2">{b.title}</h3>
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              {b.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
