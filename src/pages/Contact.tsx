import { useState } from 'react';
import { supabase } from '../lib/supabase';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const { error } = await supabase.from('contact_submissions').insert({
      kind: 'general',
      full_name: name,
      email,
      message,
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    }
  }

  return (
    <section className="mx-auto max-w-editorial px-6 md:px-10 pt-16 md:pt-24 pb-24">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <aside className="lg:col-span-5">
          <p className="label-strong mb-6">Contact</p>
          <h1 className="editorial-h text-4xl md:text-6xl">
            Studio &amp;<br />commissions.
          </h1>
          <p className="font-serif text-lg font-light text-ink/70 mt-6 leading-relaxed max-w-md">
            For acquisitions, commissions, exhibitions, or studio visits. Most messages
            receive a personal reply within a few days.
          </p>
          <dl className="mt-10 space-y-4 max-w-sm">
            <ContactRow label="Email" value="studio@example.com" />
            <ContactRow label="Studio" value="Nashville, TN · By appointment" />
            <ContactRow label="Hours" value="Tues – Sat, 10–5" />
          </dl>
        </aside>

        <div className="lg:col-span-7">
          {status === 'sent' ? (
            <div className="rule-t pt-12">
              <h2 className="editorial-h text-3xl md:text-4xl">Thank you.</h2>
              <p className="font-serif text-lg font-light text-ink/70 mt-4 max-w-md">
                Your note has reached the studio. You'll hear back within a few days.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-7">
              <p className="label-strong">Send a message</p>
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
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-line"
              />
              <textarea
                required
                rows={5}
                placeholder="Tell the studio about your inquiry"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-line resize-none"
              />
              <div className="pt-3">
                <button type="submit" disabled={status === 'sending'} className="btn-ink">
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </div>
              {status === 'error' && (
                <p className="label text-stone-500">Could not send: {errorMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 rule-b pb-2" style={{ borderBottomWidth: '0.5px' }}>
      <dt className="label">{label}</dt>
      <dd className="font-serif text-lg font-light text-right">{value}</dd>
    </div>
  );
}
