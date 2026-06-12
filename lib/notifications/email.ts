import { Resend } from 'resend';
import { formatCOP } from '@/lib/utils/format';

/**
 * Notificación por email a la dueña cuando entra un pedido (Resend).
 *
 * Configurar en .env.local y en Vercel:
 *   RESEND_API_KEY      -> clave de https://resend.com
 *   RESEND_ADMIN_EMAIL  -> correo donde quieres recibir los avisos
 *   RESEND_FROM         -> opcional. Por defecto "Dulce Soñadora <onboarding@resend.dev>"
 *                          (con dominio propio verificado: "pedidos@tudominio.com")
 *
 * Si falta la API key o el correo destino, NO hace nada (no rompe el pedido).
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dulce-sonadora.vercel.app';

export interface OrderEmailItem {
  name: string;
  quantity: number;
  size?: string | null;
  color?: string | null;
  unitPrice: number;
}

export interface OrderEmailData {
  orderNumber: number;
  customerName: string;
  customerPhone: string;
  customerCity?: string | null;
  total: number;
  paymentLabel: string;
  /** true = el cliente solo abrió WhatsApp, aún no confirma datos */
  isWhatsAppLead?: boolean;
  items: OrderEmailItem[];
}

function buildHtml(o: OrderEmailData): string {
  const rows = o.items
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0e6ec;">
          ${it.name}
          <div style="color:#9b8a93;font-size:12px;">
            ${[it.size && `Talla ${it.size}`, it.color, `x${it.quantity}`].filter(Boolean).join(' · ')}
          </div>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #f0e6ec;text-align:right;white-space:nowrap;">
          ${formatCOP(it.unitPrice * it.quantity)}
        </td>
      </tr>`
    )
    .join('');

  const lead = o.isWhatsAppLead
    ? `<p style="background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;padding:10px 12px;border-radius:8px;font-size:13px;">
         💬 El cliente abrió WhatsApp para pedir. Aún no confirma sus datos — hazle seguimiento si no escribe.
       </p>`
    : '';

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#3d2b33;">
    <div style="background:linear-gradient(135deg,#FF7FB0,#E0568A);padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="color:#fff;margin:0;font-size:20px;">🌸 Nuevo pedido #${o.orderNumber}</h1>
    </div>
    <div style="border:1px solid #f0e6ec;border-top:none;border-radius:0 0 12px 12px;padding:20px 24px;">
      ${lead}
      <p style="margin:0 0 4px;"><strong>Cliente:</strong> ${o.customerName}</p>
      <p style="margin:0 0 4px;"><strong>Teléfono:</strong> ${o.customerPhone}</p>
      ${o.customerCity ? `<p style="margin:0 0 4px;"><strong>Ciudad:</strong> ${o.customerCity}</p>` : ''}
      <p style="margin:0 0 16px;"><strong>Pago:</strong> ${o.paymentLabel}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
      <p style="text-align:right;font-size:18px;font-weight:bold;color:#E0568A;margin:16px 0 0;">
        Total: ${formatCOP(o.total)}
      </p>
      <a href="${SITE}/admin/pedidos"
         style="display:inline-block;margin-top:18px;background:#E0568A;color:#fff;text-decoration:none;padding:11px 22px;border-radius:999px;font-weight:bold;">
        Ver pedido en el panel →
      </a>
    </div>
  </div>`;
}

// Las env vars pegadas en Vercel desde Windows pueden traer un BOM invisible
// (U+FEFF o sus bytes "ï»¿") que rompe la cabecera Authorization de fetch.
function cleanEnv(v: string | undefined): string | undefined {
  const s = v?.replace(/\uFEFF|ï»¿/g, '').trim();
  return s || undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Envía con reintentos. Resend limita a 5 correos/segundo: en una ráfaga de
 * pedidos (compras masivas) los envíos extra reciben 429. En vez de perder el
 * aviso, reintentamos con espera creciente + jitter. El pedido ya está guardado
 * en la BD, así que esto solo afecta a la notificación, nunca a la venta.
 */
async function sendWithRetry(
  resend: Resend,
  params: { from: string; to: string; subject: string; html: string },
  maxAttempts = 4
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { error } = await resend.emails.send(params);
      if (!error) return; // enviado

      const status = (error as { statusCode?: number }).statusCode;
      const retryable = status === 429 || (status != null && status >= 500);
      if (!retryable || attempt === maxAttempts) {
        console.error('notifyNewOrder (Resend) error:', error);
        return;
      }
    } catch (e) {
      if (attempt === maxAttempts) {
        console.error('notifyNewOrder (Resend) threw:', e);
        return;
      }
    }
    // Espera ~0.6s, 1.2s, 2.4s + algo de azar para repartir la ráfaga.
    await sleep(600 * 2 ** (attempt - 1) + Math.random() * 400);
  }
}

export async function notifyNewOrder(data: OrderEmailData): Promise<void> {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  const to = cleanEnv(process.env.RESEND_ADMIN_EMAIL);
  if (!apiKey || !to) return; // aún no configurado -> no-op silencioso

  const from = cleanEnv(process.env.RESEND_FROM) || 'Dulce Soñadora <onboarding@resend.dev>';
  const resend = new Resend(apiKey);
  const tag = data.isWhatsAppLead ? '(WhatsApp) ' : '';
  await sendWithRetry(resend, {
    from,
    to,
    subject: `🌸 Nuevo pedido #${data.orderNumber} ${tag}— ${formatCOP(data.total)}`,
    html: buildHtml(data),
  });
}
