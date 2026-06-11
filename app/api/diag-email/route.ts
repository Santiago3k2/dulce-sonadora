import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Endpoint TEMPORAL de diagnóstico de correo. Se elimina tras verificar.
// Protegido por un token en la query para que no lo dispare cualquiera.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('key') !== 'ds-diag-2026') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_ADMIN_EMAIL;
  const from = process.env.RESEND_FROM || 'Dulce Soñadora <onboarding@resend.dev>';

  const env = {
    hasApiKey: !!apiKey,
    hasAdminEmail: !!to,
    from,
    toMasked: to ? to.replace(/(.{3}).*(@.*)/, '$1***$2') : null,
  };

  if (!apiKey || !to) {
    return NextResponse.json({ ok: false, reason: 'env-missing-en-vercel', env });
  }

  try {
    const resend = new Resend(apiKey);
    const r = await resend.emails.send({
      from,
      to,
      subject: '🌸 Prueba de aviso de pedido — Dulce Soñadora',
      html: '<p>Prueba del sistema de notificaciones de pedidos. Si recibiste este correo, los avisos por email funcionan ✅. Puedes ignorarlo.</p>',
    });
    return NextResponse.json({
      ok: !r.error,
      env,
      resendId: r.data?.id ?? null,
      error: r.error ?? null,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, env, error: String((e as Error)?.message ?? e) });
  }
}
