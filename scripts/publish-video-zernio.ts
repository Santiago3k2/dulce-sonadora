/**
 * Publica UN video (Reel / video de FB) vía la API de Zernio.
 *
 * Complementa a publish-zernio.ts, que solo arma carruseles de fotos del
 * catálogo. Acá el insumo es un .mp4 suelto (reel grabado por la marca) con su
 * propio caption, así que va por CLI en vez de leer lib/data/products.
 *
 * IG/FB piden H.264 + AAC en MP4: si el archivo viene en HEVC (lo típico del
 * iPhone) hay que transcodificarlo ANTES — este script no lo hace, solo avisa.
 *
 * Uso:
 *   npx tsx scripts/publish-video-zernio.ts <video.mp4> <caption.txt> [--dry]
 *
 * .env.local: ZERNIO_API_KEY, ZERNIO_IG_ACCOUNT_ID, ZERNIO_FB_ACCOUNT_ID
 * Env: IG_WHEN / FB_WHEN = now | skip (default now)
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { basename } from 'path';

process.loadEnvFile('.env.local');

const API = 'https://zernio.com/api/v1';
const KEY = process.env.ZERNIO_API_KEY;

const [videoPath, captionPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');

if (!videoPath || !captionPath) {
  console.error('Uso: npx tsx scripts/publish-video-zernio.ts <video.mp4> <caption.txt> [--dry]');
  process.exit(1);
}
for (const f of [videoPath, captionPath]) {
  if (!existsSync(f)) { console.error(`No existe: ${f}`); process.exit(1); }
}

const caption = readFileSync(captionPath, 'utf8').trim();

interface Target { platform: string; accountId: string }
const TARGETS: Target[] = [
  process.env.ZERNIO_IG_ACCOUNT_ID && (process.env.IG_WHEN ?? 'now') !== 'skip'
    && { platform: 'instagram', accountId: process.env.ZERNIO_IG_ACCOUNT_ID },
  process.env.ZERNIO_FB_ACCOUNT_ID && (process.env.FB_WHEN ?? 'now') !== 'skip'
    && { platform: 'facebook', accountId: process.env.ZERNIO_FB_ACCOUNT_ID },
].filter((t): t is Target => Boolean(t));

async function main() {
  const mb = (statSync(videoPath).size / 1024 / 1024).toFixed(1);
  console.log(`Video: ${basename(videoPath)} (${mb} MB)`);
  console.log(`Redes: ${TARGETS.map((t) => t.platform).join(', ') || '(ninguna)'}`);
  console.log(`\n──── caption ────\n${caption}\n─────────────────\n`);

  if (DRY) { console.log('[DRY] no se publicó nada.'); return; }
  if (!KEY) { console.error('Falta ZERNIO_API_KEY en .env.local.'); process.exit(1); }
  if (!TARGETS.length) { console.error('No hay redes activas.'); process.exit(1); }

  // 1) Subir el video (presign → PUT)
  const pres = await fetch(`${API}/media/presign`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: basename(videoPath), contentType: 'video/mp4' }),
  });
  if (!pres.ok) { console.error(`presign ${pres.status}: ${await pres.text()}`); process.exit(1); }
  const { uploadUrl, publicUrl } = (await pres.json()) as { uploadUrl: string; publicUrl: string };

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4' },
    body: readFileSync(videoPath),
  });
  if (!put.ok) { console.error(`upload ${put.status}: ${await put.text()}`); process.exit(1); }
  console.log(`✓ Subido: ${publicUrl}`);

  // 2) Un post por red (si una falla, la otra igual sale)
  let fail = 0;
  for (const t of TARGETS) {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: caption,
        mediaItems: [{ type: 'video', url: publicUrl }],
        platforms: [{ platform: t.platform, accountId: t.accountId }],
        publishNow: true,
      }),
    });
    const text = await res.text();
    if (!res.ok) { console.error(`✗ ${t.platform} ${res.status}: ${text.slice(0, 400)}`); fail++; continue; }
    console.log(`✓ ${t.platform}: publicado — ${text.slice(0, 200)}`);
  }
  if (fail) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
