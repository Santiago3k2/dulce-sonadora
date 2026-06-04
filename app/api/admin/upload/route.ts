import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Sube una o varias imágenes al bucket product-images y devuelve sus URLs públicas.
// Protegido: solo administradores. Las subidas usan service_role (server-only).
export async function POST(req: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const form = await req.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 });
  }

  const sb = createAdminClient();
  const urls: string[] = [];

  for (const file of files) {
    if (file.size > 6 * 1024 * 1024) {
      return NextResponse.json(
        { error: `"${file.name}" supera 6 MB. Usa una imagen más liviana.` },
        { status: 400 }
      );
    }
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await sb.storage.from('product-images').upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const { data } = sb.storage.from('product-images').getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
