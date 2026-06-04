import { redirect } from 'next/navigation';
import { getAdminUser } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Panel — Dulce Soñadora',
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');
  return <AdminShell email={user.email ?? ''}>{children}</AdminShell>;
}
