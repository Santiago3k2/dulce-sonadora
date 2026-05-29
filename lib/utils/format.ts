export function formatCOP(price: number): string {
  return `$${Math.round(price).toLocaleString('es-CO').replace(/,/g, '.')}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const WHATSAPP_NUMBER = '573001234567';
