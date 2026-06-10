'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputCls =
    'w-full rounded-lg border border-gray-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-deeper/30 focus:border-pink-deeper';
  const labelCls = 'block text-xs font-medium text-text-muted mb-1.5';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
      return;
    }
    router.push('/cuenta');
    router.refresh();
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-sm">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-pink-deeper/10 text-pink-deeper flex items-center justify-center mx-auto mb-4">
          <Heart size={24} />
        </div>
        <h1 className="font-serif text-3xl text-text-dark">Inicia sesión</h1>
        <p className="text-sm text-text-muted mt-1">Accede a tu cuenta de Dulce Soñadora</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-line p-6 space-y-4"
      >
        <div>
          <label className={labelCls}>Correo</label>
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
          <label className={labelCls}>Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
            placeholder="••••••••"
            autoComplete="current-password"
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
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-5">
        ¿No tienes cuenta?{' '}
        <Link href="/cuenta/registro" className="text-pink-deeper font-medium hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
