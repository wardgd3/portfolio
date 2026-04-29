import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Counts {
  works: number;
  available: number;
  sold: number;
  orders: number;
  pendingOrders: number;
  inquiries: number;
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [worksRes, availRes, soldRes, ordersRes, pendingRes, inqRes] = await Promise.all([
        supabase.from('artworks').select('id', { count: 'exact', head: true }),
        supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('availability', 'available'),
        supabase.from('artworks').select('id', { count: 'exact', head: true }).eq('availability', 'sold'),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
      ]);
      if (!mounted) return;
      const firstError = [worksRes, availRes, soldRes, ordersRes, pendingRes, inqRes].find((r) => r.error)?.error;
      if (firstError) {
        setError(firstError.message);
        return;
      }
      setCounts({
        works: worksRes.count ?? 0,
        available: availRes.count ?? 0,
        sold: soldRes.count ?? 0,
        orders: ordersRes.count ?? 0,
        pendingOrders: pendingRes.count ?? 0,
        inquiries: inqRes.count ?? 0,
      });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 py-12 md:py-16">
      <p className="label-strong mb-4">Studio overview</p>
      <h1 className="editorial-h text-4xl md:text-5xl">Welcome.</h1>
      <p className="font-serif text-lg font-light text-ink/70 mt-3 max-w-2xl">
        Manage works, orders, and inquiries below. New here?
        <Link to="/admin/help" className="ml-2 underline underline-offset-4">Read the Help guide.</Link>
      </p>

      {error && <p className="label text-stone-500 mt-8">Error: {error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Stat label="Works in catalog" value={counts?.works ?? '—'} cta={<Link to="/admin/works" className="label-strong">Manage →</Link>} />
        <Stat label="Available" value={counts?.available ?? '—'} />
        <Stat label="Sold" value={counts?.sold ?? '—'} />
        <Stat label="Orders" value={counts?.orders ?? '—'} cta={<Link to="/admin/orders" className="label-strong">View →</Link>} />
        <Stat label="Pending shipment" value={counts?.pendingOrders ?? '—'} />
        <Stat label="Inquiries" value={counts?.inquiries ?? '—'} cta={<Link to="/admin/inquiries" className="label-strong">View →</Link>} />
      </div>

      <div className="rule-t mt-16 pt-8 grid md:grid-cols-2 gap-8">
        <Link to="/admin/works/new" className="btn-ink">+ Add a new work</Link>
        <Link to="/admin/help" className="btn-ghost">Open the Help guide</Link>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  cta,
}: {
  label: string;
  value: number | string;
  cta?: React.ReactNode;
}) {
  return (
    <div className="rule p-6" style={{ borderWidth: '0.5px' }}>
      <p className="label">{label}</p>
      <p className="font-serif text-5xl font-light mt-3 leading-none">{value}</p>
      {cta && <div className="mt-4">{cta}</div>}
    </div>
  );
}
