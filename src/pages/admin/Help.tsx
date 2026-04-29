import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <section className="mx-auto max-w-3xl px-6 md:px-10 py-12 md:py-16">
      <p className="label-strong mb-3">Studio handbook</p>
      <h1 className="editorial-h text-4xl md:text-5xl">How to use the admin panel</h1>
      <p className="font-serif text-lg font-light text-ink/70 mt-4 leading-relaxed">
        A practical reference for managing the catalog, orders, and inquiries.
        Bookmark this page — everything you'll need is here.
      </p>

      <Toc />

      <Section anchor="first-time" title="1. First-time setup">
        <P>
          The admin panel is gated by Supabase Auth. The very first time, create your
          account and grant it admin access — you'll only do this once.
        </P>
        <Steps
          items={[
            <>Visit <Code>/admin/login</Code> and choose <em>Create the admin account</em>. Use your studio email and a strong password.</>,
            <>If Supabase email confirmation is enabled, click the link in the email you receive.</>,
            <>Open the Supabase SQL editor for the <Code>art_portfolio</Code> project and run:
              <Pre>{`insert into public.admin_users (user_id, email)
select id, email from auth.users
where email = 'your.email@example.com'
on conflict (user_id) do nothing;`}</Pre>
            </>,
            <>Return to <Code>/admin/login</Code> and sign in. You'll land on the Overview.</>,
          ]}
        />
        <Note>
          To add more admins later, sign them up through the same Login page, then run
          the same insert with their email.
        </Note>
      </Section>

      <Section anchor="works" title="2. Managing works">
        <P>
          The catalog lives at <Code>/admin/works</Code>. From there you can add, edit,
          delete, and change availability for every piece in the studio.
        </P>
        <H3>Adding a new work</H3>
        <Steps
          items={[
            <>Click <strong>+ Add a new work</strong> in the top-right of the Works list.</>,
            <>Upload an image (or paste a Cloudinary public_id / image URL — see <Anchor href="#cloudinary">Cloudinary</Anchor>).</>,
            <>Fill in title, medium, dimensions, year, and price (in USD). The slug auto-generates from the title; you can edit it.</>,
            <>Set series (optional), availability, and check <em>Feature on home page</em> for the hero rotation.</>,
            <>Hit <strong>Create work</strong>. The piece appears in the public gallery immediately.</>,
          ]}
        />
        <H3>Marking a piece as sold</H3>
        <P>
          On the Works list, change the availability dropdown next to the price. Sold
          works stay in the gallery — they're rendered desaturated with a SOLD badge,
          which is the editorial behavior the site is designed for.
        </P>
        <H3>Editing or deleting</H3>
        <P>
          Click <strong>Edit</strong> on the row to change any field. Click <strong>Delete</strong>
          to remove a piece — this can't be undone. Prefer marking <em>Not for sale</em>
          if you want to hide pricing without losing the record.
        </P>
        <H3>Display order</H3>
        <P>
          Sort order is an integer. Lower numbers appear first. Use multiples of 10 (10, 20, 30…)
          so you can insert pieces between existing ones without renumbering everything.
        </P>
      </Section>

      <Section anchor="cloudinary" title="3. Image uploads (Cloudinary)">
        <P>
          Images are hosted on Cloudinary (cloud name <Code>dpqaxzc7g</Code>) for delivery
          optimization and responsive sizing. The image input on the work form supports three modes:
        </P>
        <Steps
          items={[
            <><strong>Direct upload</strong> — click <em>Upload image to Cloudinary</em>. Requires an unsigned upload preset (set up below).</>,
            <><strong>Paste a public_id</strong> — e.g. <Code>studio/still-life-no-1</Code>. Use this when you've uploaded via the Cloudinary dashboard.</>,
            <><strong>Paste a full URL</strong> — works for any external image. Won't get responsive resizing, but is fine for placeholders.</>,
          ]}
        />
        <H3>Setting up the unsigned upload preset (one-time)</H3>
        <Steps
          items={[
            <>Open the <a className="underline underline-offset-4" href="https://console.cloudinary.com/" target="_blank" rel="noreferrer">Cloudinary console</a>.</>,
            <>Go to <strong>Settings → Upload → Upload presets</strong> and click <strong>Add upload preset</strong>.</>,
            <>Set <strong>Signing Mode</strong> to <em>Unsigned</em>, give it a name (e.g. <Code>studio_unsigned</Code>), and save.</>,
            <>Add the preset name to <Code>.env</Code>: <Pre>{`VITE_CLOUDINARY_UPLOAD_PRESET=studio_unsigned`}</Pre> and add the same variable in Netlify under <em>Site settings → Environment variables</em>. Redeploy.</>,
          ]}
        />
        <Note>
          Never put your Cloudinary <strong>API secret</strong> (or signed API key) in the
          frontend. Unsigned presets are designed for browser uploads and don't need them.
        </Note>
      </Section>

      <Section anchor="orders" title="4. Orders">
        <P>
          The Orders tab lists every checkout. For each order you can see the buyer,
          line items, total, and current status. Use the status dropdown to advance an
          order through the workflow:
        </P>
        <Pre>{`pending → paid → shipped`}</Pre>
        <P>
          (Or <Code>cancelled</Code> / <Code>refunded</Code> as needed.) Marking an
          order <Code>shipped</Code> is the signal that the work has left the studio.
          The buyer's email is shown so you can follow up directly.
        </P>
        <Note>
          Until a Stripe webhook is wired up to insert orders automatically, this tab
          will be empty. The Help section on Stripe explains the next step.
        </Note>
      </Section>

      <Section anchor="inquiries" title="5. Inquiries">
        <P>
          Every message from the public Contact page and every <em>Inquire about this piece</em>
          form lands here. Inquiries tagged to a specific work include a link back to
          that artwork. Click <strong>Reply</strong> to open your email client with the
          buyer's address pre-filled.
        </P>
        <P>
          Email <em>delivery</em> isn't wired yet — messages are persisted to the database,
          not pushed to your inbox. To get email notifications, add a Resend integration
          (see Stripe + Email below).
        </P>
      </Section>

      <Section anchor="stripe-email" title="6. Stripe + email (next steps)">
        <H3>Stripe checkout</H3>
        <P>
          Stripe Elements is already integrated and styled to match the site. To activate
          payments you need:
        </P>
        <Steps
          items={[
            <>A Stripe account and <Code>pk_test_…</Code> publishable key. Add it as <Code>VITE_STRIPE_PUBLISHABLE_KEY</Code> in <Code>.env</Code> and Netlify env vars.</>,
            <>A serverless endpoint at <Code>/api/create-payment-intent</Code> that accepts the cart, calculates the total server-side (use the Supabase service role to look up <Code>price_cents</Code>), creates a PaymentIntent, and returns its <Code>clientSecret</Code>. Netlify Functions in <Code>netlify/functions/create-payment-intent.ts</Code> is the easiest path.</>,
            <>A Stripe webhook handler that listens for <Code>payment_intent.succeeded</Code> and inserts a row into <Code>orders</Code> + <Code>order_items</Code>. RLS already lets the service role write.</>,
          ]}
        />
        <H3>Email notifications (Resend)</H3>
        <Steps
          items={[
            <>Create a Resend account and verify the studio's sending domain.</>,
            <>Add a Netlify Function that listens to a Supabase webhook on <Code>contact_submissions.insert</Code> and forwards the payload to Resend.</>,
            <>Add the same for <Code>orders.insert</Code> to send order confirmations to the buyer.</>,
          ]}
        />
      </Section>

      <Section anchor="deploy" title="7. Deploy & domain">
        <P>
          The site is built for Netlify. From the project root run <Code>npm run build</Code>
          locally to verify. Netlify build settings:
        </P>
        <Pre>{`Branch:        main
Base dir:      (blank)
Build command: npm run build
Publish dir:   dist
Functions dir: netlify/functions`}</Pre>
        <H3>Required environment variables</H3>
        <Pre>{`VITE_SUPABASE_URL=https://audihiewqxnhyavpqabw.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_uChxlulxBixO5M7ZUm_OXg_2cDCI84J
VITE_CLOUDINARY_CLOUD_NAME=dpqaxzc7g
VITE_CLOUDINARY_UPLOAD_PRESET=studio_unsigned
VITE_STRIPE_PUBLISHABLE_KEY=         # add when ready`}</Pre>
        <Note>
          The site uses client-side routing. After deploying, add a <Code>public/_redirects</Code>
          file with <Code>/*  /index.html  200</Code> so deep links don't 404.
        </Note>
      </Section>

      <Section anchor="security" title="8. Security & RLS notes">
        <ul className="space-y-2 list-disc pl-5 font-serif text-lg font-light leading-relaxed text-ink/85">
          <li>The <Code>artworks</Code> table is publicly readable. Inserts/updates/deletes require an admin row in <Code>admin_users</Code>.</li>
          <li>The <Code>contact_submissions</Code> table accepts public inserts (so the contact form works without auth) but only admins can read or delete.</li>
          <li>The <Code>orders</Code> and <Code>order_items</Code> tables are admin-read only. Writes happen via the service-role key in your Stripe webhook, never from the browser.</li>
          <li>Never paste your Supabase <strong>service role</strong> key or Stripe <strong>secret</strong> key into the frontend or commit them to git. They live in Netlify Function env vars only.</li>
        </ul>
      </Section>

      <div className="rule-t mt-16 pt-8 flex items-center justify-between flex-wrap gap-3">
        <Link to="/admin" className="label-strong border-b border-ink/40 pb-0.5 hover:border-ink">
          ← Back to overview
        </Link>
        <a
          href="https://supabase.com/dashboard/project/audihiewqxnhyavpqabw"
          target="_blank"
          rel="noreferrer"
          className="label hover:text-ink"
        >
          Open Supabase dashboard ↗
        </a>
      </div>
    </section>
  );
}

function Toc() {
  const items = [
    { href: '#first-time', label: '1. First-time setup' },
    { href: '#works', label: '2. Managing works' },
    { href: '#cloudinary', label: '3. Image uploads (Cloudinary)' },
    { href: '#orders', label: '4. Orders' },
    { href: '#inquiries', label: '5. Inquiries' },
    { href: '#stripe-email', label: '6. Stripe + email' },
    { href: '#deploy', label: '7. Deploy & domain' },
    { href: '#security', label: '8. Security & RLS notes' },
  ];
  return (
    <nav className="rule-t rule-b py-6 my-10" style={{ borderTopWidth: '0.5px', borderBottomWidth: '0.5px' }}>
      <p className="label mb-3">Contents</p>
      <ul className="grid sm:grid-cols-2 gap-y-1.5 gap-x-6 font-serif text-base font-light text-ink/85">
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href} className="hover:text-ink underline-offset-4 hover:underline">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Section({
  anchor,
  title,
  children,
}: {
  anchor: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 scroll-mt-32" id={anchor}>
      <h2 className="editorial-h text-3xl md:text-4xl">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif text-xl md:text-2xl font-light mt-7">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="font-serif text-lg font-light text-ink/85 leading-relaxed">{children}</p>;
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-3 font-serif text-lg font-light text-ink/85 leading-relaxed">
      {items.map((it, i) => (
        <li key={i} className="flex gap-4">
          <span className="font-mono text-[11px] tracking-widewide text-ink/50 mt-1.5 shrink-0">
            {String(i + 1).padStart(2, '0')}
          </span>
          <span className="flex-1">{it}</span>
        </li>
      ))}
    </ol>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className="bg-paper-deep/50 p-5 rule mt-3 font-serif text-base italic text-ink/80 leading-relaxed"
      style={{ borderWidth: '0.5px' }}
    >
      <span className="not-italic font-mono text-[10.5px] uppercase tracking-widewide text-ink/60 mr-2">Note ·</span>
      {children}
    </aside>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[13px] bg-paper-deep px-1.5 py-0.5 rounded-none">
      {children}
    </code>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="mt-3 mb-2 p-4 bg-paper-deep font-mono text-[12px] leading-6 overflow-x-auto whitespace-pre-wrap"
      style={{ borderWidth: '0.5px', borderColor: 'rgba(14,13,11,0.15)' }}
    >
      {children}
    </pre>
  );
}

function Anchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="underline underline-offset-4 hover:text-ink">
      {children}
    </a>
  );
}
