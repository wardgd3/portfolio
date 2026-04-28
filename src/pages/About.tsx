export default function About() {
  return (
    <article className="mx-auto max-w-editorial px-6 md:px-10 pt-16 md:pt-24 pb-24">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
          <p className="label-strong mb-6">About</p>
          <h1 className="editorial-h text-4xl md:text-5xl">A working studio.</h1>
          <p className="font-serif text-lg font-light text-ink/70 mt-6 leading-relaxed">
            Painter and draftsman. Based in Nashville, Tennessee. Working primarily
            in oil, graphite, charcoal, and silverpoint.
          </p>
          <dl className="mt-8 space-y-3">
            <AboutRow label="Studio" value="Nashville, TN" />
            <AboutRow label="Mediums" value="Oil, graphite, charcoal" />
            <AboutRow label="Visits" value="By appointment" />
          </dl>
        </aside>

        <div className="lg:col-span-7 lg:col-start-6 space-y-6 font-serif text-xl md:text-2xl font-light leading-[1.45] text-ink">
          <p>
            The work is concerned with quiet observation — the way afternoon light enters
            a north-facing room, the way folded fabric rests against itself, the way a
            sitter's hands fall into stillness. It is a practice of looking, slowly.
          </p>
          <p>
            Pieces are made in series. Each finished painting begins as a sequence of
            studies on paper: gesture sketches, value studies, drapery exercises. The
            studies are themselves available works, and are not preparatory in any
            disposable sense — they are the practice itself.
          </p>
          <p>
            All works are originals; nothing is reproduced or editioned. Each is signed
            on the verso and accompanied by a certificate of authenticity from the studio.
          </p>
          <p>
            Commissions and exhibition inquiries are considered on a case-by-case basis.
            Studio visits in Nashville are welcome by appointment.
          </p>

          <div className="rule-t pt-8 mt-12 grid sm:grid-cols-2 gap-6 font-serif text-lg">
            <Block label="Selected exhibitions" lines={['Group show, Nashville (2025)', 'Studio open, Spring 2025', 'Drawing exchange, Atlanta (2024)']} />
            <Block label="Selected collections" lines={['Private collections', 'United States &amp; Europe']} />
          </div>
        </div>
      </div>
    </article>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rule-b pb-2" style={{ borderBottomWidth: '0.5px' }}>
      <dt className="label">{label}</dt>
      <dd className="font-serif text-lg font-light text-right">{value}</dd>
    </div>
  );
}

function Block({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div>
      <p className="label mb-3">{label}</p>
      <ul className="space-y-1.5 font-light text-ink/80">
        {lines.map((l, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: l }} />
        ))}
      </ul>
    </div>
  );
}
