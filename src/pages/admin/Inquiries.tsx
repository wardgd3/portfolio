import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Inquiry {
  id: string;
  kind: 'general' | 'inquiry';
  artwork_id: string | null;
  full_name: string;
  email: string;
  message: string;
  created_at: string;
  artwork?: { title: string; slug: string } | null;
}

export default function Inquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*, artwork:artworks(title, slug)')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setItems((data ?? []) as Inquiry[]);
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) alert(error.message);
    else setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 py-12 md:py-16">
      <p className="label-strong mb-3">Mail</p>
      <h1 className="editorial-h text-4xl md:text-5xl">Inquiries</h1>

      {error && <p className="label text-stone-500 mt-6">{error}</p>}

      <div className="rule-t mt-10" style={{ borderTopWidth: '0.5px' }}>
        {loading ? (
          <p className="py-12 text-center label">Loading…</p>
        ) : items.length === 0 ? (
          <p className="py-16 text-center font-serif text-2xl font-light text-ink/60">
            No messages yet.
          </p>
        ) : (
          <ul>
            {items.map((i) => (
              <li
                key={i.id}
                className="py-7 rule-b"
                style={{ borderBottomWidth: '0.5px' }}
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="font-serif text-2xl font-light">{i.full_name}</p>
                    <a href={`mailto:${i.email}`} className="label hover:text-ink underline underline-offset-4">
                      {i.email}
                    </a>
                    <span
                      className={`font-mono uppercase tracking-widewide text-[10.5px] px-2 py-0.5 ${
                        i.kind === 'inquiry'
                          ? 'bg-ink text-paper'
                          : 'border border-ink/30 text-ink/70'
                      }`}
                      style={i.kind === 'inquiry' ? undefined : { borderWidth: '0.5px' }}
                    >
                      {i.kind}
                    </span>
                  </div>
                  <p className="label text-ink/50">
                    {new Date(i.created_at).toLocaleString()}
                  </p>
                </div>
                {i.artwork && (
                  <p className="label mt-2">
                    Re: <a href={`/works/${i.artwork.slug}`} className="underline underline-offset-4">{i.artwork.title}</a>
                  </p>
                )}
                <p className="font-serif text-lg font-light text-ink/80 mt-3 leading-relaxed whitespace-pre-wrap">
                  {i.message}
                </p>
                <div className="mt-4 flex gap-5">
                  <a href={`mailto:${i.email}?subject=Re: ${i.artwork ? i.artwork.title : 'your message'}`} className="label-strong border-b border-ink/40 pb-0.5 hover:border-ink">
                    Reply
                  </a>
                  <button
                    type="button"
                    onClick={() => remove(i.id)}
                    className="label text-stone-500 hover:text-ink"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
