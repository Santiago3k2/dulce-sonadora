import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react';
import { WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';

export const metadata = {
  title: 'Contacto — Dulce Soñadora',
  description: 'Contáctanos para pedidos, mayoristas o resolver tus dudas.',
};

export default function ContactPage() {
  const whatsapp = buildWhatsAppLink(
    WHATSAPP_NUMBER,
    '¡Hola Dulce Soñadora! Me gustaría más información.'
  );

  const whatsappMayoreo = buildWhatsAppLink(
    WHATSAPP_NUMBER,
    '¡Hola! Quiero información sobre pedidos al por mayor.'
  );

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16 max-w-5xl">
      <header className="text-center mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-pink-deeper mb-2">
          Estamos aquí para ti
        </p>
        <h1 className="font-serif text-3xl md:text-5xl">Contáctanos</h1>
        <div className="mx-auto mt-4 w-16 h-px bg-pink-deeper" />
        <p className="mt-4 text-text-muted max-w-2xl mx-auto">
          ¿Dudas sobre tallas, envíos o pedidos al por mayor? Escríbenos y te respondemos pronto.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-pink-soft/40 to-white border border-pink-soft rounded-lg p-8 text-center hover:shadow-lg transition"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-pink-soft flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <MessageCircle size={26} className="text-pink-deeper" />
          </div>
          <h3 className="font-serif text-xl text-text-dark mb-2">Pedido por WhatsApp</h3>
          <p className="text-sm text-text-muted mb-4">
            Atención rápida, fotos en vivo y envío contra entrega.
          </p>
          <span className="inline-block text-pink-deeper font-medium">
            Escribir ahora →
          </span>
        </a>

        <a
          href={whatsappMayoreo}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-gradient-to-br from-pink-soft/40 to-white border border-pink-soft rounded-lg p-8 text-center hover:shadow-lg transition"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-pink-soft flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Phone size={26} className="text-pink-deeper" />
          </div>
          <h3 className="font-serif text-xl text-text-dark mb-2">Mayoristas</h3>
          <p className="text-sm text-text-muted mb-4">
            Compra desde 6 unidades y obtén precio especial.
          </p>
          <span className="inline-block text-pink-deeper font-medium">
            Cotizar mayoreo →
          </span>
        </a>
      </div>

      {/* Info grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="flex flex-col items-center text-center gap-2">
          <MapPin size={28} className="text-pink-deeper" strokeWidth={1.4} />
          <h4 className="font-serif text-base">Dirección</h4>
          <p className="text-xs text-text-muted">
            Cra. 50 # 12-34<br />Medellín, Colombia
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Phone size={28} className="text-pink-deeper" strokeWidth={1.4} />
          <h4 className="font-serif text-base">Teléfono</h4>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-pink-deeper"
          >
            +57 300 123 4567
          </a>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Mail size={28} className="text-pink-deeper" strokeWidth={1.4} />
          <h4 className="font-serif text-base">Email</h4>
          <a
            href="mailto:hola@dulcesoñadora.com"
            className="text-xs text-text-muted hover:text-pink-deeper"
          >
            hola@dulcesoñadora.com
          </a>
        </div>
        <div className="flex flex-col items-center text-center gap-2">
          <Clock size={28} className="text-pink-deeper" strokeWidth={1.4} />
          <h4 className="font-serif text-base">Horario</h4>
          <p className="text-xs text-text-muted">
            Lun a Sáb<br />9:00 – 18:00
          </p>
        </div>
      </div>

      {/* Form */}
      <section className="bg-gray-soft rounded-lg p-8 md:p-12">
        <h2 className="font-serif text-2xl mb-6 text-center">
          Envíanos un mensaje
        </h2>
        <form
          className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto"
          action="mailto:hola@dulcesoñadora.com"
          method="post"
          encType="text/plain"
        >
          <input
            required
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="px-4 py-3 border border-gray-line rounded-md bg-white focus:outline-none focus:border-pink-deeper transition"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Email"
            className="px-4 py-3 border border-gray-line rounded-md bg-white focus:outline-none focus:border-pink-deeper transition"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="WhatsApp (opcional)"
            className="px-4 py-3 border border-gray-line rounded-md bg-white focus:outline-none focus:border-pink-deeper transition md:col-span-2"
          />
          <textarea
            required
            rows={4}
            name="mensaje"
            placeholder="Tu mensaje"
            className="px-4 py-3 border border-gray-line rounded-md bg-white focus:outline-none focus:border-pink-deeper transition md:col-span-2 resize-none"
          />
          <button type="submit" className="btn-primary md:col-span-2">
            Enviar mensaje
          </button>
        </form>
      </section>
    </div>
  );
}
