import { createClient } from '@supabase/supabase-js';

// Crea (o actualiza) un usuario admin y lo registra en la tabla admins.
// Uso: npx tsx scripts/create-admin.ts <email> <password>
process.loadEnvFile('.env.local');

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const EMAIL = process.argv[2];
const PASSWORD = process.argv[3];

async function main() {
  if (!EMAIL || !PASSWORD) throw new Error('Uso: tsx scripts/create-admin.ts <email> <password>');

  const { data: list, error: le } = await sb.auth.admin.listUsers();
  if (le) throw le;
  let user = list.users.find((u) => u.email?.toLowerCase() === EMAIL.toLowerCase()) ?? null;

  if (!user) {
    const { data, error } = await sb.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    });
    if (error) throw error;
    user = data.user;
    console.log('Usuario creado.');
  } else {
    const { error } = await sb.auth.admin.updateUserById(user.id, { password: PASSWORD });
    if (error) throw error;
    console.log('Usuario ya existía → contraseña actualizada.');
  }

  const { error: ae } = await sb
    .from('admins')
    .upsert({ user_id: user!.id, email: EMAIL }, { onConflict: 'user_id' });
  if (ae) throw ae;

  console.log(`✅ Admin listo: ${EMAIL}`);
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
