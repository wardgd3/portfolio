import { Link } from 'react-router-dom';
import type { Artwork } from '../types';
import { formatPrice } from '../lib/format';
import { AvailabilityBadge } from './AvailabilityBadge';
import { cldSrcSet, cldUrl } from '../lib/cloudinary';

interface Props {
  artwork: Artwork;
}

export function ArtworkCard({ artwork }: Props) {
  const isSold = artwork.availability === 'sold';

  return (
    <Link
      to={`/works/${artwork.slug}`}
      className="group block"
      aria-label={`${artwork.title}, ${artwork.medium}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-deep">
        <img
          src={cldUrl(artwork.image_url, { width: 800, aspectRatio: '4:5' })}
          srcSet={cldSrcSet(artwork.image_url, [400, 600, 800, 1200], { aspectRatio: '4:5' })}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={artwork.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]
                     ${isSold ? 'grayscale opacity-70' : ''}`}
        />
        {isSold && (
          <div className="absolute inset-0 flex items-start justify-end p-4 pointer-events-none">
            <span className="font-mono uppercase tracking-widewide text-[10.5px] bg-ink text-paper px-2.5 py-1">
              Sold
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 className="font-serif text-xl md:text-2xl font-light leading-tight truncate">
            {artwork.title}
          </h3>
          <p className="label mt-1.5">{artwork.medium}</p>
          <p className="label mt-1">{artwork.dimensions}{artwork.year ? ` · ${artwork.year}` : ''}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="price text-lg md:text-xl">{formatPrice(artwork.price_cents, artwork.currency)}</p>
          <div className="mt-2">
            <AvailabilityBadge availability={artwork.availability} />
          </div>
        </div>
      </div>
    </Link>
  );
}
