import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSession } from '../../hooks/useSession';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { session, isAdmin, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-32 text-center">
        <p className="label-strong">Checking access…</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-32 max-w-2xl">
        <p className="label-strong mb-4">Not authorized</p>
        <h1 className="editorial-h text-4xl mb-6">Account is signed in but not yet an admin.</h1>
        <p className="font-serif text-lg font-light text-ink/70 leading-relaxed">
          Your account exists, but it isn't on the admin list yet. In the Supabase
          SQL editor (project <span className="font-mono text-base">art_portfolio</span>) run:
        </p>
        <pre className="mt-6 p-5 bg-paper-deep font-mono text-[12px] leading-6 overflow-x-auto whitespace-pre-wrap" style={{ borderWidth: '0.5px' }}>
{`insert into public.admin_users (user_id, email)
select id, email from auth.users
where email = 'YOUR_EMAIL_HERE'
on conflict (user_id) do nothing;`}
        </pre>
        <p className="font-serif text-lg font-light text-ink/70 leading-relaxed mt-6">
          Then refresh this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
