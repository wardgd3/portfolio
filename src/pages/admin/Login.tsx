import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSession } from '../../hooks/useSession';

type Mode = 'signin' | 'signup';

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const nav = useNavigate();
  const location = useLocation();
  const { session, isAdmin, loading } = useSession();

  useEffect(() => {
    if (!loading && session && isAdmin) {
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/admin';
      nav(from, { replace: true });
    }
  }, [loading, session, isAdmin, nav, location.state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo(
          'Account created. If email confirmation is enabled in Supabase Auth, check your inbox before signing in. Then run the admin-grant SQL from the Help page.',
        );
        setMode('signin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 md:px-10 pt-24 pb-24">
      <p className="label-strong mb-6">Admin</p>
      <h1 className="editorial-h text-4xl md:text-5xl">
        {mode === 'signin' ? 'Sign in' : 'Create account'}
      </h1>
      <p className="font-serif text-lg font-light text-ink/70 mt-4 leading-relaxed">
        {mode === 'signin'
          ? 'Studio access only. Use your administrator email and password.'
          : 'Create the studio admin account. Confirm via email if required, then grant yourself admin via SQL (see Help).'}
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <input
          required
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-line"
        />
        <input
          required
          type="password"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-line"
        />
        <button type="submit" disabled={busy} className="btn-ink w-full">
          {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        {error && <p className="label text-stone-500">{error}</p>}
        {info && <p className="label text-ink/70 leading-relaxed">{info}</p>}
      </form>

      <div className="rule-t mt-10 pt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
          className="label-strong border-b border-ink/40 pb-0.5 hover:border-ink"
        >
          {mode === 'signin' ? 'Create the admin account' : 'I have an account → sign in'}
        </button>
        <Link to="/" className="label hover:text-ink">← Site</Link>
      </div>
    </section>
  );
}
