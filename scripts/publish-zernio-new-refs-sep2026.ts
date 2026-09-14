import { readFileSync, existsSync } from 'fs';
import { basename, extname, join } from 'path';

/**
 * Publica las referencias nuevas de "IMAGENES Y REFERENCIAS NUEVAS" (sep 2026)
 * en Instagram + Facebook vía Zernio: 406 (crop top + pantalón) y el crop top +
 * short marcado "407". Las fotos de agosto ya salieron con
 * publish-zernio-new-refs-ago2026.ts.
 *
 * Un carrusel por referencia, en orden de referencia; dentro de cada carrusel
 * las fotos van ordenadas por estampado (las fotos venían revueltas y sin
 * agrupar: se identificaron por la marca de agua Ref/NNN de cada foto).
 *
 * Ad-hoc igual que publish-zernio-new-refs.ts: NO toca lib/data/products.ts ni
 * Supabase. Sin precios en el caption — 406/407 aún no tienen precio, así que el
 * caption lleva a WhatsApp/DM/web.
 *
 * Las fotos vienen a ~0.57 (9:16), IG solo acepta hasta 4:5 → se publican las
 * copias 4:5 generadas con:
 *   powershell -File scripts\prepare-ig-images.ps1 -Root "ig-src-new-refs-sep2026" -Out "ig-images-new-refs-sep2026"
 *
 * Uso: npx tsx scripts/publish-zernio-new-refs-sep2026.ts
 *      DRY=1 npx tsx ...            (solo muestra el plan, no publica)
 *      ONLY=406 npx tsx ...     (solo esas refs)
 */

process.loadEnvFile('.env.local');

const API = 'https://zernio.com/api/v1';

// Primer comentario automático (IG/FB): deja el WhatsApp y el link visibles aunque
// el caption se corte con "... más". No aplica a TikTok ni a historias/reels.
const FIRST_COMMENT = [
  '📲 Pedidos por WhatsApp: 317 727 6506 → wa.me/573177276506',
  '🛍️ Catálogo completo en dulcesoñadora.com',
].join('\n');
const firstCommentFor = (platform: string) =>
  platform === 'instagram' || platform === 'facebook'
    ? { platformSpecificData: { firstComment: FIRST_COMMENT } }
    : {};
const KEY = process.env.ZERNIO_API_KEY;
const IG_DIR = process.env.IG_IMAGES_DIR ?? 'ig-images-new-refs-sep2026';
const DRY = process.env.DRY === '1';
const DELAY_MS = process.env.DELAY_MS ? parseInt(process.env.DELAY_MS, 10) : 8000;

const TARGETS = [
  process.env.ZERNIO_IG_ACCOUNT_ID && { platform: 'instagram', accountId: process.env.ZERNIO_IG_ACCOUNT_ID },
  process.env.ZERNIO_FB_ACCOUNT_ID && { platform: 'facebook', accountId: process.env.ZERNIO_FB_ACCOUNT_ID },
].filter((t): t is { platform: string; accountId: string } => Boolean(t));

if (!DRY) {
  if (!KEY) { console.error('Falta ZERNIO_API_KEY en .env.local.'); process.exit(1); }
  if (!TARGETS.length) { console.error('No hay cuentas IG/FB configuradas.'); process.exit(1); }
  if (!existsSync(IG_DIR)) {
    console.error(`Falta la carpeta de fotos 4:5 "${IG_DIR}". Genérala con:\n  powershell -File scripts\\prepare-ig-images.ps1 -Root "ig-src-new-refs-sep2026" -Out ${IG_DIR}`);
    process.exit(1);
  }
}

const BASE_TAGS = [
  '#dulcesoñadora', '#pijamas', '#pijamascolombia', '#pijamasmujer',
  '#ropadedormir', '#modafemenina', '#fabricantesdepijamas',
  '#pijamascolombianas', '#nuevoingreso',
];

interface Post {
  /** Clave para ONLY= y para los logs (única por post). */
  key: string;
  /** Referencia tal como va en el caption. */
  ref: string;
  titulo: string;
  hook: string;
  estampados: string;
  tallas?: string;
  tags: string[];
  files: string[];
}

const ONLY = process.env.ONLY ? process.env.ONLY.split(',').map((s) => s.trim()) : null;

// Orden de publicación: por número de referencia. Dentro de cada una, las fotos
// van ordenadas por estampado (la primera es la que abre el carrusel).
const posts: Post[] = [
  {
    key: '406',
    ref: '406',
    titulo: 'Crop top + pantalón largo',
    hook: '💜 ¡Referencia NUEVA! Crop top de tiras anchas con elástico Dulce Soñadora y pantalón largo estampado a juego. Cómodo, suavecito y lindo por delante y por detrás.',
    estampados: '5 estampados: corazones lila, moños azules, perrito con corazones, cerezas y ositos',
    tags: ['#pijamapantalon', '#pijamalarga', '#conjuntopijama', '#referencianueva'],
    files: ['ref-406-1.jpg', 'ref-406-2.jpg', 'ref-406-3.jpg', 'ref-406-4.jpg', 'ref-406-5.jpg', 'ref-406-6.jpg'],
  },
  {
    // Marca de agua "407", igual que la blusa de boleros de agosto: el usuario
    // confirmó (13 sep 2026) que las dos prendas son Ref 407.
    key: '407-top',
    ref: '407',
    titulo: 'Crop top + short',
    hook: '🍒 ¡Referencia NUEVA! Crop top de tiras anchas con elástico Dulce Soñadora y short estampado a juego. Fresquito, cómodo y perfecto para las noches de calor.',
    estampados: '5 estampados: corazones lila, moños azules, perrito con corazones, cerezas y ositos',
    tags: ['#pijamashort', '#conjuntopijama', '#pijamafresca', '#referencianueva'],
    files: ['ref-407top-1.jpg', 'ref-407top-2.jpg', 'ref-407top-3.jpg', 'ref-407top-4.jpg', 'ref-407top-5.jpg'],
  },
];

