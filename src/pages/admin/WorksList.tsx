import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Artwork, Availability } from '../../types';
import { formatPrice } from '../../lib/format';
import { cldUrl } from '../../lib/cloudinary';

const availabilities: Availability[] = ['available', 'sold', 'reserved', 'nfs'];

export default function WorksList() {
  const [works, setWorks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) setError(error.message);
    else setWorks((data ?? []) as Artwork[]);
    setLoading(false);
  }

  async function setAvailability(id: string, availability: Availability) {
    setBusyId(id);
    const { error } = await supabase.from('artworks').update({ availability }).eq('id', id);
    if (error) {
      alert(`Could not update: ${error.message}`);
    } else {
      setWorks((prev) => prev.map((w) => (w.id === id ? { ...w, availability } : w)));
    }
    setBusyId(null);
  }

  async function remove(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusyId(id);
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    if (error) {
      alert(`Could not delete: ${error.message}`);
    } else {
      setWorks((prev) => prev.filter((w) => w.id !== id));
    }
    setBusyId(null);
  }

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="label-strong mb-3">Catalog</p>
          <h1 className="editorial-h text-4xl md:text-5xl">Works</h1>
        </div>
        <Link to="/admin/works/new" className="btn-ink">+ Add a new work</Link>
      </div>

      {error && <p className="label text-stone-500 mt-6">{error}</p>}

      <div className="rule-t mt-10" style={{ borderTopWidth: '0.5px' }}>
        {loading ? (
          <p className="py-12 text-center label">Loading works…</p>
        ) : works.length === 0 ? (
          <p className="py-16 text-center font-serif text-2xl font-light text-ink/60">
            No works yet. Add the first piece.
          </p>
        ) : (
          <ul>
            {works.map((w) => (
              <li
                key={w.id}
                className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_2fr_1fr_auto_auto] gap-5 md:gap-6 py-5 rule-b items-center"
                style={{ borderBottomWidth: '0.5px' }}
              >
                <div className="aspect-[4/5] bg-paper-deep overflow-hidden">
                  {w.image_url && (
                    <img
                      src={cldUrl(w.image_url, { width: 160, aspectRatio: '4:5' })}
                      alt=""
                      className={`w-full h-full object-cover ${w.availability === 'sold' ? 'grayscale opacity-70' : ''}`}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    to={`/admin/works/${w.id}`}
                    className="font-serif text-xl md:text-2xl font-light leading-tight hover:underline underline-offset-4"
                  >
                    {w.title}
                  </Link>
                  <p className="label mt-1.5">{w.medium} · {w.dimensions}{w.year ? ` · ${w.year}` : ''}</p>
                  {w.series && <p className="label mt-1 text-ink/50">Series: {w.series}</p>}
                </div>
                <div className="md:text-right">
                  <p className="price text-lg">{formatPrice(w.price_cents, w.currency)}</p>
                </div>
                <div className="hidden md:block">
                  <select
                    value={w.availability}
                    disabled={busyId === w.id}
                    onChange={(e) => setAvailability(w.id, e.target.value as Availability)}
                    className="bg-transparent font-mono uppercase tracking-widewide text-[11px] py-1 pr-6 pl-1 cursor-pointer focus:outline-none"
                    style={{ borderBottomWidth: '0.5px', borderBottomColor: 'rgba(14,13,11,0.3)' }}
                  >
                    {availabilities.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 md:gap-4 justify-end col-span-2 md:col-span-1">
                  <Link to={`/admin/works/${w.id}`} className="label-strong border-b border-ink/40 pb-0.5 hover:border-ink">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(w.id, w.title)}
                    disabled={busyId === w.id}
                    className="label text-stone-500 border-b border-stone-300 pb-0.5 hover:text-ink"
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
