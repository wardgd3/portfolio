import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import type { Appearance } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import { getStripe, stripeConfigured } from '../lib/stripe';
import { cldUrl } from '../lib/cloudinary';

const stripeAppearance: Appearance = {
  theme: 'flat',
  variables: {
    colorPrimary: '#0e0d0b',
    colorBackground: '#f5f2ed',
    colorText: '#0e0d0b',
    colorDanger: '#7a3a3a',
    fontFamily: '"Cormorant Garamond", serif',
    fontSizeBase: '16px',
    spacingUnit: '5px',
    borderRadius: '0px',
  },
  rules: {
    '.Input': {
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: '0.5px solid rgba(14,13,11,0.3)',
      borderRadius: '0',
      padding: '12px 0',
      boxShadow: 'none',
      fontSize: '18px',
    },
    '.Input:focus': {
      borderBottom: '1px solid #0e0d0b',
      boxShadow: 'none',
    },
    '.Label': {
      fontFamily: '"DM Mono", monospace',
      fontSize: '10.5px',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: 'rgba(14,13,11,0.7)',
    },
    '.Tab': {
      border: '0.5px solid rgba(14,13,11,0.3)',
      borderRadius: '0',
      backgroundColor: 'transparent',
    },
    '.Tab--selected': {
      border: '0.5px solid #0e0d0b',
      backgroundColor: '#0e0d0b',
      color: '#f5f2ed',
    },
  },
};

export default function Checkout() {
  const { lines, subtotalCents, count } = useCart();
  const nav = useNavigate();

  useEffect(() => {
    if (count === 0) {
      nav('/cart', { replace: true });
    }
  }, [count, nav]);

  if (count === 0) return null;

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 pt-16 md:pt-24 pb-24">
      <p className="label-strong mb-6">Checkout</p>
      <h1 className="editorial-h text-4xl md:text-5xl">Complete your order</h1>

      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start mt-12">
        {/* Form */}
        <div className="lg:col-span-7">
          {stripeConfigured ? (
            <StripeForm subtotalCents={subtotalCents} />
          ) : (
            <ManualCheckoutNotice />
          )}
        </div>

        {/* Order summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-32 self-start">
          <div className="rule-t pt-6" style={{ borderTopWidth: '0.5px' }}>
            <p className="label-strong">Order</p>
          </div>
          <ul className="mt-5 space-y-5">
            {lines.map((l) => (
              <li key={l.artwork.id} className="flex gap-4 items-start">
                <div className="w-16 aspect-[4/5] bg-paper-deep overflow-hidden shrink-0">
                  <img src={cldUrl(l.artwork.image_url, { width: 200, aspectRatio: '4:5' })} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-lg font-light leading-tight truncate">{l.artwork.title}</p>
                  <p className="label mt-1">{l.artwork.medium}</p>
                </div>
                <p className="font-serif text-lg font-light">
                  {formatPrice(l.artwork.price_cents, l.artwork.currency)}
                </p>
              </li>
            ))}
          </ul>
          <div className="rule-t mt-7 pt-5 space-y-2.5" style={{ borderTopWidth: '0.5px' }}>
            <SumRow label="Subtotal" value={formatPrice(subtotalCents)} />
            <SumRow label="Shipping" value="—" muted />
            <div className="rule-t pt-4 flex items-baseline justify-between" style={{ borderTopWidth: '0.5px' }}>
              <p className="label-strong">Total</p>
              <p className="price text-2xl">{formatPrice(subtotalCents)}</p>
            </div>
          </div>
          <p className="label mt-6 leading-relaxed text-ink/60">
            Each piece is packed and shipped by the studio. Shipping &amp; insurance
            quoted to your address before payment is captured.
          </p>
        </aside>
      </div>
    </section>
  );
}

function StripeForm({ subtotalCents }: { subtotalCents: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const stripePromise = useMemo(() => getStripe(), []);

  useEffect(() => {
    // Production: POST to your /api/create-payment-intent with the cart contents,
    // calculate the total server-side, and return { clientSecret }.
    // Placeholder until that endpoint exists:
    setClientSecret(null);
  }, [subtotalCents]);

  if (!clientSecret) {
    return (
      <div className="rule-t pt-8" style={{ borderTopWidth: '0.5px' }}>
        <p className="label-strong mb-4">Payment</p>
        <p className="font-serif text-lg font-light text-ink/80 leading-relaxed">
          Card &amp; Apple/Google Pay via Stripe. Once your backend
          <span className="font-mono text-base">{` /api/create-payment-intent `}</span>
          endpoint is live, the form below will render Stripe Elements styled to match the site.
        </p>
        <div className="mt-6 rule p-6 bg-paper-deep/40 space-y-4" style={{ borderWidth: '0.5px' }}>
          <Field label="Email" placeholder="you@example.com" />
          <Field label="Card" placeholder="Stripe Elements will mount here" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry" placeholder="MM / YY" />
            <Field label="CVC" placeholder="•••" />
          </div>
        </div>
        <button type="button" disabled className="btn-ink mt-6 w-full opacity-40 cursor-not-allowed">
          Pay {formatPrice(subtotalCents)}
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
      <StripePaymentInner subtotalCents={subtotalCents} />
    </Elements>
  );
}

function StripePaymentInner({ subtotalCents }: { subtotalCents: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setErrorMsg(null);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout?status=success`,
      },
    });
    if (result.error) {
      setErrorMsg(result.error.message ?? 'Payment failed');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rule-t pt-8 space-y-6" style={{ borderTopWidth: '0.5px' }}>
      <p className="label-strong">Payment</p>
      <PaymentElement />
      {errorMsg && <p className="label text-stone-500">{errorMsg}</p>}
      <button type="submit" disabled={!stripe || submitting} className="btn-ink w-full">
        {submitting ? 'Processing…' : `Pay ${formatPrice(subtotalCents)}`}
      </button>
    </form>
  );
}

function ManualCheckoutNotice() {
  return (
    <div className="rule-t pt-8 space-y-6" style={{ borderTopWidth: '0.5px' }}>
      <p className="label-strong">Payment</p>
      <p className="font-serif text-lg font-light text-ink/80 leading-relaxed">
        Stripe is not yet configured for this storefront. Set
        <span className="font-mono text-base mx-1">VITE_STRIPE_PUBLISHABLE_KEY</span>
        in <span className="font-mono text-base">.env</span> and add a
        <span className="font-mono text-base mx-1">/api/create-payment-intent</span>
        endpoint to enable card payments.
      </p>
      <p className="font-serif text-lg font-light text-ink/80 leading-relaxed">
        In the meantime, every work has an
        <em className="italic"> Inquire about this piece </em>
        link on its detail page — sales can be placed by direct invoice.
      </p>
      <Link to="/contact" className="btn-ghost">Contact the studio to purchase</Link>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div>
      <p className="label mb-2">{label}</p>
      <div className="border-b border-ink/30 py-3 text-ink/40 font-serif text-lg" style={{ borderBottomWidth: '0.5px' }}>
        {placeholder}
      </div>
    </div>
  );
}

function SumRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="label">{label}</span>
      <span className={`font-serif text-lg font-light ${muted ? 'text-ink/50' : ''}`}>{value}</span>
    </div>
  );
}
