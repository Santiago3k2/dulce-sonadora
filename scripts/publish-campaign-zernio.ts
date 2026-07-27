import { readFileSync, existsSync } from 'fs';
import { basename, extname, dirname, resolve } from 'path';

/**
 * Publica piezas SUELTAS de campaña (una imagen + su caption) en IG / Facebook
 * vía Zernio, cada una con su propia fecha/hora.
 *
 * Complementa a los otros dos scripts:
 *   - publish-zernio.ts        → carruseles del catálogo (lee lib/data/products)
 *   - publish-video-zernio.ts  → un .mp4 suelto
 *   - este                     → piezas gráficas de campaña (historias/destacadas,
 *                                promos, tips), que no son un producto del catálogo.
 *
 * El insumo es un manifiesto JSON:
 *   [{ "file": "ruta.png", "caption": "texto", "at": "2026-07-27T13:00:00" }]
 * Las rutas de "file" se resuelven relativas a la carpeta del manifiesto.
 * Sin "at" la pieza se publica de inmediato.
 *
 * IG exige entre 4:5 (0.80) y 1.91:1 — el script valida la proporción antes de
 * subir para no gastar una llamada en algo que Meta va a rechazar.
 *
 * Uso:  npx tsx scripts/publish-campaign-zernio.ts <manifiesto.json> [--dry]
 *
 * .env.local: ZERNIO_API_KEY, ZERNIO_IG_ACCOUNT_ID, ZERNIO_FB_ACCOUNT_ID
 * Env: IG_WHEN / FB_WHEN = now | skip (default now) · TZ (America/Bogota)
 */

process.loadEnvFile('.env.local');

const API = 'https://zernio.com/api/v1';
const KEY = process.env.ZERNIO_API_KEY;
const TZ = process.env.TZ ?? 'America/Bogota';

const [manifestPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');

if (!manifestPath) {
  console.error('Uso: npx tsx scripts/publish-campaign-zernio.ts <manifiesto.json> [--dry]');
  process.exit(1);
}
if (!existsSync(manifestPath)) { console.error(`No existe: ${manifestPath}`); process.exit(1); }

interface Piece { file: string; caption: string; at?: string; note?: string }
const base = dirname(resolve(manifestPath));
const pieces: Piece[] = JSON.parse(readFileSync(manifestPath, 'utf8'));

interface Target { platform: string; accountId: string }
const TARGETS: Target[] = [
  process.env.ZERNIO_IG_ACCOUNT_ID && (process.env.IG_WHEN ?? 'now') !== 'skip'
    && { platform: 'instagram', accountId: process.env.ZERNIO_IG_ACCOUNT_ID },
  process.env.ZERNIO_FB_ACCOUNT_ID && (process.env.FB_WHEN ?? 'now') !== 'skip'
    && { platform: 'facebook', accountId: process.env.ZERNIO_FB_ACCOUNT_ID },
].filter((t): t is Target => Boolean(t));

const contentType = (f: string) => (extname(f).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Proporción leída del encabezado (PNG: IHDR; JPEG: primer marcador SOFn).
function ratioOf(buf: Buffer): number | null {
  if (buf.readUInt32BE(0) === 0x89504e47) return buf.readUInt32BE(16) / buf.readUInt32BE(20);
  if (buf.readUInt16BE(0) === 0xffd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return buf.readUInt16BE(i + 7) / buf.readUInt16BE(i + 5);
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

async function uploadImage(path: string): Promise<string> {
  const ct = contentType(path);
  const pres = await fetch(`${API}/media/presign`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: basename(path), contentType: ct }),
  });
  if (!pres.ok) throw new Error(`presign ${pres.status}: ${await pres.text()}`);
  const { uploadUrl, publicUrl } = (await pres.json()) as { uploadUrl: string; publicUrl: string };
  const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': ct }, body: readFileSync(path) });
  if (!put.ok) throw new Error(`upload ${put.status}: ${await put.text()}`);
  return publicUrl;
}

async function main() {
  console.log(`${DRY ? '[DRY] ' : ''}${pieces.length} piezas · ${TARGETS.map((t) => t.platform).join(', ') || '(ninguna red)'}\n`);

  // Valida TODO antes de publicar nada: archivo presente y proporción que acepta IG.
  const bad: string[] = [];
  for (const p of pieces) {
    const f = resolve(base, p.file);
    if (!existsSync(f)) { bad.push(`falta el archivo: ${p.file}`); continue; }
    const r = ratioOf(readFileSync(f).subarray(0, 65536));
    if (r === null) { bad.push(`no pude leer la proporción: ${p.file}`); continue; }
    if (r < 0.8 || r > 1.91) bad.push(`proporción ${r.toFixed(3)} fuera del rango IG (0.80–1.91): ${p.file}`);
  }
  if (bad.length) { bad.forEach((b) => console.error(`✗ ${b}`)); process.exit(1); }

  if (DRY) {
    for (const p of pieces) {
      console.log(`──── ${p.note ?? basename(p.file)} · ${p.at ?? 'ahora'} ────`);
      console.log(p.caption + '\n');
    }
    console.log('[DRY] no se publicó nada.');
    return;
  }
  if (!KEY) { console.error('Falta ZERNIO_API_KEY en .env.local.'); process.exit(1); }
  if (!TARGETS.length) { console.error('No hay redes activas.'); process.exit(1); }

  let fail = 0;
  for (const [i, p] of pieces.entries()) {
    const label = p.note ?? basename(p.file);
    let url: string;
    try {
      url = await uploadImage(resolve(base, p.file));
    } catch (e) {
      console.error(`✗ ${label}: ${String(e)}`); fail++; continue;
    }
    for (const t of TARGETS) {
      const res = await fetch(`${API}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: p.caption,
          mediaItems: [{ type: 'image', url }],
          platforms: [{ platform: t.platform, accountId: t.accountId }],
          ...(p.at ? { scheduledFor: p.at, timezone: TZ } : { publishNow: true }),
        }),
      });
      const text = await res.text();
      if (!res.ok) { console.error(`✗ ${label} [${t.platform}] ${res.status}: ${text.slice(0, 300)}`); fail++; continue; }
      console.log(`✓ ${label} → ${t.platform} ${p.at ? `programado ${p.at}` : 'publicado'}`);
    }
    if (i < pieces.length - 1) await sleep(4000);
  }
  if (fail) { console.error(`\n✗ ${fail} fallos.`); process.exit(1); }
  console.log(`\n✓ ${pieces.length} piezas listas.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
