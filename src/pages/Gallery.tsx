import { useMemo, useState } from 'react';
import { useArtworks } from '../hooks/useArtworks';
import { ArtworkCard } from '../components/ArtworkCard';
import { FilterBar, type SortKey } from '../components/FilterBar';

export default function Gallery() {
  const { artworks, loading, error } = useArtworks();
  const [medium, setMedium] = useState('');
  const [series, setSeries] = useState('');
  const [sort, setSort] = useState<SortKey>('curated');

  const { mediums, seriesList } = useMemo(() => {
    const m = new Set<string>();
    const s = new Set<string>();
    for (const a of artworks) {
      if (a.medium) m.add(a.medium);
      if (a.series) s.add(a.series);
    }
    return {
      mediums: Array.from(m).sort(),
      seriesList: Array.from(s).sort(),
    };
  }, [artworks]);

  const filtered = useMemo(() => {
    let list = artworks;
    if (medium) list = list.filter((a) => a.medium === medium);
    if (series) list = list.filter((a) => a.series === series);
    list = [...list];
    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price_cents - b.price_cents); break;
      case 'price-desc': list.sort((a, b) => b.price_cents - a.price_cents); break;
      case 'newest': list.sort((a, b) => (b.year ?? 0) - (a.year ?? 0)); break;
      case 'curated':
      default:
        list.sort((a, b) => a.sort_order - b.sort_order);
        break;
    }
    return list;
  }, [artworks, medium, series, sort]);

  return (
    <>
      <section className="mx-auto max-w-editorial px-6 md:px-10 pt-16 md:pt-24 pb-10">
        <p className="label-strong mb-6">Works</p>
        <h1 className="editorial-h text-4xl md:text-6xl max-w-3xl">
          Available paintings &amp; drawings
        </h1>
        <p className="font-serif text-lg md:text-xl font-light leading-relaxed text-ink/70 mt-6 max-w-2xl">
          Browse the current studio inventory. Sold works remain visible for reference.
          For studio visits or holds, please reach out directly.
        </p>
      </section>

      <FilterBar
        mediums={mediums}
        series={seriesList}
        selectedMedium={medium}
        selectedSeries={series}
        sort={sort}
        onMedium={setMedium}
        onSeries={setSeries}
        onSort={setSort}
        total={filtered.length}
      />

      <section className="mx-auto max-w-editorial px-6 md:px-10 py-14">
        {error && (
          <p className="font-mono text-sm text-stone-500">Could not load works: {error}</p>
        )}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-14">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/5] bg-paper-deep animate-pulse" />
                <div className="mt-5 h-4 w-1/2 bg-paper-deep animate-pulse" />
                <div className="mt-2 h-3 w-1/3 bg-paper-deep animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="font-serif text-2xl font-light text-ink/60 py-20 text-center">
            No works match the current filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-14">
            {filtered.map((a) => (
              <ArtworkCard key={a.id} artwork={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
