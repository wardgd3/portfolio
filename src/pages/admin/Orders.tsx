import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/format';

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price_cents: number;
}

interface Order {
  id: string;
  email: string;
  full_name: string | null;
  total_cents: number;
  currency: string;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled' | 'refunded';
  created_at: string;
  notes: string | null;
  shipping_address: Record<string, unknown> | null;
  order_items: OrderItem[];
}

const statuses: Order['status'][] = ['pending', 'paid', 'shipped', 'cancelled', 'refunded'];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(id, title, quantity, unit_price_cents)')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setOrders((data ?? []) as Order[]);
    setLoading(false);
  }

  async function setStatus(id: string, status: Order['status']) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      alert(`Could not update: ${error.message}`);
    } else {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  }

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 py-12 md:py-16">
      <p className="label-strong mb-3">Sales</p>
      <h1 className="editorial-h text-4xl md:text-5xl">Orders</h1>

      {error && <p className="label text-stone-500 mt-6">{error}</p>}

      <div className="rule-t mt-10" style={{ borderTopWidth: '0.5px' }}>
        {loading ? (
          <p className="py-12 text-center label">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="py-16 text-center font-serif text-2xl font-light text-ink/60">
            No orders yet.
          </p>
        ) : (
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                className="py-6 rule-b grid md:grid-cols-[1fr_auto] gap-5 md:gap-10 items-start"
                style={{ borderBottomWidth: '0.5px' }}
              >
                <div>
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="font-serif text-xl font-light">{o.full_name || o.email}</p>
                    <p className="label">{o.email}</p>
                    <p className="label text-ink/50">
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <ul className="mt-2 space-y-1 font-serif text-base font-light text-ink/80">
                    {o.order_items?.map((item) => (
                      <li key={item.id}>
                        — {item.title} {item.quantity > 1 && `(×${item.quantity})`}
                      </li>
                    ))}
                  </ul>
                  {o.notes && <p className="mt-2 label text-ink/60">Note: {o.notes}</p>}
                </div>
                <div className="md:text-right space-y-3">
                  <p className="price text-2xl">{formatPrice(o.total_cents, o.currency)}</p>
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value as Order['status'])}
                    className="bg-transparent font-mono uppercase tracking-widewide text-[11px] py-1 pr-6 pl-1 cursor-pointer focus:outline-none"
                    style={{ borderBottomWidth: '0.5px', borderBottomColor: 'rgba(14,13,11,0.3)' }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
