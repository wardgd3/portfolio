import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSession } from '../../hooks/useSession';

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/works', label: 'Works' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/help', label: 'Help' },
];

export function AdminLayout() {
  const { session } = useSession();
  const nav = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    nav('/admin/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      {/* Top bar */}
      <header className="rule-b sticky top-0 z-30 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto max-w-editorial px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <Link to="/" className="font-serif text-2xl font-light tracking-tight">Studio</Link>
            <span className="label">/ Admin</span>
          </div>
          <div className="flex items-center gap-6">
            {session?.user.email && (
              <span className="hidden sm:inline label">{session.user.email}</span>
            )}
            <Link to="/" className="label hover:text-ink">View site →</Link>
            <button type="button" onClick={signOut} className="label-strong hover:text-ink/60">
              Sign out
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        <nav className="mx-auto max-w-editorial px-6 md:px-10 flex gap-8 overflow-x-auto h-12 items-center rule-t" style={{ borderTopWidth: '0.5px' }}>
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `label-strong whitespace-nowrap pb-3 -mb-px ${
                  isActive ? 'border-b border-ink' : 'border-b border-transparent text-ink/60 hover:text-ink'
                }`
              }
              style={{ borderBottomWidth: '0.5px' }}
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
