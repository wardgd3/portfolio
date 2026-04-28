import { Link } from 'react-router-dom';
import { useArtworks } from '../hooks/useArtworks';
import { ArtworkCard } from '../components/ArtworkCard';

export default function Home() {
  const { artworks, loading } = useArtworks();
  const featured = artworks.filter((a) => a.featured).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-editorial px-6 md:px-10 pt-20 md:pt-32 pb-20 md:pb-28">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end">
          <div className="md:col-span-7">
            <p className="label-strong mb-8">Current works · Spring 2026</p>
            <h1 className="editorial-h text-5xl md:text-7xl lg:text-[88px]">
              Quiet light,<br />
              <em className="font-light italic">held in pigment</em><br />
              and graphite.
            </h1>
          </div>
          <div className="md:col-span-5 md:pl-10">
            <p className="font-serif text-lg md:text-xl font-light leading-relaxed text-ink/80">
              A working studio practice in painting and drawing. Original pieces are
              released as they are completed; each is one of one and signed by the artist.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link to="/gallery" className="btn-ink">View all works</Link>
              <Link to="/about" className="btn-ghost">About the studio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured strip */}
      <section className="rule-t">
        <div className="mx-auto max-w-editorial px-6 md:px-10 py-14">
          <div className="flex items-end justify-between mb-10">
            <h2 className="editorial-h text-3xl md:text-4xl">Featured</h2>
            <Link to="/gallery" className="label-strong hover:text-ink/60">All works →</Link>
          </div>
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-14">
              {featured.map((a) => (
                <ArtworkCard key={a.id} artwork={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Series teaser */}
      <section className="rule-t">
        <div className="mx-auto max-w-editorial px-6 md:px-10 py-14 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="label-strong mb-6">Currently working in</p>
            <ul className="font-serif font-light text-3xl md:text-4xl leading-[1.15] space-y-2">
              <li>— Interiors</li>
              <li>— Figure Studies</li>
              <li>— Landscapes</li>
            </ul>
          </div>
          <div className="md:pl-12">
            <p className="font-serif text-lg md:text-xl font-light leading-relaxed text-ink/80">
              Works are made in series, often slowly. Studies on paper sit alongside
              finished oils as part of one continuous practice. Inquiries about commissions,
              exhibitions, and studio visits are always welcome.
            </p>
            <Link to="/contact" className="inline-block mt-7 label-strong border-b border-ink pb-1">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-14">
      {[0, 1, 2].map((i) => (
        <div key={i}>
          <div className="aspect-[4/5] bg-paper-deep animate-pulse" />
          <div className="mt-5 h-4 w-1/2 bg-paper-deep animate-pulse" />
          <div className="mt-2 h-3 w-1/3 bg-paper-deep animate-pulse" />
        </div>
      ))}
    </div>
  );
}
