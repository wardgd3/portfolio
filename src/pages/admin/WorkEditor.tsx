import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Artwork, Availability } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';

interface FormState {
  slug: string;
  title: string;
  medium: string;
  series: string;
  dimensions: string;
  year: string;
  price_dollars: string;
  description: string;
  image_url: string;
  availability: Availability;
  sort_order: string;
  featured: boolean;
}

const empty: FormState = {
  slug: '',
  title: '',
  medium: '',
  series: '',
  dimensions: '',
  year: '',
  price_dollars: '',
  description: '',
  image_url: '',
  availability: 'available',
  sort_order: '0',
  featured: false,
};

export default function WorkEditor() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const nav = useNavigate();
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(!isNew);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from('artworks').select('*').eq('id', id).maybeSingle();
      if (!mounted) return;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data) {
        const a = data as Artwork;
        setForm({
          slug: a.slug,
          title: a.title,
          medium: a.medium,
          series: a.series ?? '',
          dimensions: a.dimensions,
          year: a.year ? String(a.year) : '',
          price_dollars: (a.price_cents / 100).toString(),
          description: a.description ?? '',
          image_url: a.image_url,
          availability: a.availability,
          sort_order: String(a.sort_order),
          featured: a.featured,
        });
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id, isNew]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (key === 'title' && isNew && !form.slug) {
      setForm((p) => ({ ...p, slug: slugify(String(value)) }));
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const priceCents = Math.round(parseFloat(form.price_dollars || '0') * 100);
    const yearNum = form.year ? parseInt(form.year, 10) : null;
    const sortOrder = parseInt(form.sort_order || '0', 10);

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      medium: form.medium.trim(),
      series: form.series.trim() || null,
      dimensions: form.dimensions.trim(),
      year: yearNum,
      price_cents: priceCents,
      description: form.description.trim() || null,
      image_url: form.image_url.trim(),
      availability: form.availability,
      sort_order: sortOrder,
      featured: form.featured,
    };

    if (!payload.slug || !payload.title || !payload.medium || !payload.dimensions || !payload.image_url) {
      setError('Title, slug, medium, dimensions, and image are required.');
      setBusy(false);
      return;
    }

    const result = isNew
      ? await supabase.from('artworks').insert(payload).select('id').single()
      : await supabase.from('artworks').update(payload).eq('id', id).select('id').single();

    setBusy(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    nav('/admin/works');
  }

  if (loading) {
    return <p className="py-20 text-center label">Loading…</p>;
  }

  return (
    <section className="mx-auto max-w-3xl px-6 md:px-10 py-12 md:py-16">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/works" className="label hover:text-ink">← Works</Link>
      </div>
      <p className="label-strong mb-3">{isNew ? 'New work' : 'Edit work'}</p>
      <h1 className="editorial-h text-4xl md:text-5xl">
        {isNew ? 'Add a piece to the catalog' : form.title || 'Edit'}
      </h1>

      <form onSubmit={save} className="mt-10 space-y-7">
        <Section label="Image">
          <ImageUploader value={form.image_url} onChange={(v) => update('image_url', v)} />
        </Section>

        <Section label="Title">
          <input
            required
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="input-line"
            placeholder="Still Life No. 1"
          />
        </Section>

        <div className="grid md:grid-cols-2 gap-6">
          <Section label="Slug (URL)">
            <input
              required
              value={form.slug}
              onChange={(e) => update('slug', slugify(e.target.value))}
              className="input-line font-mono text-base"
              placeholder="still-life-no-1"
            />
          </Section>
          <Section label="Sort order">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update('sort_order', e.target.value)}
              className="input-line"
              placeholder="0"
            />
          </Section>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Section label="Medium">
            <input
              required
              value={form.medium}
              onChange={(e) => update('medium', e.target.value)}
              className="input-line"
              placeholder="Oil on linen"
            />
          </Section>
          <Section label="Series (optional)">
            <input
              value={form.series}
              onChange={(e) => update('series', e.target.value)}
              className="input-line"
              placeholder="Interiors"
            />
          </Section>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Section label="Dimensions">
            <input
              required
              value={form.dimensions}
              onChange={(e) => update('dimensions', e.target.value)}
              className="input-line"
              placeholder="24 × 30 in"
            />
          </Section>
          <Section label="Year">
            <input
              type="number"
              value={form.year}
              onChange={(e) => update('year', e.target.value)}
              className="input-line"
              placeholder="2025"
            />
          </Section>
          <Section label="Price (USD)">
            <input
              required
              type="number"
              step="0.01"
              value={form.price_dollars}
              onChange={(e) => update('price_dollars', e.target.value)}
              className="input-line"
              placeholder="3200"
            />
          </Section>
        </div>

        <Section label="Description">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="input-line resize-none"
            placeholder="A meditative interior study…"
          />
        </Section>

        <div className="grid md:grid-cols-2 gap-6 items-end">
          <Section label="Availability">
            <select
              value={form.availability}
              onChange={(e) => update('availability', e.target.value as Availability)}
              className="input-line font-mono uppercase tracking-widewide text-xs"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="nfs">Not for sale</option>
            </select>
          </Section>
          <label className="flex items-center gap-3 pb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="w-4 h-4 accent-ink"
            />
            <span className="label-strong">Feature on home page</span>
          </label>
        </div>

        {error && <p className="label text-stone-500">{error}</p>}

        <div className="rule-t pt-6 flex items-center gap-4">
          <button type="submit" disabled={busy} className="btn-ink">
            {busy ? 'Saving…' : isNew ? 'Create work' : 'Save changes'}
          </button>
          <Link to="/admin/works" className="label-strong">Cancel</Link>
        </div>
      </form>
    </section>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label mb-2">{label}</p>
      {children}
    </div>
  );
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
