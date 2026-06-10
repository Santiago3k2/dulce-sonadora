'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Heart, MailCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  const inputCls =
    'w-full rounded-lg border border-gray-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const labelCls = 'block text-xs font-medium text-text-muted mb-1.5';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName.trim(), phone: phone.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(
        /already registered/i.test(error.message)
          ? 'Ya existe una cuenta con este correo. Inicia sesión.'
          : 'No se pudo crear la cuenta. Intenta de nuevo.'
      );
      setLoading(false);
      return;
    }
    // Si la confirmación por correo está activa, no hay sesión todavía.
    if (data.session) {
      router.push('/cuenta');
      router.refresh();
    } else {
      setCheckEmail(true);
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-sm text-center">
        <MailCheck size={56} className="mx-auto text-emerald-500 mb-4" strokeWidth={1.5} />
        <h1 className="font-serif text-2xl mb-2">¡Revisa tu correo! 📩</h1>
        <p className="text-sm text-text-muted mb-6">
          Te enviamos un enlace a <span className="font-medium">{email}</span> para confirmar
          tu cuenta. Ábrelo y quedarás dentro.
        </p>
        <Link href="/cuenta/login" className="text-pink-deeper hover:underline text-sm">
          Volver a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-sm">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-pink-deeper/10 text-pink-deeper flex items-center justify-center mx-auto mb-4">
          <Heart size={24} />
        </div>
        <h1 className="font-serif text-3xl text-text-dark">Crea tu cuenta</h1>
        <p className="text-sm text-text-muted mt-1">
          Guarda tus datos y haz seguimiento a tus pedidos
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-line p-6 space-y-4"
      >
        <div>
          <label className={labelCls}>Nombre completo *</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputCls}
            autoComplete="name"
          />
        </div>
        <div>
          <label className={labelCls}>Teléfono / WhatsApp *</label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
            inputMode="tel"
            autoComplete="tel"
          />
        </div>
        <div>
          <label className={labelCls}>Correo *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelCls}>Contraseña *</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-pink-deeper text-white rounded-full py-2.5 text-sm font-semibold hover:bg-pink-dark transition disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-5">
        ¿Ya tienes cuenta?{' '}
        <Link href="/cuenta/login" className="text-pink-deeper font-medium hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