function caption(p: Post): string {
  return [
    `🆕 ¡NUEVO INGRESO! · Ref ${p.ref}`,
    `✨ ${p.titulo} ✨`, '',
    p.hook, '',
    `🎨 ${p.estampados}`,
    p.tallas ? `📏 Tallas: ${p.tallas}` : null, '',
    '🏭 Somos fabricantes · 🚚 Envíos a toda Colombia',
    '📲 WhatsApp 317 727 6506',
    '💬 Escríbenos por DM o pídela en dulcesoñadora.com',
    `\nRef ${p.ref}`, '',
    [...BASE_TAGS, ...p.tags].join(' '),
  ].filter((l) => l !== null).join('\n').replace(/\n{3,}/g, '\n\n');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function withRetry<T>(fn: () => Promise<T>, tries = 4): Promise<T> {
  let last: unknown;
  for (let i = 1; i <= tries; i++) {
    try { return await fn(); } catch (e) { last = e; if (i < tries) await sleep(1200 * i); }
  }
  throw last;
}
function contentType(file: string): string {
  const e = extname(file).toLowerCase();
  return e === '.png' ? 'image/png' : e === '.webp' ? 'image/webp' : 'image/jpeg';
}
const uploadCache = new Map<string, string>();
async function uploadLocal(localPath: string): Promise<string> {
  const hit = uploadCache.get(localPath);
  if (hit) return hit;
  const ct = contentType(localPath);
  const data = readFileSync(localPath);
  const publicUrl = await withRetry(async () => {
    const pres = await fetch(`${API}/media/presign`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: basename(localPath), contentType: ct }),
    });
    if (!pres.ok) throw new Error(`presign ${pres.status}: ${await pres.text()}`);
    const j = (await pres.json()) as { uploadUrl: string; publicUrl: string };
    const put = await fetch(j.uploadUrl, { method: 'PUT', headers: { 'Content-Type': ct }, body: data });
    if (!put.ok) throw new Error(`upload ${put.status}: ${await put.text()}`);
    return j.publicUrl;
  });
  uploadCache.set(localPath, publicUrl);
  return publicUrl;
}

interface Result { key: string; platform: string; ok: boolean; error?: string }

async function publishPost(p: Post): Promise<Result[]> {
  console.log(`\n──────── Ref ${p.ref} · ${p.titulo} (${p.files.length} fotos) ────────`);
  if (DRY) {
    console.log(caption(p));
    console.log('\n[1er comentario]\n' + FIRST_COMMENT);
    const miss = p.files.filter((f) => !existsSync(join(IG_DIR, f)));
    console.log(`\n📷 ${p.files.join(', ')}`);
    if (miss.length) console.log(`⚠ faltan copias 4:5: ${miss.join(', ')}`);
    return TARGETS.map((t) => ({ key: p.key, platform: t.platform, ok: true }));
  }

  let mediaItems: { type: string; url: string }[];
  try {
    mediaItems = [];
    for (const f of p.files) {
      const lp = join(IG_DIR, f);
      if (!existsSync(lp)) throw new Error(`falta copia 4:5: ${lp}`);
      mediaItems.push({ type: 'image', url: await uploadLocal(lp) });
    }
  } catch (e) {
    return TARGETS.map((t) => ({ key: p.key, platform: t.platform, ok: false, error: `subida: ${String(e)}` }));
  }

  const out: Result[] = [];
  for (const t of TARGETS) {
    try {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: caption(p),
          mediaItems,
          platforms: [{ platform: t.platform, accountId: t.accountId, ...firstCommentFor(t.platform) }],
          publishNow: true,
        }),
      });
      const text = await res.text();
      if (!res.ok) { out.push({ key: p.key, platform: t.platform, ok: false, error: `${res.status} ${text.slice(0, 300)}` }); continue; }
      console.log(`  ✓ ${t.platform} publicado`);
      out.push({ key: p.key, platform: t.platform, ok: true });
    } catch (e) {
      out.push({ key: p.key, platform: t.platform, ok: false, error: String(e) });
    }
  }
  return out;
}

async function main() {
  const list = ONLY ? posts.filter((p) => ONLY.includes(p.key)) : posts;
  console.log(`${DRY ? '[DRY] ' : ''}${list.length} carruseles · ${TARGETS.map((t) => t.platform).join(', ') || '(sin cuentas)'} · carpeta ${IG_DIR}`);

  const results: Result[] = [];
  for (let i = 0; i < list.length; i++) {
    results.push(...(await publishPost(list[i])));
    if (!DRY && i < list.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\n────────────────────────────`);
  for (const t of TARGETS) {
    const r = results.filter((x) => x.platform === t.platform);
    console.log(`${t.platform}: ✓ ${r.filter((x) => x.ok).length}/${r.length}`);
  }
  const fail = results.filter((r) => !r.ok);
  if (fail.length) {
    console.log(`\n✗ Fallidos: ${fail.length} (reintenta con ONLY=${[...new Set(fail.map((f) => f.key))].join(',')})`);
    for (const f of fail) console.log(`  ✗ Ref ${f.key} [${f.platform}]: ${f.error}`);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
