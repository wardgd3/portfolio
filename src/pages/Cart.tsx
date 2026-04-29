import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { cldUrl } from '../lib/cloudinary';

export default function Cart() {
  const { lines, remove, subtotalCents, count } = useCart();

  if (count === 0) {
    return (
      <section className="mx-auto max-w-editorial px-6 md:px-10 pt-24 pb-24 text-center">
        <p className="label-strong mb-6">Cart</p>
        <h1 className="editorial-h text-4xl md:text-5xl">No works held.</h1>
        <p className="font-serif text-lg font-light text-ink/70 mt-6 max-w-md mx-auto">
          Browse the current works and add a piece to your cart to begin.
        </p>
        <Link to="/gallery" className="btn-ink mt-10 inline-flex">View all works</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 pt-16 md:pt-24 pb-24">
      <p className="label-strong mb-6">Cart</p>
      <h1 className="editorial-h text-4xl md:text-5xl">Held in cart</h1>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start mt-12">
        <ul className="lg:col-span-8 rule-t" style={{ borderTopWidth: '0.5px' }}>
          {lines.map((line) => (
            <li
              key={line.artwork.id}
              className="grid grid-cols-[100px_1fr_auto] md:grid-cols-[140px_1fr_auto_auto] gap-5 md:gap-8 py-7 rule-b items-start"
              style={{ borderBottomWidth: '0.5px' }}
            >
              <Link to={`/works/${line.artwork.slug}`} className="block">
                <div className="aspect-[4/5] bg-paper-deep overflow-hidden">
                  <img
                    src={cldUrl(line.artwork.image_url, { width: 280, aspectRatio: '4:5' })}
                    alt={line.artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <Link
                  to={`/works/${line.artwork.slug}`}
                  className="font-serif text-2xl font-light leading-tight"
                >
                  {line.artwork.title}
                </Link>
                <p className="label mt-2">{line.artwork.medium}</p>
                <p className="label mt-1">{line.artwork.dimensions}{line.artwork.year ? ` · ${line.artwork.year}` : ''}</p>
                <button
                  type="button"
                  onClick={() => remove(line.artwork.id)}
                  className="mt-4 label-strong border-b border-ink/40 pb-0.5 hover:border-ink"
                >
                  Remove
                </button>
              </div>
              <p className="hidden md:block label self-center text-ink/60">Qty 01</p>
              <p className="price text-xl md:text-2xl text-right self-center">
                {formatPrice(line.artwork.price_cents, line.artwork.currency)}
              </p>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-5">
          <div className="rule-t pt-6" style={{ borderTopWidth: '0.5px' }}>
            <p className="label-strong">Summary</p>
          </div>
          <SumRow label="Subtotal" value={formatPrice(subtotalCents)} />
          <SumRow label="Shipping" value="Calculated at checkout" />
          <div className="rule-t pt-5 flex items-baseline justify-between" style={{ borderTopWidth: '0.5px' }}>
            <p className="label-strong">Total</p>
            <p className="price text-2xl">{formatPrice(subtotalCents)}</p>
          </div>
          <Link to="/checkout" className="btn-ink w-full block text-center mt-4">
            Continue to checkout
          </Link>
          <Link to="/gallery" className="block text-center label-strong pt-2 hover:text-ink/60">
            ← Continue browsing
          </Link>
        </aside>
      </div>
    </section>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="label">{label}</span>
      <span className="font-serif text-lg font-light">{value}</span>
    </div>
  );
}
