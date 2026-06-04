'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import type { CategoryGroup } from '@/lib/data/categories';
import { WHATSAPP_NUMBER, buildWhatsAppLink } from '@/lib/utils/format';
import Logo from '@/components/ui/Logo';

const Facebook = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Instagram = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
);

const TikTok = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005.8 20.1a6.34 6.34 0 0010.86-4.43V8.94a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1.84-.37z" />
  </svg>
);

export default function Footer({ groups }: { groups: CategoryGroup[] }) {
  const whatsappLink = buildWhatsAppLink(
    WHATSAPP_NUMBER,
    '¡Hola Dulce Soñadora! Quisiera más información.'
  );

  return (
    <footer className="bg-gray-soft border-t border-gray-line mt-20">
      {/* Newsletter / call to action band */}
      <div className="bg-gradient-warm py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10" />
        <div className="container mx-auto text-center relative">
          <h2 className="font-serif text-2xl md:text-4xl text-white drop-shadow-md">
            Únete a nuestra comunidad
          </h2>
          <p className="text-sm md:text-base text-white/95 mt-3 max-w-md mx-auto">
            Recibe novedades, ofertas exclusivas y los nuevos diseños directo a tu WhatsApp.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-white text-pink-deeper px-8 py-3 rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all"
          >
            Escríbenos ✨
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 lg:px-8 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="Dulce Soñadora" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="mt-4 text-sm text-text-muted leading-relaxed italic">
              &ldquo;El encanto de soñar&rdquo;
            </p>
            <p className="mt-2 text-sm text-text-muted leading-relaxed">
              Pijamas y lencería con diseños románticos, hechos con dedicación y los mejores materiales para tus noches.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-line text-pink-deeper hover:bg-pink-deeper hover:text-white transition"
              >
                <Facebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-line text-pink-deeper hover:bg-pink-deeper hover:text-white transition"
              >
                <Instagram />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-line text-pink-deeper hover:bg-pink-deeper hover:text-white transition"
              >
                <TikTok />
              </a>
            </div>
          </div>

          {/* Categories */}
          {groups.map((group) => (
            <div key={group.key}>
              <h4 className="font-serif text-lg mb-4 text-text-dark">
                {group.label}
              </h4>
              <ul className="space-y-2">
                {group.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={`/categoria/${cat.slug}`}
                      className="text-sm text-text-muted hover:text-pink-deeper transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-12 pt-8 border-t border-gray-line grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-text-muted">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-pink-deeper mt-0.5" />
            <span>Cra. 50 # 12-34<br />Medellín, Colombia</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone size={16} className="text-pink-deeper mt-0.5" />
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-deeper"
            >
              +57 300 123 4567
            </a>
          </div>
          <div className="flex items-start gap-2">
            <Mail size={16} className="text-pink-deeper mt-0.5" />
            <a
              href="mailto:hola@dulcesoñadora.com"
              className="hover:text-pink-deeper"
            >
              hola@dulcesoñadora.com
            </a>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={16} className="text-pink-deeper mt-0.5" />
            <span>Lun a Sáb 9:00 – 18:00</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-line py-5 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Dulce Soñadora. Todos los derechos reservados.
      </div>
    </footer>
  );
}
