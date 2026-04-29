import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useArtwork } from '../hooks/useArtworks';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { AvailabilityBadge } from '../components/AvailabilityBadge';
import { supabase } from '../lib/supabase';
import { cldSrcSet, cldUrl } from '../lib/cloudinary';

export default function Artwork() {
  const { slug } = useParams();
  const { artwork, loading, error } = useArtwork(slug);
  const { add, has } = useCart();
  const nav = useNavigate();
  const [showInquiry, setShowInquiry] = useState(false);

  if (loading) {
    return (
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="aspect-[4/5] bg-paper-deep animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-paper-deep animate-pulse" />
            <div className="h-12 w-3/4 bg-paper-deep animate-pulse" />
            <div className="h-4 w-1/2 bg-paper-deep animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="mx-auto max-w-editorial px-6 md:px-10 py-32 text-center">
        <p className="label-strong mb-4">404</p>
        <h1 className="editorial-h text-4xl mb-6">Work not found</h1>
        <Link to="/gallery" className="btn-ink">Return to all works</Link>
      </div>
    );
  }

  const isSold = artwork.availability === 'sold';
  const isAvailable = artwork.availability === 'available';
  const inCart = has(artwork.id);

  return (
    <>
      <div className="grid lg:grid-cols-2">
        {/* Image — full bleed left */}
        <div className="bg-paper-deep min-h-[60vh] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 md:p-10 lg:rule-r">
          <img
            src={cldUrl(artwork.image_url, { width: 1600 })}
            srcSet={cldSrcSet(artwork.image_url, [800, 1200, 1600, 2000])}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt={artwork.title}
            className={`max-h-[80vh] w-auto max-w-full object-contain ${isSold ? 'grayscale opacity-80' : ''}`}
          />
        </div>

        {/* Purchase panel right */}
        <div className="px-6 md:px-12 lg:px-16 py-12 lg:py-20 max-w-xl">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/gallery" className="label hover:text-ink">← Works</Link>
            <span className="label text-ink/30">/</span>
            {artwork.series && <span className="label">{artwork.series}</span>}
          </div>

          <h1 className="editorial-h text-4xl md:text-5xl">{artwork.title}</h1>

          <dl className="mt-8 space-y-3">
            <Row label="Medium" value={artwork.medium} />
            <Row label="Dimensions" value={artwork.dimensions} />
            {artwork.year && <Row label="Year" value={String(artwork.year)} />}
            <Row label="Edition" value="Original, one of one" />
          </dl>

          <div className="rule-t my-10" />

          <div className="flex items-baseline justify-between gap-4">
            <p className="price text-3xl md:text-4xl">{formatPrice(artwork.price_cents, artwork.currency)}</p>
            <AvailabilityBadge availability={artwork.availability} size="md" />
          </div>

          {artwork.description && (
            <p className="font-serif text-lg font-light leading-relaxed text-ink/80 mt-8">
              {artwork.description}
            </p>
          )}

          <div className="mt-10 space-y-3">
            {isAvailable && !inCart && (
              <button
                type="button"
                onClick={() => add(artwork)}
                className="btn-ink w-full"
              >
                Add to cart
              </button>
            )}
            {isAvailable && inCart && (
              <button
                type="button"
                onClick={() => nav('/cart')}
                className="btn-ink w-full"
              >
                In cart — go to checkout
              </button>
            )}
            {!isAvailable && (
              <button type="button" disabled className="btn-ink w-full opacity-40 cursor-not-allowed">
                {artwork.availability === 'sold' ? 'Sold' : 'Not available'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowInquiry((v) => !v)}
              className="block w-full text-center label-strong border-b border-ink/40 pb-2 hover:border-ink"
            >
              Inquire about this piece
            </button>
          </div>

          {showInquiry && <InquiryForm artworkId={artwork.id} title={artwork.title} />}

          <p className="label mt-10 leading-relaxed text-ink/60">
            Shipping calculated at checkout. Each piece is packed and crated by the studio.
            International orders welcome — please inquire for a quote.
          </p>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rule-b pb-2.5" style={{ borderBottomWidth: '0.5px' }}>
      <dt className="label">{label}</dt>
      <dd className="font-serif text-lg font-light text-right">{value}</dd>
    </div>
  );
}

function InquiryForm({ artworkId, title }: { artworkId: string; title: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I'm interested in "${title}". `);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_submissions').insert({
      kind: 'inquiry',
      artwork_id: artworkId,
      full_name: name,
      email,
      message,
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mt-8 rule-t pt-8">
        <p className="font-serif text-xl font-light">
          Thank you. The studio will reply within a few days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 rule-t pt-8 space-y-5">
      <p className="label">Inquiry</p>
      <input
        required
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-line"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-line"
      />
      <textarea
        required
        rows={3}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="input-line resize-none"
      />
      <button type="submit" disabled={status === 'sending'} className="btn-ghost">
        {status === 'sending' ? 'Sending…' : 'Send inquiry'}
      </button>
      {status === 'error' && <p className="label text-stone-500">Could not send: {errorMsg}</p>}
    </form>
  );
}
